"use client";
import React, { useState } from 'react';

export default function NoticeBanner({ notice }: { notice: any }) {
    const [isVisible, setIsVisible] = useState(true);

    if (!notice || notice.status !== "1" || !isVisible) {
        return null;
    }

    return (
        <section className="mb-4">
            <div className="container mx-auto px-4 py-3 rounded-lg shadow-md relative" style={{ background: "rgb(255, 100, 0)" }}>
                <div className="flex items-center justify-between mb-2">
                    <h2 className="font-bold text-white text-lg flex items-center gap-2">
                        <span className="text-xl">🔔</span> Notice:
                    </h2>
                    <button 
                        onClick={() => setIsVisible(false)}
                        className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
                    >
                        <svg viewBox="0 0 24 24" className="w-6 h-6">
                            <path fill="currentColor" d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z"></path>
                        </svg>
                    </button>
                </div>
                <div className="text-white text-sm prose prose-sm prose-invert max-w-none pl-6 pr-8">
                    {notice.message ? (
                        <div dangerouslySetInnerHTML={{ __html: notice.message }} />
                    ) : (
                        "No message available"
                    )}
                </div>
            </div>
        </section>
    );
}
