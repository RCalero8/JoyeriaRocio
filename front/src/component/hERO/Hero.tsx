import React from "react";
import type { Section } from "../Header/Navbar";
import "./Hero.css";

interface HeroProps {
  onNav: (s: Section) => void;
}
 
const Hero: React.FC<HeroProps> = ({ onNav }) => (
  <section className="hero">
    <div className="hero__overlay" />
    <div className="hero__content">
      <p className="hero__eyebrow">Artesanía · Dos Hermanas, Sevilla</p>
      <h1 className="hero__title">
        Joyas hechas<br />a mano,<br />con alma.
      </h1>
      <p className="hero__sub">
        Cada pieza nace en el taller, pensada para quien la lleva.<br />
        Oro, plata y piedras naturales trabajadas con oficio.
      </p>
      <div className="hero__actions">
        <button className="btn btn--primary" onClick={() => onNav("catalogo")}>
          Ver catálogo
        </button>
        <button className="btn btn--ghost" onClick={() => onNav("contacto")}>
          Contactar
        </button>
      </div>
    </div>
    <div className="hero__ornament" aria-hidden="true">
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="90" stroke="#C9A84C" strokeWidth="0.5" strokeDasharray="4 6" />
        <circle cx="100" cy="100" r="70" stroke="#C9A84C" strokeWidth="0.3" />
        <path
          d="M100 10 L110 90 L190 100 L110 110 L100 190 L90 110 L10 100 L90 90 Z"
          fill="none"
          stroke="#C9A84C"
          strokeWidth="0.5"
          opacity="0.6"
        />
      </svg>
    </div>
  </section>
);
 
export default Hero;