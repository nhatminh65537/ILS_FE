import Header from "./components/Header"
import Footer from "./components/Footer"
import { Outlet, Routes, Route } from "react-router-dom"

export default function App()
{
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-16">
                <Outlet />
            </main>
            <Footer />
        </div>
    ) 
}
