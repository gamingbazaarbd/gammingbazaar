"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import axios from 'axios';

export default function Header() {
    const [query, setQuery] = useState('');
    const [user, setUser] = useState<any>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsMobile(window.innerWidth <= 767);
        const storedUser = localStorage.getItem('user-info');
        if (storedUser) setUser(JSON.parse(storedUser));

        const handleResize = () => setIsMobile(window.innerWidth <= 767);
        const handleScroll = () => setIsScrolled(window.scrollY > 50);

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    async function search(event: React.FormEvent) {
        event.preventDefault();
        try {
            await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/search/${query}`);
            // Assuming searchData state is passed to Search page via context or state management,
            // but in Next.js it's better to pass it via URL query or fetch on the page itself.
            // For now, we'll navigate to /search?q=query
            router.push(`/search?q=${query}`);
        } catch (error) {
            console.error('Error during search:', error);
            router.push(`/search?q=${query}`);
        }
    }

    const handleSidebarToggle = () => setIsSidebarVisible(!isSidebarVisible);

    return (
        <>
            <div className={`header fixed top-0 left-0 w-full z-50 transition-all ${isScrolled ? 'bg-white/90 shadow-md backdrop-blur-md' : 'bg-white/80 shadow-sm backdrop-blur-md'}`}>
                <div className="container mx-auto p-2 py-3 md:py-5 md:px-0">
                    <nav className="flex items-center justify-between">
                        <Link href="/">
                            <img src="/src_assets/img/1711652676.png" alt="Logo" className="w-28 md:w-48 object-contain h-12" />
                        </Link>
                        
                        <form onSubmit={search} className={`search-form flex-grow mx-4 relative ${isSearchActive ? 'block' : 'hidden md:block'}`}>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search..."
                                className="border border-red-500 rounded px-4 py-2 w-full text-black pl-10 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                                required
                            />
                        </form>

                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex gap-4">
                                <Link href="/topup" className="font-bold p-2 hover:text-red-500 transition-colors">Topup</Link>
                                <Link href="/contact" className="font-bold p-2 hover:text-red-500 transition-colors">Contact US</Link>
                            </div>
                            
                            {!user ? (
                                <div className="flex gap-2">
                                    <Link href="/login" className="px-4 py-2 border-2 border-red-500 text-red-500 rounded font-semibold hover:bg-red-50 transition-colors">Login</Link>
                                    <Link href="/register" className="px-4 py-2 bg-red-500 text-white rounded font-semibold hover:bg-red-600 transition-colors">Register</Link>
                                </div>
                            ) : (
                                <button onClick={handleSidebarToggle} className="flex items-center gap-2 border rounded-full px-4 py-1 hover:bg-gray-50 transition-colors">
                                    <img src="/src_assets/img/default.png" alt="Profile" className="w-8 h-8 rounded-full" />
                                    <span className="text-sm font-medium">{user?.name?.length > 12 ? `${user.name.substring(0, 12)}...` : user.name}</span>
                                </button>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
            {isSidebarVisible && <Sidebar onClose={() => setIsSidebarVisible(false)} />}
        </>
    );
}
