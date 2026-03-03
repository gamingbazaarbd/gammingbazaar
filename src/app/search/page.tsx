"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function SearchPageContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!query) return;

        const fetchSearchResults = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/search?q=${encodeURIComponent(query)}`);
                if (!res.ok) throw new Error("Search failed");
                const data = await res.json();
                setResults(data);
            } catch (err: any) {
                console.error("Search error:", err);
                // To properly replicate old app, if search fails, let's just show empty or error
                setError("Failed to fetch search results.");
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    return (
        <div className="container mx-auto px-4 py-8 md:py-16 min-h-[60vh]">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
                    Search Results
                </h1>
                <p className="text-gray-500">
                    Showing results for: <span className="font-bold text-pink-500">"{query}"</span>
                </p>
                <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-violet-500 mx-auto mt-4 rounded-full"></div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                </div>
            ) : error ? (
                <div className="text-center py-20 text-red-500 bg-red-50 rounded-2xl border border-red-100">
                    <span className="text-3xl block mb-2">⚠️</span>
                    <p>{error}</p>
                </div>
            ) : results && results.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                    {results.map((item) => (
                        <div key={item.id} className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col items-center">
                            <Link href={`/topup/${item.code}`} className="w-full flex flex-col items-center p-4">
                                <div className="relative w-full aspect-square mb-3 rounded-xl overflow-hidden shadow-inner">
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/products/${item.gallery}`}
                                        alt={item.name}
                                        fill
                                        sizes="(max-width: 768px) 50vw, 33vw"
                                        className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                
                                <h3 className="text-center text-sm md:text-base font-bold text-gray-800 line-clamp-2 min-h-[40px] group-hover:text-pink-600 transition-colors">
                                    {item.name}
                                </h3>
                                
                                <div className="mt-3 w-full bg-pink-50 text-pink-600 text-xs font-bold py-2 rounded-lg text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm border border-pink-100">
                                    Top Up Now
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100 dashed">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No results found!</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                        We couldn't find anything matching "{query}". Try adjusting your search term.
                    </p>
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <React.Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center">Loading search results...</div>}>
            <SearchPageContent />
        </React.Suspense>
    );
}
