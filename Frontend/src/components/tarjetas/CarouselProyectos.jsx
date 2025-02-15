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

  // Estado para detectar si estamos en móvil
  const [isMobile, setIsMobile] = useState(false);

  // Referencia para manejar el timeout y evitar superposiciones
  const adjustTimeoutRef = useRef(null);
  // Referencias para detectar el swipe
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);

  // Detectamos si estamos en móvil (por ejemplo, ancho menor o igual a 768px)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth <= 768);
    }
  }, []);

  // Al montar, recogemos los nodos de clase .proyecto
  useEffect(() => {
    if (scrollerRef.current) {
      const proyectoElements = Array.from(
        scrollerRef.current.querySelectorAll(".proyecto"),
      );
      setSlides(proyectoElements);
    }
  }, [proyectos]);

  // Posicionamos el scroll en el primer proyecto real sin animación
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

    // Cancelamos cualquier timeout previo para evitar superposiciones
    if (adjustTimeoutRef.current) {
      clearTimeout(adjustTimeoutRef.current);
    }

    // En móvil, el ajuste se hace de forma inmediata (delay = 0), para evitar el salto hacia atrás.
    const delay = isMobile ? 0 : 400;
    adjustTimeoutRef.current = setTimeout(() => {
      adjustTimeoutRef.current = null;
      adjustIfClone();
    }, delay);
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

  // Limpieza del timeout al desmontar el componente
  useEffect(() => {
    return () => {
      if (adjustTimeoutRef.current) {
        clearTimeout(adjustTimeoutRef.current);
      }
    };
  }, []);

  // Handlers para detección de swipe (touch)
  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartRef.current && touchEndRef.current) {
      const diff = touchStartRef.current - touchEndRef.current;
      if (Math.abs(diff) > 50) {
        // Swipe hacia la izquierda: avanzar
        if (diff > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }
    touchStartRef.current = null;
    touchEndRef.current = null;
  };

  const handlePrev = () => goToSlide(currentIndex - 1);
  const handleNext = () => goToSlide(currentIndex + 1);

  return (
    <div className="carouselContainer">
      {/* Los botones se ocultan en móvil vía CSS */}
      <button className="btnPrev" onClick={handlePrev} aria-label="Anterior">
        &#10094;
      </button>

      <div
        ref={scrollerRef}
        className="scroller"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
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
                <div className="proyectosInfo">
                  <p className="proyectoDescripcion">{proyecto.descripcion}</p>
                  <a
                    href={proyecto.enlaceProyecto || "#"}
                    className="verProyecto"
                  >
                    Ver el proyecto
                  </a>
                </div>
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
