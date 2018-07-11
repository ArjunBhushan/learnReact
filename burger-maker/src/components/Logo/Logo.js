import React from 'react';

import burgerLogo from './../../assets/images/burger-logo.png';
import styles from './Logo.css';

const logo = (props) => {
  return (
    <div className = {styles.Logo}>
      <img src = {burgerLogo} alt = "MyBurger"></img>
    </div>
  );
};

export default logo;
