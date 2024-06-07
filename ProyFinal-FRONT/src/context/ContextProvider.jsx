import { useState } from "react";
import ContextComponent from "./ContextComponent";

const ContextProvider = ({ children }) => {
  const [wideMode, setWideMode] = useState(false);
  const [logged, setLogged] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userData, setUserData] = useState({});

  return (
    <ContextComponent.Provider value={{ wideMode, setWideMode, logged, setLogged, darkMode, setDarkMode, userData, setUserData }}>
      {children}
    </ContextComponent.Provider>
  );
};

export default ContextProvider;
