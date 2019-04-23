import React, { Component } from 'react';
import api from '../../services/api';
import DropBoxIcon from '../../assets/dropbox-icon.svg';
import './styles.css';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newBox: '',
    };
  }

  handleInputChange = e => {
    const newBox = e.target.value;
    this.setState({
      newBox,
    });
  }

  handleSubmit = async e => {
    e.preventDefault();
    const response = await api.post('boxes', {
      title: this.state.newBox
    });
    const { _id } = response.data;
    this.props.history.push(`/box/${_id}`)
    console.log('api response: ', response.data);
  }

  render() {
    return (
      <div id="main-container">
        <img src={DropBoxIcon} alt=""/>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Nome do Box"
            onChange={this.handleInputChange}
            />
          <button type="submit">Criar</button>
        </form>
      </div>
    );
  }
}
