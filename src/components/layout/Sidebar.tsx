"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Sidebar({ onClose }: { onClose: () => void }) {
    const [isMobile, setIsMobile] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        setIsMobile(window.innerWidth <= 767);
        const storedUser = localStorage.getItem('user-info');
        if (storedUser) setUser(JSON.parse(storedUser));

        const handleResize = () => setIsMobile(window.innerWidth <= 767);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user-info');
        localStorage.removeItem('token');
        onClose(); // Close sidebar on logout
        window.location.href = '/login';
    };

    const containerStyle = isMobile ? { paddingTop: '18%' } : { paddingTop: '5%' };

    if (!user) return null;
    console.log(user)

    return (
        <div id="userMenu" className="bg-white rounded shadow-md absolute mt-12 top-0 right-0 min-w-full overflow-auto z-30">
            <nav className="flex fixed items-center justify-between h-16 bg-white text-gray-700 border-b border-gray-200 z-10 srgameshop-navlist" style={{ position: 'fixed', bottom: '0px' }}>
                <div className="z-10 fixed inset-0 transition-opacity" onClick={onClose}>
                    <div tabIndex={0} className="absolute inset-0 bg-black opacity-50"></div>
                </div>
                <aside className="transform top-0 right-0 w-64 bg-white fixed h-full overflow-auto ease-in-out transition-all duration-300 z-30 translate-x-0" style={containerStyle}>
                    <button id="userButton" className="flex items-center focus:outline-none p-3">
                        <img src="/src_assets/img/default.png" style={{ height: '50px', backgroundColor: '#D81C4B', color: '#fff' }} alt="Profile" />
                        <div>
                            <div className="text-left w-full">
                                <span className="px-3 font-normal font-primary">Hi, {user?.name?.length > 10 ? `${user.name.substring(0, 10)}...` : user.name}</span>
                            </div>
                            <div className="text-left">
                                <span className="px-3 text-sm">{user?.email}</span>
                            </div>
                        </div>
                    </button>
                    <div className="w-full mx-auto text-center">
                        <button onClick={handleLogout} className="focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-1.5 px-2.5 py-1.5 shadow-sm text-white bg-red-500 hover:bg-red-600 inline-flex items-center mb-2">
                            <span className="flex items-center justify-center p-0">
                                <span className="no-underline text-xs">Logout</span>
                            </span>
                        </button>
                    </div>
                    <hr />
                    <Link href="/profile" onClick={onClose} className="text-gray-900 no-underline block p-4 hover:bg-gray-100"> My Account </Link>
                    <Link href="/profile/order" onClick={onClose} className="text-gray-900 no-underline block p-4 hover:bg-gray-100"> My Orders </Link>
                    <Link href="/profile/my-codes" onClick={onClose} className="text-gray-900 no-underline block p-4 hover:bg-gray-100"> My Codes </Link>
                    <Link href="/profile/transactions" onClick={onClose} className="text-gray-900 no-underline block p-4 hover:bg-gray-100"> My Transaction </Link>
                    <Link href="/profile/add-money" onClick={onClose} className="text-gray-900 no-underline block p-4 hover:bg-gray-100"> Add Money </Link>
                    <Link href="/contact" onClick={onClose} className="text-gray-900 no-underline block p-4 hover:bg-gray-100"> Contact Us </Link>
                    <hr />
                    <div className="w-full mx-auto text-center mt-3">
                        <a href="https://wa.me/+8801317956376" target="_blank" rel="noopener noreferrer" className="align-middle bg-pink-500 hover:bg-pink-400 text-white text-sm font-semibold rounded-lg inline-block shadow-lg px-6 py-2 mb-2">
                            Support
                        </a>
                    </div>
                </aside>
            </nav>
        </div>
    );
}
