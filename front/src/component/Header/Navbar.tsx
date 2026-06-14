import React from "react";
import "./Navbar.css";

const logoSrc = `logo.png`;

export type Section = "inicio" | "catalogo" | "contacto";

interface NavbarProps {
  active: Section;
  onNav: (s: Section) => void;
}

const Navbar: React.FC<NavbarProps> = ({ active, onNav }) => (
  <header className="navbar">
    <nav className="navbar__inner" aria-label="Navegación principal">
      <button className="navbar__brand" onClick={() => onNav("inicio")} aria-label="Inicio">
        <img src={logoSrc} alt="Taller Joyería Zulema" className="navbar__logo" />
      </button>
      <ul className="navbar__links" role="list">
        {(["inicio", "catalogo", "contacto"] as Section[]).map((s) => (
          <li key={s}>
            <button
              className={`navbar__link${active === s ? " navbar__link--active" : ""}`}
              onClick={() => onNav(s)}
              aria-current={active === s ? "page" : undefined}
            >
              {s === "inicio" ? "INICIO" : s === "catalogo" ? "CATÁLOGO" : "CONTACTO"}
            </button>
          </li>
        ))}
      </ul>
      <button className="navbar__admin">ADMIN</button>
    </nav>
  </header>
);

export default Navbar;