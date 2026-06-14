import React from "react";
import "./Footer.css";

const logoSrc = `logo.png`;

const Footer: React.FC = () => (
  <footer className="footer">
    <img src={logoSrc} alt="Taller Joyería Zulema" className="footer__logo" />
    <p className="footer__copy">
      © {new Date().getFullYear()} Taller Joyería Zulema · Dos Hermanas, Sevilla
    </p>
  </footer>
);

export default Footer;