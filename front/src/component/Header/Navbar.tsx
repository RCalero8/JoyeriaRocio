import React, { useState } from "react";
import "./header.css";
import logo from "../../../public/logo.png";

type NavLink = {
  label: string;
  href: string;
};

const navLinks: NavLink[] = [
  { label: "INICIO", href: "/" },
  { label: "CATÁLOGO", href: "/catalogo" },
  { label: "CONTACTO", href: "/contacto" },
];

const Navbar: React.FC = () => {
  const [active, setActive] = useState<string>("INICIO");

  return (
    <header className="navbar">
      <nav className="navbar_inner" aria-label="Navegación principal">
        {/* Logo */}
        <a
          href="/"
          className="navbar__brand"
          aria-label="Taller Joyería Zulema — Inicio"
        >
          <img
            src={logo}
            alt="Taller Joyería Zulema"
            className="navbar__logo"
          />
        </a>
        {/* Nav links */}
        <ul className="navbar__links" role="list">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className={`navbar__link${active === link.label ? " navbar__link--active" : ""}`}
                onClick={() => setActive(link.label)}
                aria-current={active === link.label ? "page" : undefined}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Admin */}
        <a
          href="/admin"
          className="navbar__admin"
          aria-label="Acceso administrador"
        >
          ADMIN
        </a>
      </nav>
    </header>
  );
};

export default Navbar;