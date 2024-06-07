import { Link } from "react-router-dom"
import SideNav from "./SideNav"
// import Footer from "./Footer"


const ErrorElement = () => {
  return (
    <div className="flex">
      <SideNav/>
      <main className="w-4/5 h-screen">
        <div>ErrorPage </div>
        <p>No se ha podido encontrar la página</p>
        <Link to='/'>Volver a la página principal</Link>
      </main>
      {/* <Footer/> */}
    </div>
  )
}

export default ErrorElement