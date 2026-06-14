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
      <p className="hero__eyebrow">Taller · Joyeria Zulema Rocio</p>
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
      <img className="hero__logo" src="/logo.png" alt="Logo Joyería Zulema" />
    </div>
  </section>
);
 
export default Hero;