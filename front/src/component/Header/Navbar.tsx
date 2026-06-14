import React, { useState } from "react";
import "./Navbar.css";

const logoSrc = `logo.png`;

export type Section = "inicio" | "catalogo" | "contacto";

interface NavbarProps {
  active: Section;
  onNav: (s: Section) => void;
}

const Navbar: React.FC<NavbarProps> = ({ active, onNav }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (s: Section) => {
    setMenuOpen(false);
    onNav(s);
  };

  return (
    <header className="navbar">
      <nav className="navbar__inner" aria-label="Navegación principal">
        <button className="navbar__brand" onClick={() => handleNav("inicio")} aria-label="Inicio">
          <img src={logoSrc} alt="Taller Joyería Zulema" className="navbar__logo" />
        </button>
        <button
          className={`navbar__toggle${menuOpen ? " navbar__toggle--open" : ""}`}
          type="button"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="navbar-links"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
        </button>
        <ul id="navbar-links" className={`navbar__links${menuOpen ? " navbar__links--open" : ""}`} role="list">
          {(["inicio", "catalogo", "contacto"] as Section[]).map((s) => (
            <li key={s}>
              <button
                className={`navbar__link${active === s ? " navbar__link--active" : ""}`}
                onClick={() => handleNav(s)}
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
};

export default Navbar;