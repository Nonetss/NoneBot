import React, { useEffect, useRef, useState } from "react";
import "@styles/tarjetas/CarouselProyectos.css"; // Tu archivo CSS externo

export default function CarouselProyectos({ proyectos }) {
  const clonesBefore = 2;
  const clonesAfter = 2;

  // Creamos el array completo con clones al inicio (últimos 2) y al final (primeros 2)
  const clonedStart = proyectos.slice(-clonesBefore);
  const clonedEnd = proyectos.slice(0, clonesAfter);
  const fullProyectos = [...clonedStart, ...proyectos, ...clonedEnd];

  const scrollerRef = useRef(null);
  const [slides, setSlides] = useState([]);
  const [initialized, setInitialized] = useState(false); // Para evitar re-posicionar cada vez
  const originalCount = proyectos.length;

  // Iniciaremos en clonesBefore (por ejemplo, 2) para apuntar al primer proyecto "real"
  const [currentIndex, setCurrentIndex] = useState(clonesBefore);

  // Al montar, obtenemos los nodos .proyecto y los guardamos en "slides"
  useEffect(() => {
    if (scrollerRef.current) {
      const proyectoElements = Array.from(
        scrollerRef.current.querySelectorAll(".proyecto"),
      );
      setSlides(proyectoElements);
    }
  }, [proyectos]);

  // Una vez que tenemos los "slides", ubicamos el scroll en el proyecto #1 real (sin animación)
  useEffect(() => {
    if (!initialized && slides.length > 0 && slides[currentIndex]) {
      scrollerRef.current.scrollTo({
        left: slides[currentIndex].offsetLeft,
        behavior: "auto",
      });
      setInitialized(true);
    }
  }, [slides, currentIndex, initialized]);

  // Función para desplazarnos con animación suave al "newIndex"
  const goToSlide = (newIndex) => {
    setCurrentIndex(newIndex);
    if (slides[newIndex]) {
      slides[newIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
    // Después de 600ms (aprox. duración de animación), ajustamos si es un clon
    setTimeout(adjustIfClone, 600);
  };

  // Ajuste de clones: si “caemos” en uno, saltamos sin animación
  const adjustIfClone = () => {
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex;
      // Si el índice está en la parte de clonesBefore (p.ej < 2), saltamos al final real
      if (prevIndex < clonesBefore) {
        newIndex = prevIndex + originalCount;
      }
      // Si el índice está más allá del último real (>= clonesBefore + originalCount)
      else if (prevIndex >= clonesBefore + originalCount) {
        newIndex = prevIndex - originalCount;
      }

      // Si hay un salto, lo hacemos sin animación
      if (newIndex !== prevIndex && slides[newIndex]) {
        if (scrollerRef.current) {
          const originalBehavior = scrollerRef.current.style.scrollBehavior;
          scrollerRef.current.style.scrollBehavior = "auto";
          slides[newIndex].scrollIntoView({
            behavior: "auto",
            block: "center",
            inline: "center",
          });
          scrollerRef.current.offsetHeight; // Forzar reflow
          scrollerRef.current.style.scrollBehavior = originalBehavior;
        } else {
          slides[newIndex].scrollIntoView({
            behavior: "auto",
            block: "center",
            inline: "center",
          });
        }
      }
      return newIndex;
    });
  };

  const handlePrev = () => goToSlide(currentIndex - 1);
  const handleNext = () => goToSlide(currentIndex + 1);

  return (
    <div className="carouselContainer">
      {/* Botón "anterior" */}
      <button className="btnPrev" onClick={handlePrev} aria-label="Anterior">
        &#10094;
      </button>

      {/* Contenedor que hace scroll horizontal */}
      <div ref={scrollerRef} className="scroller">
        {fullProyectos.map((proyecto, idx) => {
          const isClone =
            idx < clonesBefore || idx >= clonesBefore + originalCount;
          return (
            <div className={`proyecto${isClone ? " clone" : ""}`} key={idx}>
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
                <p>{proyecto.descripcion}</p>
                <a
                  href={proyecto.enlaceProyecto || "#"}
                  className="verProyecto"
                >
                  Ver el proyecto
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botón "siguiente" */}
      <button className="btnNext" onClick={handleNext} aria-label="Siguiente">
        &#10095;
      </button>
    </div>
  );
}
