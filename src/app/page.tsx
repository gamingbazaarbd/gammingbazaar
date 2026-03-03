import React from 'react';
import HomeCarousel from '@/components/home/HomeCarousel';
import HomePageModal from '@/components/home/HomePageModal';
import ProductGrid from '@/components/home/ProductGrid';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import NoticeBanner from '@/components/home/NoticeBanner';

async function fetchSiteSettings() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/frontend-settings`, {
            next: { revalidate: 60 }
        });

        if (!res.ok) return null;

        return (await res.json()).site_settings;
    } catch {
        return null;
    }
}

async function fetchProducts(page: number) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api?page=${page}`, {
            next: { revalidate: 60 }
        });

        if (!res.ok) return [];
            
        return (await res.json()).data || [];
    } catch {
        return [];
    }
}

export default async function HomePage({ searchParams }: { searchParams: { page?: string } }) {
    const page = Number(searchParams.page) || 1;
    const settings = await fetchSiteSettings();
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
            <HomePageModal initialData={settings?.notice_popup} />
            <NoticeBanner notice={settings?.notice} />

            <div className="container mx-auto">
                {settings?.banner_images && <HomeCarousel banners={settings.banner_images} />}

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
                    <Link href={`/?page=${page > 1 ? page - 1 : 1}`} className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 text-gray-700 font-bold transition-all">
                        <FaArrowLeft /> Previous
                    </Link>
                    <span className="font-bold text-lg text-gray-700">Page {page}</span>
                    <Link href={`/?page=${page + 1}`} className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 text-gray-700 font-bold transition-all">
                        Next <FaArrowRight />
                    </Link>
                </div>

                {/* Download App */}
                <div className="my-10">
                    <a href="https://play.google.com/store/apps/details?id=com.srgameshop.app" target="_blank" rel="noopener noreferrer" className="flex items-center bg-pink-50 max-w-sm mx-auto rounded-xl p-4 border-2 border-pink-500/60 shadow-md hover:shadow-lg transition-shadow">
                        <img src="https://bakgroma.shop/assets/images/stores/DEU/google-play.png" alt="Google Play" className="h-[70px] mr-5" />
                        <div>
                            <h4 className="font-medium text-gray-800">Download our mobile app now</h4>
                            <p className="font-bold text-pink-600 mt-1">Download Now →</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}
