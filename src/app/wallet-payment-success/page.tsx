"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface WalletPaymentDetails {
    order_id: string;
    trx_id: string;
    dateTime: string;
    totalAmount: number | string;
    balance: number | string;
    payment_method: string;
    user: { name: string; email: string };
}

function WalletTopUpPaymentSuccessContent() {
    const searchParams = useSearchParams();
    const [paymentDetails, setPaymentDetails] = useState<WalletPaymentDetails | null>(null);
    const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
        const orderId = searchParams.get('trx_id');

        if (orderId) {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/wallet-topup-payment-details/${orderId}`
                );

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setPaymentDetails(data);

            } catch (error) {
                console.error("Wallet details fetch error:", error);
                setError("Could not load wallet top-up details.");
            }
        } else {
            setError("No transaction ID found.");
        }
    };

    fetchPaymentDetails();
}, [searchParams]);

    if (error) {
        return (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto mt-10 p-8">
                <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                    ✕
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Details Not Found</h1>
                <p className="text-gray-500 mb-8">{error}</p>
                <Link href="/profile" className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold py-3 px-8 rounded-full shadow-md hover:-translate-y-0.5 transition-transform inline-block">
                    Return to Profile
                </Link>
            </div>
        );
    }

    if (!paymentDetails) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    const {
        trx_id,
        dateTime,
        totalAmount,
        balance,
        payment_method,
        user
    } = paymentDetails;

    return (
        <div className="container mx-auto px-4 py-8 md:py-16 max-w-3xl">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative">
                {/* Decorative particles */}
                <div className="absolute top-10 left-10 w-4 h-4 rounded-full bg-yellow-300 animate-pulse"></div>
                <div className="absolute top-20 right-16 w-6 h-6 rounded-full bg-blue-300 animate-pulse delay-75"></div>
                <div className="absolute bottom-20 left-20 w-8 h-8 rounded-full bg-pink-300 animate-pulse delay-150 opacity-50"></div>

                <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-10 text-center text-white relative z-10">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-2xl">
                       <span className="text-5xl">🏦</span>
                    </div>
                    <h1 className="text-3xl font-extrabold mb-2 text-white drop-shadow-md">Wallet Top-Up Successful!</h1>
                    <p className="text-purple-100 text-lg">Your fund addition request was completed successfully.</p>
                </div>

                <div className="p-8 md:p-12 relative z-10 bg-white">
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                         {/* Old vs New Balance Concept */}
                         <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col items-center justify-center text-center">
                            <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-2">Added Amount</p>
                            <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                                ৳ {totalAmount}
                            </p>
                         </div>

                         <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 flex flex-col items-center justify-center text-center">
                            <p className="text-sm text-emerald-600 uppercase tracking-widest font-bold mb-2">New Wallet Balance</p>
                            <p className="text-4xl font-extrabold text-emerald-600">
                                ৳ {balance}
                            </p>
                         </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden text-sm">
                            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50 uppercase tracking-tighter">
                                <span className="text-gray-500 font-bold">Order Number</span>
                                <span className="font-bold text-gray-800">#{paymentDetails.order_id}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 border-b border-gray-100">
                                <span className="text-gray-500 font-medium">Transaction ID</span>
                                <span className="font-mono font-bold text-gray-800">{trx_id}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 border-b border-gray-100">
                                <span className="text-gray-500 font-medium">Date & Time</span>
                                <span className="text-gray-800">{dateTime}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-50">
                                <span className="text-gray-500 font-medium">Payment Method</span>
                                <span className="font-bold text-gray-800 capitalize bg-white px-3 py-1 rounded-md border border-gray-200 shadow-sm">{payment_method}</span>
                            </div>
                        </div>

                         <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                    👤
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">{user?.name}</p>
                                    <p className="text-blue-600 text-xs">{user?.email}</p>
                                </div>
                            </div>
                         </div>
                    </div>

                    <div className="mt-10 flex justify-center">
                        <Link href="/profile" className="bg-gray-800 hover:bg-black text-white font-bold py-4 px-10 rounded-full shadow-lg transition-transform hover:-translate-y-1">
                            Go to My Profile
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function WalletTopUpPaymentSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">Loading Wallet details...</div>}>
            <WalletTopUpPaymentSuccessContent />
        </Suspense>
    );
}
