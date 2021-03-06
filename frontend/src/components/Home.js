import React, { useState } from "react";
import "../styles/Home.scss";
import img from "../assets/img/icon-above-font.svg";
import Signup from "./Signup";
import Login from "./Login";

export default function Home() {
  const [stateHome, setStateHome] = useState(1);

  const goLOG = () => {
    setStateHome(1);
  };

  const goSIGN = () => {
    setStateHome(2);
  };

  return (
    <React.Fragment>
      <div className="container-deco"></div>
      <div className="presentation">
        <h1>Bienvenue sur le Réseau Social de l'entreprise</h1>
      </div>

      <div className="logo-home ">
        <img src={img} alt="Logo" />
      </div>

      <div className="form-container">
      <div className="form">

        <div className="contBtn">
          <div onClick={goLOG} className="onglets">
            Se Connecter
          </div>
          <div onClick={goSIGN} className="onglets">
            S'inscrire
          </div>
        </div>

        <div className="container">
          {stateHome === 1 ? (
            <div className="contenu login">
                <Login />
            </div>
          ) : (
            <div className="contenu signup">
                <Signup />
            </div>
          )}
        </div>
        </div>
        
      </div>
    </React.Fragment>
  );
}
