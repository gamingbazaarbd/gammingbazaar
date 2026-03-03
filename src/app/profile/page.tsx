"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [userData, setUserData] = useState<any>(null);
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
    const fetchUserProfile = async () => {
        if (!user?.id) return;

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/user-profile/${user?.id}`
            );

            if (!response.ok) {
                console.error("Server error:", response.status);
                return;
            }

            const data = await response.json();
            setUserData(data);

        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    fetchUserProfile();
}, [user]);

    if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    console.log("userData", user );

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
            {/* Header Section */}
            <div className="text-center bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-pink-500 to-red-500 opacity-10"></div>
                <div className="relative z-10">
                    <img
                        src="/src_assets/img/default.png"
                        alt="Profile"
                        className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-md bg-gray-200"
                    />
                    <h1 className="capitalize mt-4 text-2xl font-bold text-gray-800">Hi, {user.name}</h1>
                    
                    <div className="mt-4 inline-flex items-center justify-center gap-3 bg-pink-50 border border-pink-100 px-6 py-3 rounded-full text-pink-700 font-medium">
                        <span className="text-gray-600">Available Balance:</span>
                        <span className="font-bold text-xl">৳ {userData ? userData.available_balance : '...'}</span>
                        <button className="bg-pink-100 p-1.5 rounded-full hover:bg-pink-200 transition-colors">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 text-pink-600">
                                <path fill="currentColor" d="M2 12C2 16.97 6.03 21 11 21C13.39 21 15.68 20.06 17.4 18.4L15.9 16.9C14.63 18.25 12.86 19 11 19C4.76 19 1.64 11.46 6.05 7.05C10.46 2.64 18 5.77 18 12H15L19 16H19.1L23 12H20C20 7.03 15.97 3 11 3C6.03 3 2 7.03 2 12Z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-4 grid-cols-2 gap-4 mb-8">
                {/* Stat Cards */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center hover:-translate-y-1 transition-transform duration-300">
                    <h2 className="text-3xl font-bold text-orange-500 mb-1">102302</h2>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Support Pin</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center hover:-translate-y-1 transition-transform duration-300">
                    <h2 className="text-3xl font-bold text-orange-500 mb-1">৳ {userData ? userData.weekly_spent : '...'}</h2>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Weekly Spent</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center hover:-translate-y-1 transition-transform duration-300">
                    <h2 className="text-3xl font-bold text-orange-500 mb-1">৳ {userData ? userData.total_spent : '...'}</h2>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Spent</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center hover:-translate-y-1 transition-transform duration-300">
                    <h2 className="text-3xl font-bold text-orange-500 mb-1">{userData ? userData.total_orders : '...'}</h2>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Orders</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
                 {/* Account Info */}
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                        <svg className="w-6 h-6 text-pink-500" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M21 11.1V8C21 6.9 20.1 6 19 6H11L9 4H3C1.9 4 1 4.9 1 6V18C1 19.1 1.9 20 3 20H10.2C11.4 21.8 13.6 23 16 23C19.9 23 23 19.9 23 16C23 14.1 22.2 12.4 21 11.1M9.3 18H3V8H19V9.7C18.1 9.2 17.1 9 16 9C12.1 9 9 12.1 9 16C9 16.7 9.1 17.4 9.3 18M16 21C13.2 21 11 18.8 11 16S13.2 11 16 11 21 13.2 21 16 18.8 21 16 21M17 14H15V12H17V14M17 20H15V15H17V20Z"></path>
                        </svg>
                        <h2 className="text-lg font-bold text-gray-800">Account Information</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="text-center p-4 border border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center justify-center">
                            <div className="bg-blue-100 text-blue-600 p-3 rounded-full mb-3">
                                <svg className="w-8 h-8" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M23,12L20.56,9.22L20.9,5.54L17.29,4.72L15.4,1.54L12,3L8.6,1.54L6.71,4.72L3.1,5.53L3.44,9.21L1,12L3.44,14.78L3.1,18.47L6.71,19.29L8.6,22.47L12,21L15.4,22.46L17.29,19.28L20.9,18.46L20.56,14.78L23,12M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"></path>
                                </svg>
                            </div>
                            <h5 className="text-lg font-bold text-gray-800">Account Verified!</h5>
                        </div>
                        <div className="text-center p-4 border border-gray-100 rounded-xl bg-pink-50 flex flex-col items-center justify-center">
                            <h5 className="text-2xl font-bold text-pink-600 mb-1">৳ {userData ? userData.available_balance : '...'}</h5>
                            <span className="text-sm font-medium text-pink-400">Available Balance</span>
                        </div>
                    </div>
                </div>

                {/* User Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                        <svg className="w-6 h-6 text-pink-500" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"></path>
                        </svg>
                        <h2 className="text-lg font-bold text-gray-800">User Details</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-gray-500">📧</span>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Email Address</p>
                                <p className="font-medium text-gray-800">{userData ? userData.user.email : user?.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-gray-500">📱</span>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Phone Number</p>
                                <p className="font-medium text-gray-800">{userData ? userData.user.phone : user?.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
