import React, { Component } from 'react';
import "../styles/Footer.scss";
import img from "../assets/img/icon-left-font-monochrome-black.svg";

class Footer extends Component {
    render() {
        return (
            <div className='footer-container'>
                <h1>© 2022</h1>
                <img src={img} alt="Logo"/>
                <h2>Tous droits réservés</h2>
            </div>
        );
    }
}

export default Footer;