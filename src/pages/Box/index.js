import React, { Component } from 'react';
import { MdInsertDriveFile } from 'react-icons/md';
import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Dropzone from 'react-dropzone';
import socket from 'socket.io-client';

import api from '../../services/api';
import DropBoxIcon from '../../assets/dropbox-icon.svg';
import './styles.css';

export default class Box extends Component {
  constructor(props) {
    super(props);
    this.state = {
      box: { }
    }
  }
  
  subscribeToNewFiles = () => {
    const { id } = this.props.match.params;
    const io = socket('http://omnistack-back-api.herokuapp.com');
    io.emit('connectRoom', id);
    io.on('file', data => {
      this.setState({
        box: {
          ...this.state.box,
          files: [data, ...this.state.box.files],
        }
      });
    })
  }

  async componentDidMount() {
    this.subscribeToNewFiles();
    const { id } = this.props.match.params;
    const response = await api.get(`boxes/${id}`);
    this.setState({
      box: response.data
    });
  }

  handleUpload = (files) => {
    files.forEach(file => {
      const { id } = this.props.match.params;
      const data = new FormData();
      data.append('file', file);
      api.post(`boxes/${id}/files`, data);
    });
  }

  render() {
    const { title, files } = this.state.box;
    return (
      <div id="box-container">
        <header>
          <img src={DropBoxIcon} alt=""/>
          <h1>{ title }</h1>
        </header>
        <Dropzone onDropAccepted={this.handleUpload}>
          {({ getRootProps, getInputProps }) => (
            <div className="upload" {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Arraste arquivos ou clique aqui</p>
            </div>
          )}
        </Dropzone>
        <ul>
          { files && files.map(file => (
            <li key={file._id}>
              <a href={file.url} target="_blank">
                <MdInsertDriveFile size={14} color="#A5Cfff" />
                <strong>{file.title}</strong>
              </a>
              <span>há {distanceInWords(file.createdAt, new Date(), {
                locale: pt
              })}</span>
            </li>
          )) }
        </ul>
      </div>
    );
  }
}
