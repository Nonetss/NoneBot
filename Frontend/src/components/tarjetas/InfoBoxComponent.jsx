// InfoBoxComponent.jsx
import React from "react";

const InfoBoxComponent = ({ subject, tech }) => {
  return (
    <div className="info-container">
      <div className="info-box">
        <h3 className="info-title">{`${subject}`}</h3>
        <p className="info-tech">{tech}</p>
      </div>
    </div>
  );
};

export default InfoBoxComponent;
