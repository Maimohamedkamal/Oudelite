import React from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Footer from '../Components/Footer/footer'
import { Outlet } from 'react-router-dom'
import TopNavbar from '../Components/TopNavbar/TopNavbar'
import WhatsAppButton from '../Components/WhatsAppButton/WhatsAppButton'
import Arrow from '../Components/Arrow'
export default function Mainlayout() {
  return (
    <div>
      <TopNavbar/>
<Navbar/>
<Outlet></Outlet>
<WhatsAppButton/>
<Arrow/>
<Footer/>

    </div>
  )
}
