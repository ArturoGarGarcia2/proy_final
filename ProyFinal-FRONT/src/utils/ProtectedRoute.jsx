import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import ContextComponent from "../context/ContextComponent";

const ProtectedRoute = ({redirectPath}) => {
  const { logged } = useContext(ContextComponent);

  if(!logged) {
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
