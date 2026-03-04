"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OrderPage() {
    const [user, setUser] = useState<any>(null);
    const [orders, setOrders] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
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

        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-orders/${user?.id}?page=${currentPage}`);
                if (!response.ok) throw new Error("No orders found");
                const data = await response.json();
                setOrders(data.data);
                setTotalPages(data.last_page);
            } catch (err: any) {
                setError(err.message || "Error fetching orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, currentPage]);

    if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                    <svg className="w-6 h-6 text-pink-500" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M11 15H17V17H11V15M9 7H7V9H9V7M11 13H17V11H11V13M11 9H17V7H11V9M9 11H7V13H9V11M21 5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5M19 5H5V19H19V5M9 15H7V17H9V15Z"></path>
                    </svg>
                    <h2 className="text-xl font-bold text-gray-800">My Orders</h2>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Loading orders...</div>
                    ) : error ? (
                        <div className="text-center py-10 text-red-500">{error}</div>
                    ) : Object.keys(orders).length > 0 ? (
                        <div className="space-y-4">
                            {Object.values(orders).map((order: any) => {
                                let dataFields: any = {};
                                try { dataFields = JSON.parse(order.data); } catch { }

                                const isCompleted = order.status === "COMPLETED";
                                const isRejected = order.status === "Rejected";

                                return (
                                    <div key={order.id} className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow bg-white">
                                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-gray-100 pb-4 mb-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl font-bold bg-gray-100 text-gray-600 ">Order ID: #{order.order_id || order.id}</span>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Transaction ID</p>
                                                    <p className="font-mono font-bold text-gray-700 text-sm">{order.trx_id}</p>
                                                </div>
                                            </div>
                                            <div className="text-left md:text-right">
                                                <p className="text-sm text-gray-500">Amount Paid</p>
                                                <p className="font-bold text-xl text-pink-600">৳ {order.amount_paid}</p>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2 text-sm text-gray-600">
                                                <p><span className="font-medium text-gray-800">Date:</span> {new Date(order.created_at).toLocaleString()}</p>
                                                <p><span className="font-medium text-gray-800">Package:</span> {dataFields?.selectedRechargeType || 'N/A'}</p>
                                                {dataFields?.accountInfo && Object.entries(dataFields.accountInfo).map(([key, value]) => (
                                                    <p key={key}><span className="font-medium text-gray-800">{key.replace(/_/g, " ")}:</span> {value as string}</p>
                                                ))}
                                            </div>

                                            <div className="space-y-2 text-sm md:text-right">
                                                <div className="inline-flex flex-col md:items-end">
                                                    <span className="font-medium text-gray-500 mb-1">Status</span>
                                                    <span className={`px-4 py-1.5 rounded-full font-bold text-sm inline-block ${ 
                                                        isCompleted ? 'bg-green-100 text-green-700' : 
                                                        isRejected ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700' 
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                
                                                {isCompleted && (
                                                    <p className="text-xs text-green-600 mt-2">Completed on: {new Date(order.updated_at).toLocaleString()}</p>
                                                )}
                                                {isRejected && order.reject_reason && (
                                                    <div className="mt-2 p-3 bg-red-50 rounded-lg text-red-600 text-left md:text-right text-xs">
                                                        <span className="font-bold">Reason:</span> {order.reject_reason}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl text-gray-400">📦</span>
                            </div>
                            <h4 className="text-lg font-bold text-gray-800 mb-2">No orders found!</h4>
                            <p className="text-gray-500 mb-6">Looks like you haven't made any top-up orders yet.</p>
                            <Link href="/topup" className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 inline-block">
                                Order Now
                            </Link>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
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
