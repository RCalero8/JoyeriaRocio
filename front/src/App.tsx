import React, { useState } from "react";
import "./App.css";
import Navbar from "./component/Header/Navbar";
import type { Section } from "./component/Header/Navbar";
import Hero from "./component/hERO/Hero";
/*import Catalogo from "./Catalogo";
import Contacto from "./Contacto";
import Footer from "./Footer";*/

const App: React.FC = () => {
  const [section, setSection] = useState<Section>("inicio");

  const onNav = (s: Section) => {
    setSection(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app">
      <Navbar active={section} onNav={onNav} />
      <main className="main">
        {section === "inicio"   && <Hero onNav={onNav} />}
      </main>
    </div>
  );
};

export default App;