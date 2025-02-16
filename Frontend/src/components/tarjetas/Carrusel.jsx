import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
// Conserva tus importaciones de estilos
import "@styles/tarjetas/CarouselProyectos.css";
import "./Prueba.css";

export default function Prueba({ proyectos = [] }) {
  // Iniciamos Embla con loop + autoplay
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay()]);

  return (
    <div className="embla" ref={emblaRef}>
      {/* Contenedor principal de Embla */}
      <div className="embla__container">
        {/* Embla te pide que cada elemento sea un "slide" 
            (a menos que quieras meterlos todos en un mismo slide). 
            Normalmente, cada "proyecto" es un slide independiente: */}
        {proyectos.map((proyecto, idx) => (
          <div className="embla__slide" key={`${proyecto.nombre}-${idx}`}>
            {/* Aquí agregamos la clase que usabas antes para el estilo global */}
            <div className="carouselContainer proyecto">
              <div className="proyectoNombre">
                <p>{proyecto.nombre}</p>
              </div>
              <div className="proyectoImagen">
                <img
                  className="proyectoImagenImg"
                  src={proyecto.imgEnlace}
                  alt={`Imagen de ${proyecto.nombre}`}
                />
              </div>
              <div className="proyectoDetalles">
                <h3>{proyecto.titulo}</h3>
                <div className="proyectosInfo">
                  <p className="proyectoDescripcion">{proyecto.descripcion}</p>
                  <a
                    href={proyecto.enlaceProyecto || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="verProyecto"
                  >
                    Ver el proyecto
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
