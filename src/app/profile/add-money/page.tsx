"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSiteSettings } from '@/context/SiteSettingsContext';

export default function ProfileAddMoneyPage() {
    const [user, setUser] = useState<any>(null);
    const [amount, setAmount] = useState('');
    const [isValidAmount, setIsValidAmount] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [paymentType, setPaymentType] = useState<'instant' | 'manual'>('manual');
    const [manualMethods, setManualMethods] = useState<any[]>([]);
    const [selectedMethod, setSelectedMethod] = useState<any>(null);
    const [senderNumber, setSenderNumber] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const router = useRouter();
    const siteSettings = useSiteSettings();

    useEffect(() => {
        const storedUser = localStorage.getItem('user-info');
        if (!storedUser) {
            router.push('/login');
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [router]);

    useEffect(() => {
        const fetchManualMethods = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment-methods`);
                if (response.ok) {
                    const data = await response.json();
                    setManualMethods(data);
                    if (data.length > 0) {
                        setSelectedMethod(data[0]);
                    }
                }
            } catch (err) {
                console.error("Error fetching manual methods:", err);
            }
        };
        fetchManualMethods();
    }, []);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAmount(value);
        if (/^\d+(\.\d{1,2})?$/.test(value) && parseFloat(value) > 0) {
            setIsValidAmount(true);
            setError('');
        } else {
            setIsValidAmount(false);
            setError('Please enter a valid amount');
        }
    };

    const handleManualSubmit = async () => {
        if (!isValidAmount) return;
        if (!selectedMethod) return setError("Please select a payment method");
        if (!senderNumber.trim()) return setError("Please enter sender number");
        if (!transactionId.trim()) return setError("Please enter transaction ID");

        setLoading(true);
        setError('');

        const payload = {
            full_name: user?.name,
            email: user?.email,
            amount: amount,
            user_id: user?.id,
            productId: 6, // Using a fallback product ID for the manual endpoint
            quantity: 1,
            selectedRechargeType: 'Wallet Topup',
            payment_method_id: selectedMethod.id,
            sender_number: senderNumber.trim(),
            transaction_id: transactionId.trim(),
            accountInfo: { type: 'Wallet', amount: amount }
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/manual`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok && data.status === "success") {
                alert("Top-up request submitted! Please wait for admin verification.");
                router.push('/profile/order');
            } else {
                setError(data.message || 'Submission failed');
            }
        } catch (err: any) {
            setError('Submission failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async (paymentData: any) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/initiate-wallet-topup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(paymentData),
            });

            const data = await response.json();

            if (response.ok && data.payment_url) {
                window.location.href = data.payment_url;
            } else {
                setError(data.message || 'Payment initiation failed');
            }
        } catch (error: any) {
            setError('Payment initiation failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBuyNow = () => {
        if (!user) return;
        if (paymentType === 'manual') {
            handleManualSubmit();
            return;
        }
        setLoading(true);
        const productDetails = {
            full_name: user.name,
            email: user.email,
            amount: amount,
            user_id: user.id,
        };
        localStorage.setItem('productDetails', JSON.stringify(productDetails));
        handlePayment(productDetails);
    };

    if (!user || !siteSettings) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    const { contact_info } = siteSettings;

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                <div className="bg-gray-50 px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <svg className="w-6 h-6 text-pink-500" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M3 4V16H21V4H3M3 2H21C22.1 2 23 2.89 23 4V16C23 16.53 22.79 17.04 22.41 17.41C22.04 17.79 21.53 18 21 18H14V20H16V22H8V20H10V18H3C2.47 18 1.96 17.79 1.59 17.41C1.21 17.04 1 16.53 1 16V4C1 2.89 1.89 2 3 2M10.84 8.93C11.15 8.63 11.57 8.45 12 8.45C12.43 8.46 12.85 8.63 13.16 8.94C13.46 9.24 13.64 9.66 13.64 10.09C13.64 10.53 13.46 10.94 13.16 11.25C12.85 11.56 12.43 11.73 12 11.73C11.57 11.73 11.15 11.55 10.84 11.25C10.54 10.94 10.36 10.53 10.36 10.09C10.36 9.66 10.54 9.24 10.84 8.93M10.07 12C10.58 12.53 11.28 12.82 12 12.82C12.72 12.82 13.42 12.53 13.93 12C14.44 11.5 14.73 10.81 14.73 10.09C14.73 9.37 14.44 8.67 13.93 8.16C13.42 7.65 12.72 7.36 12 7.36C11.28 7.36 10.58 7.65 10.07 8.16C9.56 8.67 9.27 9.37 9.27 10.09C9.27 10.81 9.56 11.5 10.07 12M6 10.09C6.94 7.7 9.27 6 12 6C14.73 6 17.06 7.7 18 10.09C17.06 12.5 14.73 14.18 12 14.18C9.27 14.18 6.94 12.5 6 10.09Z"></path>
                        </svg>
                        <h2 className="text-xl font-bold text-gray-800">Add Money to Wallet</h2>
                    </div>
                    <div className="flex bg-gray-200 p-1 rounded-xl">
                        <button 
                            onClick={() => setPaymentType('instant')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${paymentType === 'instant' ? 'bg-white shadow-sm text-pink-500' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Instant Pay
                        </button>
                        <button 
                            onClick={() => setPaymentType('manual')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${paymentType === 'manual' ? 'bg-white shadow-sm text-pink-500' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Manual Pay
                        </button>
                    </div>
                </div>
                
                <div className="p-8">
                    <div className="max-w-md mx-auto relative">
                        {/* decorative background element */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-pink-100 to-red-50 opacity-50 blur-xl rounded-full z-0"></div>
                        
                        <div className="relative z-10 bg-white p-6 rounded-2xl shadow-sm border border-pink-100">
                            <label className="block text-center text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Enter Amount to Add</label>
                            
                            <div className="relative flex items-center justify-center mb-6">
                                <span className="absolute left-6 text-3xl font-bold text-gray-400">৳</span>
                                <input
                                    type="text"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={handleAmountChange}
                                    className="w-full text-center text-5xl font-bold text-gray-800 bg-transparent border-0 border-b-2 border-gray-200 focus:border-pink-500 focus:ring-0 py-4 outline-none transition-colors placeholder-gray-300"
                                    autoFocus
                                />
                            </div>

                            {paymentType === 'manual' && (
                                <div className="mb-6 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="border-t border-gray-100 pt-4">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Select Method</p>
                                        <div className="flex flex-wrap gap-2">
                                            {manualMethods.map(method => (
                                                <button
                                                    key={method.id}
                                                    type="button"
                                                    onClick={() => setSelectedMethod(method)}
                                                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${selectedMethod?.id === method.id ? 'bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-200' : 'bg-white border-gray-100 text-gray-600 hover:border-pink-200'}`}
                                                >
                                                    {method.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {selectedMethod && (
                                        <div className="bg-pink-50 p-4 rounded-2xl border border-pink-100">
                                            <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-1">Target Account</p>
                                            <p className="text-lg font-black text-gray-800">{selectedMethod.phone}</p>
                                            <p className="text-[10px] text-pink-500/70 mt-1 font-bold">Please send money to this number first.</p>
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Sender Number</label>
                                            <input 
                                                type="text" 
                                                value={senderNumber}
                                                onChange={(e) => setSenderNumber(e.target.value)}
                                                placeholder="01XXXXXXXXX"
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Transaction ID</label>
                                            <input 
                                                type="text" 
                                                value={transactionId}
                                                onChange={(e) => setTransactionId(e.target.value)}
                                                placeholder="Enter TrxID"
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all uppercase"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {error && <p className="text-red-500 text-sm font-medium text-center mb-4">{error}</p>}
                            
                            <button
                                type="button"
                                onClick={handleBuyNow}
                                disabled={!isValidAmount || loading}
                                className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-4 px-6 rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                            >
                                {loading ? "Processing..." : (paymentType === 'manual' ? "Submit Request" : "Proceed to Payment")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {contact_info?.how_to_add_money && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                        <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                        </svg>
                        <h2 className="text-xl font-bold text-gray-800">How to Add Money</h2>
                    </div>
                    <div className="p-4 md:p-6">
                        <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                            <iframe
                                title="Add Money Tutorial"
                                src={contact_info.how_to_add_money}
                                referrerPolicy="strict-origin-when-cross-origin"
                                className="w-full h-full min-h-[300px] md:min-h-[400px]"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
