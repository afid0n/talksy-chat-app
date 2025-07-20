import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"

const ClientLayout = () => {
  return (
    <div className="flex">
      <Sidebar/>
      <Outlet />
    </div>
  )
}


export default ClientLayout
