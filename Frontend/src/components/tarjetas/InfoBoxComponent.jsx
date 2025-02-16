// InfoBoxComponent.jsx
import React from "react";
import LogoSkill from "@components/tarjetas/LogoSkill.jsx";

const InfoBoxComponent = ({ subject, tech, info }) => {
  return (
    <div className="info-container">
      <div className="info-box">
        <h3 className="info-title">{`${subject}`}</h3>
        <h5>Info:</h5>
        <p className="info-tech">{info}</p>
        <h5>Tecnologias:</h5>
        <LogoSkill skills={tech}></LogoSkill>
      </div>
    </div>
  );
};

export default InfoBoxComponent;
