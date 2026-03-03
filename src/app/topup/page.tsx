import React from 'react';
import ProductGrid from '@/components/home/ProductGrid';
import Link from 'next/link';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

async function fetchProducts(page: number) {
    try {
        const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/?page=${page}`,
  { next: { revalidate: 60 } }
);
        if (!res.ok) return [];
        return (await res.json()).data || [];
    } catch {
        return [];
    }
}

export default async function TopUpPage({ searchParams }: { searchParams: { page?: string } }) {
    const page = Number(searchParams.page) || 1;
    const products = await fetchProducts(page);

    const mobileGames = products.filter((item: any) => {
        try {
            const parsed = typeof item.input_fields === 'string' ? JSON.parse(item.input_fields) : (item.input_fields || {});
            return parsed.is_quantity_selection_allowed === "NO";
        } catch { return false; }
    });

    const giftCards = products.filter((item: any) => {
        try {
            const parsed = typeof item.input_fields === 'string' ? JSON.parse(item.input_fields) : (item.input_fields || {});
            return parsed.is_quantity_selection_allowed === "YES";
        } catch { return false; }
    });

    return (
        <div className="pt-4 md:pt-[4%] px-2">
            <div className="container mx-auto">
                {/* Mobile Games */}
                <div className="text-center mb-6 mt-10">
                    <div className="flex items-center justify-center px-4 py-4 md:py-8">
                        <hr className="flex-grow border-gray-300" />
                        <h3 className="text-2xl sm:text-3xl font-bold mx-4 text-gray-900 font-primary">MOBILE GAMES TOP UP</h3>
                        <hr className="flex-grow border-gray-300" />
                    </div>
                </div>
                <ProductGrid products={mobileGames} />

                {/* Gift Cards */}
                <div className="text-center mb-6 mt-10">
                    <div className="flex items-center justify-center px-4 py-4 md:py-8">
                        <hr className="flex-grow border-gray-300" />
                        <h3 className="text-2xl sm:text-3xl font-bold mx-4 text-gray-900 font-primary">Gift Cards/Vouchers</h3>
                        <hr className="flex-grow border-gray-300" />
                    </div>
                </div>
                <ProductGrid products={giftCards} />

                {/* Pagination */}
                <div className="flex items-center justify-center gap-4 py-8">
                    <Link href={`/topup?page=${page > 1 ? page - 1 : 1}`} className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 text-gray-700 font-bold transition-all">
                        <FaArrowLeft /> Previous
                    </Link>
                    <span className="font-bold text-lg text-gray-700">Page {page}</span>
                    <Link href={`/topup?page=${page + 1}`} className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 text-gray-700 font-bold transition-all">
                        Next <FaArrowRight />
                    </Link>
                </div>
            </div>
        </div>
    );
}



