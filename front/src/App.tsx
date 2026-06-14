import React, { useState } from "react";
import "./App.css";
import Navbar from "./component/Header/Navbar";
import type { Section } from "./component/Header/Navbar";
/*import Hero from "./Hero";
import Catalogo from "./Catalogo";
import Contacto from "./Contacto";
import Footer from "./Footer";*/

const App: React.FC = () => {
  const [section, setSection] = useState<Section>("inicio");

  const onNav = (s: Section) => {
    setSection(s);
  };

  return (
    <div className="app">
      <Navbar active={section} onNav={onNav} />
    </div>
  );
};

export default App;