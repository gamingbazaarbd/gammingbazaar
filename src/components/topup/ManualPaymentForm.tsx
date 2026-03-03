"use client";
import React from 'react';

interface ManualPaymentFormProps {
    product: any;
    selectedRechargeType: string;
    quantity: number;
    totalAmount: number;
    paymentMethods: any[];
    selectedManualMethod: any;
    setSelectedManualMethod: React.Dispatch<React.SetStateAction<any>>;
    senderNumber: string;
    setSenderNumber: React.Dispatch<React.SetStateAction<string>>;
    transactionId: string;
    setTransactionId: React.Dispatch<React.SetStateAction<string>>;
    error: string | null;
    loading: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

export default function ManualPaymentForm({
    product, selectedRechargeType, quantity, totalAmount, paymentMethods,
    selectedManualMethod, setSelectedManualMethod, senderNumber, setSenderNumber,
    transactionId, setTransactionId, error, loading, onSubmit, onCancel
}: ManualPaymentFormProps) {
    return (
        <section className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white border rounded-xl shadow-sm p-5 md:p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Manual Payment</h2>
                    <button onClick={onCancel} className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full w-8 h-8 flex items-center justify-center transition-colors font-bold">
                        ✕
                    </button>
                </div>

                <div className="mb-6 p-4 bg-gray-50 border border-gray-100 rounded-lg">
                    <h3 className="font-bold text-gray-700 mb-3 border-b pb-2">Order Summary</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                        <p><span className="font-medium text-gray-800">Product:</span> {product?.name}</p>
                        <p><span className="font-medium text-gray-800">Package:</span> {selectedRechargeType}</p>
                        <p><span className="font-medium text-gray-800">Quantity:</span> {quantity}</p>
                        <p className="text-lg font-bold text-pink-600 mt-3 pt-2 border-t border-gray-200">Total: ৳ {totalAmount}</p>
                    </div>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="mb-6">
                        <label className="block font-medium text-sm text-gray-700 mb-3">Select Payment Method</label>
                        {paymentMethods.length === 0 ? (
                            <div className="text-center py-3 text-gray-500 italic">Leading payment options...</div>
                        ) : (
                            <div className="flex gap-3 flex-wrap">
                                {paymentMethods.map((method) => (
                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() => setSelectedManualMethod(method)}
                                        className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm ${selectedManualMethod?.id === method.id ? 'bg-pink-600 text-white scale-105 shadow-pink-500/20' : 'bg-white border border-gray-300 text-gray-700 hover:border-pink-400 hover:bg-pink-50'}`}
                                    >
                                        {method.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {selectedManualMethod && (
                        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg animate-in fade-in duration-300">
                            <p className="text-sm font-medium text-gray-600 mb-1">Send money to:</p>
                            <p className="text-2xl font-bold tracking-wider text-orange-600">{selectedManualMethod.phone}</p>
                            <p className="text-sm font-medium text-gray-700 mt-2 bg-orange-100 inline-block px-3 py-1 rounded-full">Amount: ৳ {totalAmount}</p>
                        </div>
                    )}

                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Your Number / Sender Number</label>
                            <input
                                type="text"
                                value={senderNumber}
                                onChange={(e) => setSenderNumber(e.target.value)}
                                placeholder="01XXXXXXXXX"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-colors bg-gray-50 focus:bg-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
                            <input
                                type="text"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                placeholder="Enter TrxID"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-colors uppercase bg-gray-50 focus:bg-white"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm animate-in fade-in duration-300 flex items-start gap-2">
                            <span className="font-bold text-lg leading-none">!</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button type="button" onClick={onCancel} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg hover:from-pink-600 hover:to-red-600 disabled:opacity-50 font-medium shadow-md shadow-pink-500/20 transition-all">
                            {loading ? "Submitting..." : "Submit Payment"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
