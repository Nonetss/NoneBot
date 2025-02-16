import React from "react";
import "@styles/tarjetas/LogoSkill.css"; // Importamos los estilos

const Skills = ({ skills }) => {
  return (
    <div className="skills-container">
      <div className="skills-grid">
        {skills.map((skill, index) => (
          <div
            className="skill-card"
            key={skill.nombre}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="skill-header">
              <img
                src={skill.imagen}
                alt={skill.nombre}
                className="skill-icon"
                loading="lazy"
              />
              <h3 className="skill-title">{skill.nombre}</h3>
            </div>

            {/* Barra de nivel mejorada */}
            <div className="skill-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${skill.nivel}%` }}
                  aria-label={`Nivel de ${skill.nombre}: ${skill.nivel}%`}
                ></div>
              </div>
              <span className="progress-text">{skill.nivel}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
