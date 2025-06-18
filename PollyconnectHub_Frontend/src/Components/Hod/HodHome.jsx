import React, { useEffect } from 'react'
import Navbar from '../Navbar'
import themeHook from '../Context'
import { Outlet } from 'react-router-dom'
import HodSidebar from './HodSidebar'
import { useNavigate } from 'react-router-dom'
function HodHome() {
    const { sidebarvalue, userDetails } = themeHook()
    const navigate = useNavigate()
    useEffect(() => {
        if (userDetails?.userType !== "HOD") {
            navigate("/")
        }
    }, [userDetails])
    return (
        <div className='bg-[#f5f5f5] w-full max-h-screen dark:bg-slate-900'>
            <Navbar />
            <div className=' grid grid-col-1 min-[900px]:grid-cols-[15%_auto]'>
                <div className=' bg-white dark:bg-slate-950 hidden min-[900px]:block h-[92vh]'>
                    <HodSidebar />
                </div>
                <div className='h-[92vh]'>
                    <Outlet />
                </div>
                {/* <div className=' hidden min-[900px]:block'>
                    <Outlet />
                </div> */}
            </div>
        </div>
    )
}

export default HodHome