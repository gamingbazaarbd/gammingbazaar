"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TransactionsPage() {
    const [user, setUser] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
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

        const fetchTransactions = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-transactions/${user?.id}?page=${currentPage}`);
                if (!response.ok) throw new Error("Network response was not ok");
                const data = await response.json();
                
                if (data.data.length === 0) {
                    setError('No transactions found for this user.');
                } else {
                    setTransactions(data.data);
                    setTotalPages(data.last_page);
                    setError('');
                }
            } catch (err: any) {
                setError(err.message || "Error fetching transactions");
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [user, currentPage]);

    if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[60vh]">
                <div className="bg-gray-50 px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                    <svg className="w-6 h-6 text-pink-500" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M11 15H17V17H11V15M9 7H7V9H9V7M11 13H17V11H11V13M11 9H17V7H11V9M9 11H7V13H9V11M21 5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5M19 5H5V19H19V5M9 15H7V17H9V15Z"></path>
                    </svg>
                    <h2 className="text-xl font-bold text-gray-800">All Transactions</h2>
                </div>

                <div className="p-0">
                    {loading ? (
                        <div className="text-center py-20 text-gray-500">Loading transactions...</div>
                    ) : error ? (
                        <div className="text-center py-20 text-gray-500">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">💸</span>
                            </div>
                            <p>{error}</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white border-b border-gray-100 uppercase text-xs font-bold text-gray-500 tracking-wider">
                                        <th className="px-6 py-4">Trx ID</th>
                                        <th className="px-6 py-4">Amount Due</th>
                                        <th className="px-6 py-4">Amount Paid</th>
                                        <th className="px-6 py-4">Payment Type</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {transactions.map((transaction, index) => (
                                        <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-sm text-gray-800">{transaction.trx_id}</td>
                                            <td className="px-6 py-4 font-medium text-gray-600">৳ {transaction.amount_due}</td>
                                            <td className="px-6 py-4 font-bold text-pink-600">৳ {transaction.amount_paid}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                                                    {transaction.payment_type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                                                    transaction.status === 'success' || transaction.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    transaction.status === 'failed' || transaction.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {transaction.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
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
