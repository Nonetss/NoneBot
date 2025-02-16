import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

const RadarChartComponent = ({
  data,
  activeSubject,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) => {
  // Función para renderizar cada punto del radar
  const renderCustomDot = (props) => {
    const { cx, cy, payload } = props;
    const actualData = payload.payload || payload;
    const isHovered = activeSubject === actualData.subject;

    return (
      <g>
        {/* Círculo invisible ampliado para facilitar el hover */}
        <circle
          cx={cx}
          cy={cy}
          r={10}
          fill="transparent"
          onMouseEnter={() => onMouseEnter(actualData)}
          onMouseLeave={() => onMouseLeave(actualData)}
          onClick={() => onClick(actualData)}
          style={{ cursor: "pointer" }}
        />
        {/* Círculo visible */}
        <circle
          cx={cx}
          cy={cy}
          r={isHovered ? 6 : 4}
          fill={isHovered ? "var(--color-secundario)" : "#ff7300"}
          stroke="#fff"
          strokeWidth={1}
          pointerEvents="none"
        />
      </g>
    );
  };

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={500}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#fff" />
          <PolarAngleAxis
            dataKey="subject"
            stroke="#fff"
            tick={({ payload, x, y, textAnchor, index }) => {
              const totalLabels = data.length;
              const angle = (2 * Math.PI * index) / totalLabels - Math.PI / 2;
              const offset = window.innerWidth < 768 ? 10 : 20; // Ajuste en móviles
              const fontSize = window.innerWidth < 768 ? 12 : 16; // Fuente adaptable
              const dx = offset * Math.cos(angle);
              const dy = offset * Math.sin(angle);

              return (
                <text
                  x={x}
                  y={y}
                  dx={dx}
                  dy={dy}
                  textAnchor={textAnchor}
                  fill="#fff"
                  fontSize={fontSize}
                >
                  {payload.value}
                </text>
              );
            }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#fff" />
          <Radar
            name="Nivel"
            dataKey="level"
            stroke="#fff"
            fill="var(--color-principal)"
            fillOpacity={0.6}
            dot={renderCustomDot}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChartComponent;
