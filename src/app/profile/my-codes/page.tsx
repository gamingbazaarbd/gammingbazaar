"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaCopy } from 'react-icons/fa';

export default function MyCodesPage() {
    const [user, setUser] = useState<any>(null);
    const [orders, setOrders] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [copySuccess, setCopySuccess] = useState(false);
    
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user-info');
        if (!storedUser) {
            router.push('/login');
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [router]);

    useEffect(() => {
        if (!user?.id) return;

        const fetchCodes = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-codes/${user?.id}?page=${currentPage}`);
                if (!response.ok) throw new Error("Network response was not ok");
                const data = await response.json();
                
                if (data.data.length === 0) {
                    setError('No codes found for this user.');
                } else {
                    setOrders(data.data);
                    setTotalPages(data.last_page);
                    setError('');
                }
            } catch (err: any) {
                setError(err.message || 'Error fetching codes');
            } finally {
                setLoading(false);
            }
        };

        fetchCodes();
    }, [user, currentPage]);

    const handleCopyCode = (licenseKey: string) => {
        navigator.clipboard.writeText(licenseKey);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
            {copySuccess && (
                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="bg-gray-800 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 font-medium border border-gray-700">
                        <span className="text-green-400">✓</span> Code Copied Successfully
                    </div>
                </div>
            )}

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[60vh]">
                <div className="bg-gray-50 px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <svg className="w-6 h-6 text-pink-500" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M11 15H17V17H11V15M9 7H7V9H9V7M11 13H17V11H11V13M11 9H17V7H11V9M9 11H7V13H9V11M21 5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5M19 5H5V19H19V5M9 15H7V17H9V15Z"></path>
                        </svg>
                        <h2 className="text-xl font-bold text-gray-800">My Codes</h2>
                    </div>
                    <a href="https://shop.garena.my/app" target="_blank" rel="noopener noreferrer" className="bg-pink-100 text-pink-600 hover:bg-pink-200 hover:text-pink-700 font-bold py-2 px-4 rounded-xl text-sm transition-colors border border-pink-200">
                        Redeem Center ↗
                    </a>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="text-center py-20 text-gray-500">Loading codes...</div>
                    ) : error ? (
                        <div className="text-center py-16">
                             <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl text-gray-400">🎟️</span>
                            </div>
                            <h4 className="text-lg font-bold text-gray-800 mb-2">No codes found!</h4>
                            <p className="text-gray-500 mb-6">Looks like you haven't purchased any gift cards or codes yet.</p>
                            <Link href="/topup" className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 inline-block">
                                Order Now
                            </Link>
                        </div>
                    ) : Object.keys(orders).length > 0 ? (
                        <div className="space-y-4">
                            {Object.values(orders).map((order: any) => {
                                let dataFields: any = {};
                                try { dataFields = JSON.parse(order.data); } catch { }

                                const isCompleted = order.status === "COMPLETED";
                                const isRejected = order.status === "Rejected";

                                return (
                                    <div key={order.id} className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow bg-white relative overflow-hidden">
                                        {/* Status indicator line */}
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${isCompleted ? 'bg-green-500' : isRejected ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                                        
                                        <div className="flex flex-col md:flex-row justify-between gap-6 pl-2">
                                            <div className="w-full md:w-5/12 space-y-3">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Order #{order.order_id || order.id}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">Transaction</p>
                                                        <p className="font-mono font-bold text-gray-800 text-sm whitespace-nowrap overflow-hidden text-ellipsis">{order.trx_id}</p>
                                                    </div>
                                                </div>
                                                <div className="hidden md:block border-t border-gray-100 my-2"></div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-500">Date</span>
                                                    <span className="font-medium text-gray-800">{new Date(order.created_at).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-500">Package</span>
                                                    <span className="font-medium text-gray-800">{dataFields.selectedRechargeType}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-2">
                                                    <span className="text-gray-500 font-medium">Amount Paid</span>
                                                    <span className="font-bold text-pink-600">৳ {order.amount_paid}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-500 font-medium">Status</span>
                                                    <span className={`font-bold ${isCompleted ? 'text-green-600' : isRejected ? 'text-red-600' : 'text-yellow-600'}`}>{order.status}</span>
                                                </div>
                                            </div>

                                            <div className="hidden border-l border-gray-100 md:block"></div>

                                            <div className="w-full md:w-6/12 flex flex-col justify-center">
                                                {isCompleted ? (
                                                    order.license_key ? (
                                                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Your Secret Code</p>
                                                            <div className="font-mono text-lg md:text-xl font-bold text-gray-800 bg-white border border-gray-300 border-dashed rounded-lg p-3 mb-3 break-all select-all">
                                                                {order.license_key}
                                                            </div>
                                                            <button 
                                                                onClick={() => handleCopyCode(order.license_key)}
                                                                className="mx-auto flex items-center justify-center gap-2 bg-gray-800 hover:bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
                                                            >
                                                                <FaCopy className="text-gray-400" /> Copy Code
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center text-gray-500">
                                                            Code Not Available
                                                        </div>
                                                    )
                                                ) : isRejected ? (
                                                    <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center text-red-600">
                                                        <p className="font-bold mb-1">Order Rejected</p>
                                                        <p className="text-sm">{order.reject_reason || "No reason provided"}</p>
                                                    </div>
                                                ) : (
                                                    <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-6 text-center text-yellow-700">
                                                        <p className="font-bold">Pending Processing</p>
                                                        <p className="text-sm mt-1">Your code will appear here once approved.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : null}
                </div>

                {/* Pagination */}
                {totalPages > 1 && !error && !loading && (
                    <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-center items-center gap-4">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-200 text-gray-600 hover:bg-pink-50 hover:text-pink-600 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <span className="font-medium text-gray-700">
                            Page <span className="font-bold text-pink-600">{currentPage}</span> of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => prev < totalPages ? prev + 1 : prev)}
                            disabled={currentPage === totalPages}
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-200 text-gray-600 hover:bg-pink-50 hover:text-pink-600 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
