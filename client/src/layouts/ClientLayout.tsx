import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const ClientLayout = () => {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
};

export default ClientLayout;
