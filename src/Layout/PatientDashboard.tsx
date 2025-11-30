import { Outlet } from "react-router-dom";
import Header from "../Components/Header/Header";
import Sidebar from "../Components/Patient/Sidebar/Sidebar";

const PatientDashboard = () => {
  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Sidebar (fixed width) */}
      <Sidebar className="w-64 flex-shrink-0" />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-h-screen overflow-hidden">
        <Header />
        <main className="main-content flex-1 overflow-auto p-5 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;
