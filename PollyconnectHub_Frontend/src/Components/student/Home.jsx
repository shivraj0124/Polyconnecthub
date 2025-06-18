import React, { useEffect } from 'react'
import Navbar from '../Navbar'
import Sidebar from './Sidebar'
import themeHook from '../Context'
import { Outlet, useNavigate } from 'react-router-dom'
import Smsidebar from './Smsidebar'
import Chatbot from '../Chat/ChatBot'

function Home() {
    const { sidebarvalue, userDetails } = themeHook();
    const navigate = useNavigate();

    useEffect(() => {
        const userDetailsFromLocalStorage = JSON.parse(localStorage.getItem('userDetails'));
        console.log(userDetailsFromLocalStorage);
        if (!userDetailsFromLocalStorage) {
            navigate("/login")
        }
    }, [userDetails]);

    return (
        <div className='w-full max-h-screen bg-[#f5f5f5] dark:bg-black dark:text-white'>
            <Navbar />
            
            {/* Mobile Sidebar */}
            <div className='min-[900px]:hidden dark:bg-slate-900'>
                <Smsidebar />
            </div>

            {/* Main Grid Layout */}
            <div className='grid grid-col-1 min-[900px]:grid-cols-[20%_auto] dark:bg-slate-900'>
                
                {/* Sidebar for larger screens */}
                <div className='bg-white dark:bg-gray-900 h-[93vh]  hidden min-[900px]:block'>
                    <Sidebar />
                </div>

                {/* Outlet renders nested routes */}
                <div className=' dark:bg-slate-900'>
                    <Outlet />
                </div>
            </div>

            {/* Chatbot fixed at bottom */}
            <div className='fixed bottom-5 right-5 z-50'>
                <Chatbot />
            </div>
        </div>
    )
}

export default Home
