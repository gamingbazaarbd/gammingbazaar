import React from 'react';
import type { Metadata } from 'next';
import TopUpDetailsClient from '@/components/topup/TopUpDetailsClient';

async function fetchProductDetails(code: string) {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend.gammingbazaar.com';
        const res = await fetch(`${apiUrl}/api/topup-detail/${code}`, {
            next: { revalidate: 60 },
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            }
        });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: { params: { code: string } }): Promise<Metadata> {
    const product = await fetchProductDetails(params.code);

    if (!product) {
        return {
            title: 'Product Not Found',
            description: 'The requested top-up package does not exist or is unavailable.',
        };
    }

    const title = `${product.name} Top Up Bangladesh`;
    const description = `Buy ${product.name} instantly through Bkash and Nagad. Fast and reliable top up service in Bangladesh for ${product.name}.`;
    let ogImageUrl = '';
    
    if (product.gallery) {
        ogImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/storage/products/${product.gallery}`;
    }

    return {
        title: title,
        description: description,
        keywords: [product.name, `${product.name} topup bangladesh`, `buy ${product.name} bkash`, 'game topup bd'],
        openGraph: {
            title: title,
            description: description,
            images: ogImageUrl ? [{ url: ogImageUrl }] : [],
            url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gammingbazaar.com'}/topup/${params.code}`,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: ogImageUrl ? [ogImageUrl] : [],
        },
    };
}

export default async function TopUpDetailsPage({ params }: { params: { code: string } }) {
    const product = await fetchProductDetails(params.code);

    if (!product) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-red-100 max-w-md mx-auto mt-20">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
                    <p className="text-gray-500">The requested top-up package does not exist or is unavailable.</p>
                </div>
            </div>
        );
    }

    return (
        <TopUpDetailsClient product={product} />
    );
}
