import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Footer from "../components/Footer"

const ClientLayout = () => {
  return (
    <>
    <Sidebar/>
    <Outlet/>
    <Footer/>
    </>
  )
}

export default ClientLayout