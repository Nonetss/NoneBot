import React, { useEffect, useRef, useState } from "react";
import "@styles/tarjetas/CarouselProyectos.css"; // Ajusta la ruta a tu CSS

export default function CarouselProyectos({ proyectos }) {
  const clonesBefore = 2;
  const clonesAfter = 2;

  // Creamos el array completo con clones al inicio (últimos 2) y al final (primeros 2)
  const clonedStart = proyectos.slice(-clonesBefore);
  const clonedEnd = proyectos.slice(0, clonesAfter);
  const fullProyectos = [...clonedStart, ...proyectos, ...clonedEnd];

  const scrollerRef = useRef(null);
  const [slides, setSlides] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const originalCount = proyectos.length;

  // Empezamos en clonesBefore para que "currentIndex" señale al primer proyecto real
  const [currentIndex, setCurrentIndex] = useState(clonesBefore);

  // Guardamos un timeout para poder "debouncear" el ajuste de clones si hacen clic varias veces
  const adjustTimeoutRef = useRef(null);

  // Al montar, recogemos los nodos de clase .proyecto
  useEffect(() => {
    if (scrollerRef.current) {
      const proyectoElements = Array.from(
        scrollerRef.current.querySelectorAll(".proyecto"),
      );
      setSlides(proyectoElements);
    }
  }, [proyectos]);

  // Situamos el scroll inicial en el proyecto real (sin animación) solo la primera vez
  useEffect(() => {
    if (!initialized && slides.length > 0 && slides[currentIndex]) {
      scrollerRef.current.scrollTo({
        left: slides[currentIndex].offsetLeft,
        behavior: "auto",
      });
      setInitialized(true);
    }
  }, [slides, currentIndex, initialized]);

  // Función para ir a un slide con animación "smooth"
  const goToSlide = (newIndex) => {
    setCurrentIndex(newIndex);

    if (slides[newIndex]) {
      slides[newIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }

    // Cancelamos cualquier timeout previo, para evitar superposiciones
    if (adjustTimeoutRef.current) {
      clearTimeout(adjustTimeoutRef.current);
    }

    // Iniciamos un nuevo timeout (debounce). Ajustaremos clones pasado un pequeño lapso.
    adjustTimeoutRef.current = setTimeout(() => {
      adjustTimeoutRef.current = null;
      adjustIfClone();
    }, 400); // Ajusta este tiempo según tu preferencia
  };

  // Ajusta el índice si caemos en un clon (sin animación visible)
  const adjustIfClone = () => {
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex;

      // Si el índice está en los clones del inicio, saltamos al final real
      if (prevIndex < clonesBefore) {
        newIndex = prevIndex + originalCount;
      }
      // Si el índice está más allá del último proyecto real, saltamos al inicio real
      else if (prevIndex >= clonesBefore + originalCount) {
        newIndex = prevIndex - originalCount;
      }

      // Si cambiamos de índice, recolocamos el scroll sin animación
      if (newIndex !== prevIndex && slides[newIndex]) {
        if (scrollerRef.current) {
          const originalBehavior = scrollerRef.current.style.scrollBehavior;
          scrollerRef.current.style.scrollBehavior = "auto";
          slides[newIndex].scrollIntoView({
            behavior: "auto",
            block: "center",
            inline: "center",
          });
          // Forzamos reflow y restauramos el scroll-behavior
          scrollerRef.current.offsetHeight;
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

  // Limpiamos el timeout si el componente se desmonta, para evitar warnings
  useEffect(() => {
    return () => {
      if (adjustTimeoutRef.current) {
        clearTimeout(adjustTimeoutRef.current);
      }
    };
  }, []);

  const handlePrev = () => goToSlide(currentIndex - 1);
  const handleNext = () => goToSlide(currentIndex + 1);

  return (
    <div className="carouselContainer">
      <button className="btnPrev" onClick={handlePrev} aria-label="Anterior">
        &#10094;
      </button>

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

      <button className="btnNext" onClick={handleNext} aria-label="Siguiente">
        &#10095;
      </button>
    </div>
  );
}
