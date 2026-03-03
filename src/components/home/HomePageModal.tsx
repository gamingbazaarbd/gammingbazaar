"use client";
import React, { useState, useEffect } from 'react';

export default function HomePageModal({ initialData }: { initialData: any }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!initialData || initialData.status === '0') return;

        const lastDismissalDate = localStorage.getItem('notificationDismissalDate');
        const today = new Date().toISOString().split('T')[0];

        // Check if notice data has changed to force show it again
        const storedNoticeData = localStorage.getItem('noticeData');
        if (storedNoticeData !== JSON.stringify(initialData)) {
            localStorage.setItem('noticeData', JSON.stringify(initialData));
            localStorage.removeItem('notificationDismissalDate');
            setIsVisible(true);
        } else if (lastDismissalDate !== today) {
            setIsVisible(true);
        }
    }, [initialData]);

    const closeHandler = () => {
        setIsVisible(false);
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem('notificationDismissalDate', today);
    };

    if (!isVisible || !initialData) return null;

    return (
        <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative bg-white rounded-xl shadow-2xl max-w-[600px] w-full mt-20 md:mt-0 animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col md:flex-row">
                <button
                    className="absolute -right-0 -top-0 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-transform hover:scale-110 z-10"
                    onClick={closeHandler}
                >
                    ✕
                </button>
                
                {initialData.image && (
                    <div className="w-full md:w-1/2 h-48 md:h-auto">
                        <img
                            src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/popup_images/${initialData.image}`}
                            alt="Notice"
                            className="w-full h-full "
                        />
                    </div>
                )}
                
                <div className={`w-full ${initialData.image ? 'md:w-1/2' : ''} p-6 flex flex-col justify-center`}>
                    <div className="prose prose-sm prose-red max-w-none text-gray-700">
                        {initialData.message ? (
                            <div dangerouslySetInnerHTML={{ __html: initialData.message }} />
                        ) : (
                            <p>No message available</p>
                        )}
                    </div>
                    
                    {initialData.external_link && (
                        <div className="mt-6 text-center">
                            <a
                                href={initialData.external_link}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors"
                            >
                                Click Here
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
