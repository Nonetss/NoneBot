// SkillsRadarChart.jsx
import React, { useState, useEffect } from "react";
import RadarChartComponent from "@components/tarjetas/RadarChartComponent";
import InfoBoxComponent from "@components/tarjetas/InfoBoxComponent";
import "@styles/elementos/SkillsChart.css";

import skillsData from "@components/data/skillsData.json";

const SkillsRadarChart = () => {
  const [hoveredSubject, setHoveredSubject] = useState(null);
  const [hoveredTech, setHoveredTech] = useState(null);
  const [hoveredInfo, setHoveredInfo] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Rotación automática cada 3 segundos cuando no hay hover y no está bloqueado
  useEffect(() => {
    const interval = setInterval(() => {
      if (!hoveredSubject && !isLocked) {
        setCurrentIndex((prev) => (prev + 1) % skillsData.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [hoveredSubject, isLocked]);

  // Al hacer hover (solo si no está bloqueado)
  const handleMouseEnter = (data) => {
    if (!isLocked) {
      setHoveredSubject(data.subject);
      setHoveredTech(data.tech);
      setHoveredInfo(data.info);
    }
  };

  // Al salir del hover (solo si no está bloqueado)
  const handleMouseLeave = () => {
    if (!isLocked) {
      setHoveredSubject(null);
      setHoveredTech(null);
      setHoveredInfo(null);
    }
  };

  // Al hacer click se bloquea la selección (detiene la rotación)
  const handleClick = (data) => {
    setIsLocked(true);
    setHoveredSubject(data.subject);
    setHoveredTech(data.tech);
    setHoveredInfo(data.info);
  };

  // Si no hay hover ni bloqueo, se utiliza la habilidad rotativa
  const rotatingSkill = skillsData[currentIndex];
  const activeSubject = hoveredSubject || rotatingSkill.subject;
  const displayedTech = hoveredTech || rotatingSkill.tech;
  const displayedInfo = hoveredInfo || rotatingSkill.info;

  return (
    <div className="skills-container">
      <RadarChartComponent
        data={skillsData}
        activeSubject={activeSubject}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />
      <InfoBoxComponent
        subject={activeSubject}
        tech={displayedTech}
        info={displayedInfo}
      />
    </div>
  );
};

export default SkillsRadarChart;
