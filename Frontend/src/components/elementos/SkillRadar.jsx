// SkillsRadarChart.jsx
import React, { useState, useEffect } from "react";
import RadarChartComponent from "@components/tarjetas/RadarChartComponent";
import InfoBoxComponent from "@components/tarjetas/InfoBoxComponent";
import "@styles/elementos/SkillsChart.css";

const skillsData = [
  {
    subject: "Matemáticas",
    level: 9,
    fullMark: 10,
    info: "Mi formación en matemáticas me ha permitido comprender conceptos avanzados...",
    tech: [
      {
        nombre: "Cálculo",
        nivel: 85,
        imagen: "https://via.placeholder.com/50",
      },
      {
        nombre: "Álgebra",
        nivel: 90,
        imagen: "https://via.placeholder.com/50",
      },
    ],
  },
  {
    subject: "Física",
    level: 8,
    fullMark: 10,
    info: "Mi experiencia en física abarca simulaciones y modelado...",
    tech: [
      {
        nombre: "Simulaciones",
        nivel: 80,
        imagen: "https://via.placeholder.com/50",
      },
      {
        nombre: "Modelado",
        nivel: 85,
        imagen: "https://via.placeholder.com/50",
      },
      {
        nombre: "Mecánica Cuántica",
        nivel: 75,
        imagen: "https://via.placeholder.com/50",
      },
    ],
  },
  {
    subject: "Backend",
    level: 9,
    fullMark: 10,
    info: "Mi especialización en backend incluye múltiples tecnologías...",
    tech: [
      {
        nombre: "Python",
        nivel: 90,
        imagen: "https://via.placeholder.com/50",
      },
      {
        nombre: "FastAPI",
        nivel: 85,
        imagen: "https://via.placeholder.com/50",
      },
      {
        nombre: "Django",
        nivel: 88,
        imagen: "https://via.placeholder.com/50",
      },
      {
        nombre: "SQLite",
        nivel: 80,
        imagen: "https://via.placeholder.com/50",
      },
      {
        nombre: "PostgreSQL",
        nivel: 85,
        imagen: "https://via.placeholder.com/50",
      },
    ],
  },
  {
    subject: "Frontend",
    level: 7,
    fullMark: 10,
    info: "Mi experiencia en frontend abarca React, Next.js y más...",
    tech: [
      {
        nombre: "React",
        nivel: 85,
        imagen: "https://via.placeholder.com/50",
      },
      {
        nombre: "Next.js",
        nivel: 80,
        imagen: "https://via.placeholder.com/50",
      },
      {
        nombre: "Astro",
        nivel: 75,
        imagen: "https://via.placeholder.com/50",
      },
      {
        nombre: "TailwindCSS",
        nivel: 82,
        imagen: "https://via.placeholder.com/50",
      },
    ],
  },
  {
    subject: "IA",
    level: 8,
    fullMark: 10,
    info: "Mi conocimiento en inteligencia artificial incluye diversos modelos...",
    tech: [
      {
        nombre: "LangChain",
        nivel: 80,
        imagen: "https://via.placeholder.com/50",
      },
      {
        nombre: "Ollama",
        nivel: 75,
        imagen: "https://via.placeholder.com/50",
      },
      {
        nombre: "NLP",
        nivel: 85,
        imagen: "https://via.placeholder.com/50",
      },
      {
        nombre: "Embeddings",
        nivel: 82,
        imagen: "https://via.placeholder.com/50",
      },
    ],
  },
  {
    subject: "SysAdmin",
    level: 7,
    fullMark: 10,
    info: "Mi experiencia en SysAdmin me ha permitido gestionar sistemas de forma eficiente...",
    tech: [
      {
        nombre: "Ingeniería Inversa",
        nivel: 80,
        imagen: "https://via.placeholder.com/50",
      },
      {
        nombre: "Malware Analysis",
        nivel: 75,
        imagen: "https://via.placeholder.com/50",
      },
    ],
  },
];

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
    }, 3000);
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
