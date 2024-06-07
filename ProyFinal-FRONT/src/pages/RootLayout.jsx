import { Outlet } from "react-router-dom";
import SideNav from "../components/SideNav";
import { useContext, useState } from "react";
import Header from "../components/Header";
import ContextComponent from "../context/ContextComponent";

const RootLayout = () => {
  const { darkMode } = useContext(ContextComponent);
  const [folded, setFolded] = useState(false);

  return (
    <div className="flex flex-col-reverse lg:flex-row h-screen overflow-hidden">
      <SideNav folded={folded} setFolded={setFolded} />
      <div className="flex flex-col w-full h-full">
        <div className={`flex-col overflow-y-auto h-full ${darkMode ? 'bg-gray-900 text-slate-50' : 'bg-slate-200 text-black'} duration-200`}>
          <Header />
          <div className="mt-36 lg:mt-16 h-[93%]">
          <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
