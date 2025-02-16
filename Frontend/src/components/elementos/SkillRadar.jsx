import React, { useState, useEffect } from "react";
import RadarChartComponent from "@components/tarjetas/RadarChartComponent";
import InfoBoxComponent from "@components/tarjetas/InfoBoxComponent";
import "@styles/elementos/SkillsChart.css";

const skillsData = [
  {
    subject: "Matemáticas",
    level: 9,
    fullMark: 10,
    tech: ["Cálculo", "Álgebra", "Ecuaciones Diferenciales"],
  },
  {
    subject: "Física",
    level: 8,
    fullMark: 10,
    tech: ["Simulaciones", "Modelado", "Mecánica Cuántica"],
  },
  {
    subject: "Backend",
    level: 9,
    fullMark: 10,
    tech: ["Python", "FastAPI", "Django", "SQLite", "PostgreSQL"],
  },
  {
    subject: "Frontend",
    level: 7,
    fullMark: 10,
    tech: ["React", "Next.js", "Astro", "TailwindCSS"],
  },
  {
    subject: "IA",
    level: 8,
    fullMark: 10,
    tech: ["LangChain", "Ollama", "NLP", "Embeddings"],
  },
  {
    subject: "SysAdmin",
    level: 7,
    fullMark: 10,
    tech: ["Ingeniería Inversa", "Malware Analysis"],
  },
];

const SkillsRadarChart = () => {
  const [hoveredSubject, setHoveredSubject] = useState(null);
  const [hoveredTech, setHoveredTech] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Rotación automática cada 3 segundos cuando no hay hover
  useEffect(() => {
    const interval = setInterval(() => {
      if (!hoveredSubject) {
        setCurrentIndex((prev) => (prev + 1) % skillsData.length);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [hoveredSubject]);

  // Al hacer hover, guardamos el subject y las tech del skill
  const handleMouseEnter = (data) => {
    setHoveredSubject(data.subject);
    setHoveredTech(data.tech);
  };

  // Al salir del hover, limpiamos ambos valores
  const handleMouseLeave = () => {
    setHoveredSubject(null);
    setHoveredTech(null);
  };

  // Si no hay hover, usamos el skill rotativo
  const rotatingSkill = skillsData[currentIndex];
  const activeSubject = hoveredSubject || rotatingSkill.subject;
  const displayedTech = hoveredTech || rotatingSkill.tech;

  return (
    <div className="skills-container">
      <RadarChartComponent
        data={skillsData}
        activeSubject={activeSubject}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <InfoBoxComponent subject={activeSubject} tech={displayedTech} />
    </div>
  );
};

export default SkillsRadarChart;
