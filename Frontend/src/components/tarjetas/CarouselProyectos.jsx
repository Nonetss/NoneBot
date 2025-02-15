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

  // Comenzamos en clonesBefore para que "currentIndex" señale al primer proyecto real
  const [currentIndex, setCurrentIndex] = useState(clonesBefore);

  // Referencia para debounce del scroll
  const scrollTimeoutRef = useRef(null);

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

  // Función para ajustar el índice si estamos en un clon
  const adjustIfClone = (index) => {
    let newIndex = index;

    if (index < clonesBefore) {
      newIndex = index + originalCount;
    } else if (index >= clonesBefore + originalCount) {
      newIndex = index - originalCount;
    }

    if (newIndex !== index && slides[newIndex]) {
      // Ajustamos el scroll de forma inmediata sin animación
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
      setCurrentIndex(newIndex);
    }
  };

  // onScroll para actualizar el slide activo basándonos en la posición actual
  const handleScroll = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      if (!scrollerRef.current || slides.length === 0) return;
      const scrollLeft = scrollerRef.current.scrollLeft;
      let closestIndex = 0;
      let minDiff = Infinity;
      slides.forEach((slide, idx) => {
        const diff = Math.abs(slide.offsetLeft - scrollLeft);
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = idx;
        }
      });
      setCurrentIndex(closestIndex);
      adjustIfClone(closestIndex);
    }, 100); // Puedes ajustar este debounce si lo consideras necesario
  };

  // Navegación con botones para escritorio
  const handlePrev = () => {
    let newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    if (slides[newIndex]) {
      slides[newIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
    adjustIfClone(newIndex);
  };

  const handleNext = () => {
    let newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    if (slides[newIndex]) {
      slides[newIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
    adjustIfClone(newIndex);
  };

  // Limpiar el timeout al desmontar el componente
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="carouselContainer">
      {/* Los botones se ocultan en móvil vía CSS */}
      <button className="btnPrev" onClick={handlePrev} aria-label="Anterior">
        &#10094;
      </button>

      <div ref={scrollerRef} className="scroller" onScroll={handleScroll}>
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
                    target="_blank"
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
