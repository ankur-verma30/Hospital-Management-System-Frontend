import { Outlet } from "react-router-dom"
import Header from "../Components/Header/Header"
import Sidebar from "../Components/Admin/Sidebar/Sidebar"

const AdminDashboard = () => {
  return (
 <div className='flex' >
        <Sidebar/>
        <div className='w-full flex flex-col'>
        <Header/>
        <div className="p-4">
        <Outlet/>
        </div>
    </div>
    </div>
  )
}

export default AdminDashboard