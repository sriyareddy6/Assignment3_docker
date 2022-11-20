import React, { Component } from 'react';
import Cards from './components/Cards/Cards';
import CountryPicker from './components/CountryPicker/CountryPicker';
import image from './images/image.png';
import styles from './App.module.css';
import { fetchData } from './api';

class covid extends React.Component {
  state = {
    data: {},
    country: '',
  };

  async componentDidMount() {
    const data = await fetchData();

    this.setState({ data });
  }

  handleCountryChange = async (country) => {
    const data = await fetchData(country);

    this.setState({ data, country: country });
  };

  render() {
    const { data, country } = this.state;

    return (
      <div className={styles.container}>
        <img className={styles.image} src={image} alt='COVID-19' />
        <Cards data={data} />
        <CountryPicker handleCountryChange={this.handleCountryChange} />
      </div>
    );
  }
}

export default covid;
