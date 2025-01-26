import { Outlet } from "react-router-dom"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"

export default function HomeNew() {

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-64">
        <Header />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
