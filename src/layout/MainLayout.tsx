import { Outlet } from "react-router-dom"
import { Navbar } from "../components/utils/navbar/Navbar"
import { Footer } from "../components/utils/Footer"



export const MainLayout = () => {
  return (
    <div className="page">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}



