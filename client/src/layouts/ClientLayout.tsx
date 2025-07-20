import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"

const ClientLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-5">
        <Outlet />
      </div>
    </div>
  )
}


export default ClientLayout
