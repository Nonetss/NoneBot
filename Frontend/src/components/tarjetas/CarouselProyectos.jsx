import React, {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import "@styles/tarjetas/CarouselProyectos.css";

export default function CarouselProyectos({ proyectos }) {
  // Configuración de clones
  const clonesBefore = 2;
  const clonesAfter = 2;
  const originalCount = proyectos.length;
  const clonedStart = proyectos.slice(-clonesBefore);
  const clonedEnd = proyectos.slice(0, clonesAfter);
  const fullProyectos = [...clonedStart, ...proyectos, ...clonedEnd];

  // Refs del contenedor y de cada slide (para evitar búsquedas en el DOM)
  const containerRef = useRef(null);
  const slideRefs = useRef([]);
  // Flag para deshabilitar eventos de scroll mientras se ajusta
  const adjustingRef = useRef(false);
  const scrollFrameRef = useRef(null);

  // Estado: índice actual (comenzamos en el primer slide real)
  const [currentIndex, setCurrentIndex] = useState(clonesBefore);
  const [initialized, setInitialized] = useState(false);

  // Función para calcular el scrollLeft que centra el slide indicado
  const getSlideScrollLeft = (index) => {
    const container = containerRef.current;
    const slide = slideRefs.current[index];
    if (!container || !slide) return 0;
    return slide.offsetLeft - container.offsetWidth / 2 + slide.offsetWidth / 2;
  };

  // Posición inicial sin scrollIntoView (para evitar que el navegador redireccione al carrusel)
  useLayoutEffect(() => {
    if (
      !initialized &&
      containerRef.current &&
      slideRefs.current[currentIndex]
    ) {
      containerRef.current.style.scrollBehavior = "auto";
      containerRef.current.scrollLeft = getSlideScrollLeft(currentIndex);
      containerRef.current.offsetHeight; // fuerza reflow
      containerRef.current.style.scrollBehavior = "smooth";
      setInitialized(true);
    }
  }, [initialized, currentIndex, fullProyectos]);

  // Ajusta el scroll si se muestra un clon (al inicio o final)
  const adjustIfClone = useCallback(
    (index) => {
      let newIndex = index;
      if (index < clonesBefore) {
        newIndex = index + originalCount;
      } else if (index >= clonesBefore + originalCount) {
        newIndex = index - originalCount;
      }
      if (newIndex !== index && slideRefs.current[newIndex]) {
        // Deshabilitamos temporalmente el manejo de scroll
        adjustingRef.current = true;
        containerRef.current.style.scrollBehavior = "auto";
        containerRef.current.scrollLeft = getSlideScrollLeft(newIndex);
        containerRef.current.offsetHeight;
        containerRef.current.style.scrollBehavior = "smooth";
        setCurrentIndex(newIndex);
        setTimeout(() => {
          adjustingRef.current = false;
        }, 50);
      }
    },
    [clonesBefore, originalCount],
  );

  // Calcula cuál es el slide más cercano al centro del contenedor
  const findClosestSlideIndex = useCallback(() => {
    if (!containerRef.current) return currentIndex;
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    let closestIndex = currentIndex;
    let minDiff = Infinity;
    slideRefs.current.forEach((slide, idx) => {
      if (!slide) return;
      const slideRect = slide.getBoundingClientRect();
      const slideCenter = slideRect.left + slideRect.width / 2;
      const diff = Math.abs(slideCenter - containerCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });
    return closestIndex;
  }, [currentIndex]);

  // Manejador del scroll, optimizado con requestAnimationFrame
  const handleScroll = useCallback(() => {
    if (!initialized || adjustingRef.current) return;
    if (scrollFrameRef.current) {
      cancelAnimationFrame(scrollFrameRef.current);
    }
    scrollFrameRef.current = requestAnimationFrame(() => {
      const closestIndex = findClosestSlideIndex();
      setCurrentIndex(closestIndex);
      adjustIfClone(closestIndex);
    });
  }, [initialized, findClosestSlideIndex, adjustIfClone]);

  useEffect(() => {
    return () => {
      if (scrollFrameRef.current) cancelAnimationFrame(scrollFrameRef.current);
    };
  }, []);

  // Navegación mediante botones: se calcula la posición destino y se deja que el scroll suave se ejecute.
  const handlePrev = () => {
    const newIndex = currentIndex - 1;
    if (slideRefs.current[newIndex]) {
      setCurrentIndex(newIndex);
      containerRef.current.scrollTo({
        left: getSlideScrollLeft(newIndex),
        behavior: "smooth",
      });
      // Tras la animación, se ajusta si se muestra un clon.
      setTimeout(() => {
        adjustIfClone(newIndex);
      }, 500);
    }
  };

  const handleNext = () => {
    const newIndex = currentIndex + 1;
    if (slideRefs.current[newIndex]) {
      setCurrentIndex(newIndex);
      containerRef.current.scrollTo({
        left: getSlideScrollLeft(newIndex),
        behavior: "smooth",
      });
      setTimeout(() => {
        adjustIfClone(newIndex);
      }, 500);
    }
  };

  return (
    <div className="carouselContainer">
      <button className="btnPrev" onClick={handlePrev} aria-label="Anterior">
        &#10094;
      </button>
      <div className="scroller" ref={containerRef} onScroll={handleScroll}>
        {fullProyectos.map((proyecto, idx) => (
          <div
            key={idx + proyecto.nombre}
            className={`proyecto${
              idx < clonesBefore || idx >= clonesBefore + originalCount
                ? " clone"
                : ""
            }`}
            ref={(el) => (slideRefs.current[idx] = el)}
          >
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
        ))}
      </div>
      <button className="btnNext" onClick={handleNext} aria-label="Siguiente">
        &#10095;
      </button>
    </div>
  );
}
