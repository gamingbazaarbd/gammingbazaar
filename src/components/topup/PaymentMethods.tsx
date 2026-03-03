"use client";
import { div } from 'framer-motion/client';
import React from 'react';

interface PaymentMethodsProps {
    selectedPaymentMethod: string;
    onPaymentMethodChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onManualPaymentClick: () => void;
}

export default function PaymentMethods({ selectedPaymentMethod, onPaymentMethodChange, onManualPaymentClick }: PaymentMethodsProps) {
    return (
        <div className="grid grid-cols-2 gap-4 py-4 px-3">
            {/* Wallet pay */}
            <label
                htmlFor="wallet"
                className={`relative cursor-pointer rounded-xl border-2 transition-all duration-200 overflow-hidden ${selectedPaymentMethod === 'wallet' ? 'border-pink-500 shadow-md ring-2 ring-pink-500/20' : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50'}`}
            >
                <img src="/src_assets/img/wallet.jpg" alt="wallet" className="w-full h-24 object-contain p-4" />
                <input
                    id="wallet"
                    name="payment"
                    type="radio"
                    value="wallet"
                    checked={selectedPaymentMethod === "wallet"}
                    onChange={onPaymentMethodChange}
                    className="sr-only"
                />
                <div className={`p-2 text-center text-xs font-bold ${selectedPaymentMethod === 'wallet' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
                    Pay from Wallet
                </div>
            </label>


              <label
                onClick={onManualPaymentClick}
                className={`relative cursor-pointer rounded-xl border-2 transition-all duration-200 overflow-hidden  ${selectedPaymentMethod === 'manual' ? 'border-pink-500 shadow-md ring-2 ring-pink-500/20' : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50'}`}
            >
                <img src="/src_assets/img/manual.png" alt="manual" className="w-full h-24 object-contain p-4" />
                <div className={`p-2 text-center text-xs font-bold ${selectedPaymentMethod === 'manual' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
                    Pay Manually
                </div>
            </label>

            {/* Instant pay */}
            <label
                htmlFor="instant"
                className={`relative cursor-pointer rounded-xl border-2 transition-all duration-200 overflow-hidden col-span-2 ${selectedPaymentMethod === 'instant' ? 'border-pink-500 shadow-md ring-2 ring-pink-500/20' : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50'}`}
            >
                <img src="/src_assets/img/auto_payments.f9dfa769.png" alt="instant" className="w-full h-24 object-contain p-4" />
                <input
                    id="instant"
                    name="payment"
                    type="radio"
                    value="instant"
                    checked={selectedPaymentMethod === "instant"}
                    onChange={onPaymentMethodChange}
                    className="sr-only"
                />
                <div className={`p-2 text-center text-xs font-bold ${selectedPaymentMethod === 'instant' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
                    Instant Pay
                </div>
            </label>

           
        </div>
    );
}
