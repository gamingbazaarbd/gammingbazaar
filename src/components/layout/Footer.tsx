"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { FaWhatsapp, FaFacebook, FaInstagram, FaYoutube, FaEnvelope, FaHome, FaWallet, FaList, FaUser, FaTicketAlt, FaBolt } from 'react-icons/fa';

export default function Footer() {
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user-info') || 'null') : null;
    const siteSettings = useSiteSettings();
    const [isSupportOpen, setIsSupportOpen] = useState(false);

    if (!siteSettings?.contact_info) {
        return <div className="p-4 text-center text-gray-500">Loading footer...</div>;
    }

    const { contact_info } = siteSettings;

    return (
        <>
            <footer className="mt-auto mb-16 md:mb-0 text-gray-200 border-t-2 bg-gray-900 border-gray-800">
                <section className="container mx-auto pb-8 pt-10">
                    <div className="flex flex-wrap">
                        {/* Stay Connected */}
                        <div className="w-full md:w-1/3 px-5 md:px-0">
                            <h3 className="text-lg font-bold uppercase text-white tracking-wider mb-4">Stay Connected</h3>
                            <div className="text-sm text-gray-400 mb-4 cursor-pointer">
                                <a href={`https://wa.me/${contact_info.whatsapp_number}`} className="block mb-2">
                                    কোন সমস্যায় পড়লে হোয়াটসঅ্যাপ এ যোগাযোগ করবেন। তাহলে দ্রুত সমাধান পেয়ে যাবেন। WA.ME/{contact_info.whatsapp_number}
                                </a>
                            </div>
                            <div className="flex gap-4 text-white">
                                <a href={contact_info.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-full hover:bg-red-500 transition-colors">
                                    <FaFacebook size={20} />
                                </a>
                                <a href={contact_info.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-full hover:bg-red-500 transition-colors">
                                    <FaInstagram size={20} />
                                </a>
                                <a href={contact_info.youtube} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-full hover:bg-red-500 transition-colors">
                                    <FaYoutube size={20} />
                                </a>
                                <a href={`mailto:${contact_info.email}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-full hover:bg-red-500 transition-colors">
                                    <FaEnvelope size={20} />
                                </a>
                            </div>
                        </div>

                        {/* App Download Placeholder (Removed old complex SVG) */}
                        <div className="w-full md:w-1/3 px-5 md:px-0 mt-8 md:mt-0 text-center">
                            <h3 className="text-lg font-bold uppercase text-white tracking-wider mb-4">Our Mobile App</h3>
                            <a href={contact_info.google_app_url} target="_blank" rel="noopener noreferrer" className="inline-block hover:opacity-80 transition-opacity">
                                <div className="bg-black text-white px-6 py-3 rounded-xl flex items-center justify-center gap-3 border border-gray-700">
                                    {/* <span className="font-bold">GET IT ON<br/>Google Play</span> */}
                                    <img className='w-40' src="https://bakgroma.shop/assets/images/stores/DEU/google-play.png" alt="" />
                                </div>
                            </a>
                        </div>

                        {/* Support Center */}
                        <div className="w-full md:w-1/3 px-5 md:px-0 mt-8 md:mt-0 md:text-right">
                            <h3 className="text-lg font-bold uppercase text-white tracking-wider mb-4">Support Center</h3>
                            <a href={`https://wa.me/${contact_info.whatsapp_number}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 bg-gray-800 p-4 rounded-xl hover:bg-gray-700 transition">
                                <FaWhatsapp size={32} className="text-green-500" />
                                <div className="text-left border-l-2 border-gray-600 pl-4">
                                    <p className="text-xs text-gray-400">Help line [9AM-12PM]</p>
                                    <span className="font-bold font-mono text-lg">{contact_info.phone_number}</span>
                                </div>
                            </a>
                        </div>
                    </div>
                </section>

                <div className="border-t border-gray-800 py-6 text-center text-sm text-gray-500">
                    <p>© Copyright 2024. All Rights Reserved.</p>
                </div>

                {/* Floating Support Button */}
                <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex items-center gap-2">
                    {isSupportOpen && (
                        <a href={`https://wa.me/${contact_info.whatsapp_number}`} target="_blank" rel="noopener noreferrer" className="bg-green-500 p-4 rounded-full text-white shadow-lg shadow-green-500/30 hover:bg-green-600 transition">
                            <FaWhatsapp size={24} />
                        </a>
                    )}
                    <button onClick={() => setIsSupportOpen(!isSupportOpen)} className="bg-red-600 p-4 rounded-full text-white shadow-lg hover:bg-red-700 transition font-bold flex items-center gap-2">
                        {isSupportOpen ? 'Close' : 'Support!'}
                    </button>
                </div>

                {/* Mobile Bottom Navigation */}
                <nav className="fixed md:hidden bottom-0 left-0 w-full bg-white border-t border-gray-200 z-40 text-gray-500 flex justify-between px-2 pb-2 pt-1 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                    <Link href="/" className="flex flex-col items-center p-2 hover:text-red-500 transition w-full">
                        <FaHome size={20} className="mb-1" />
                        <span className="text-[10px] font-medium">Home</span>
                    </Link>
                    {!user ? (
                        <>
                            <a href={contact_info.youtube} target="_blank" className="flex flex-col items-center p-2 hover:text-red-500 transition w-full">
                                <FaYoutube size={20} className="mb-1" />
                                <span className="text-[10px] font-medium">Tutorial</span>
                            </a>
                            <Link href="/topup" className="flex flex-col items-center p-2 hover:text-red-500 transition w-full">
                                <FaBolt size={20} className="mb-1" />
                                <span className="text-[10px] font-medium">TopUp</span>
                            </Link>
                            <Link href="/contact" className="flex flex-col items-center p-2 hover:text-red-500 transition w-full">
                                <FaEnvelope size={20} className="mb-1" />
                                <span className="text-[10px] font-medium">Contact</span>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/profile/add-money" className="flex flex-col items-center p-2 hover:text-red-500 transition w-full">
                                <FaWallet size={20} className="mb-1" />
                                <span className="text-[10px] font-medium">Add Money</span>
                            </Link>
                            <Link href="/profile/order" className="flex flex-col items-center p-2 hover:text-red-500 transition w-full">
                                <FaList size={20} className="mb-1" />
                                <span className="text-[10px] font-medium">Orders</span>
                            </Link>
                            <Link href="/profile/my-codes" className="flex flex-col items-center p-2 hover:text-red-500 transition w-full">
                                <FaTicketAlt size={20} className="mb-1" />
                                <span className="text-[10px] font-medium">My Codes</span>
                            </Link>
                            <Link href="/profile" className="flex flex-col items-center p-2 hover:text-red-500 transition w-full">
                                <FaUser size={20} className="mb-1" />
                                <span className="text-[10px] font-medium">Account</span>
                            </Link>
                        </>
                    )}
                </nav>
            </footer>
        </>
    );
}
