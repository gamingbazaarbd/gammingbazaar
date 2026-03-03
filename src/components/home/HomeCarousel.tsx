"use client";
import React, { useState, useEffect } from 'react';

export default function HomeCarousel({ banners }: { banners: string[] }) {
    const [slideIndex, setSlideIndex] = useState(0);

    useEffect(() => {
        if (!banners || banners.length === 0) return;
        const interval = setInterval(() => {
            setSlideIndex((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners]);

    if (!banners || banners.length === 0) return null;

    return (
        <div className="relative w-full overflow-hidden rounded-xl shadow-lg mt-4 group">
            <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${slideIndex * 100}%)` }}
            >
                {banners.map((img, i) => (
                    <div key={i} className="min-w-full">
                        <img 
                            src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/banner_images/${img}`} 
                            alt={`Banner ${i}`} 
                            className="w-full  max-h-[400px]"
                        />
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button 
                onClick={() => setSlideIndex(prev => (prev - 1 + banners.length) % banners.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
                ◀
            </button>
            <button 
                onClick={() => setSlideIndex(prev => (prev + 1) % banners.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
                ▶
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {banners.map((_, i) => (
                    <button 
                        key={i} 
                        onClick={() => setSlideIndex(i)}
                        className={`w-3 h-3 rounded-full transition-all ${i === slideIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                    />
                ))}
            </div>
        </div>
    );
}
