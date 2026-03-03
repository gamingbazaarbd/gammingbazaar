"use client";
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

interface ContactInfo {
    whatsapp_number?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    email?: string;
    google_app_url?: string;
    phone_number?: string;
    how_to_add_money?: string;
}

interface SiteSettings {
    contact_info?: ContactInfo;
    [key: string]: unknown;
}

const SiteSettingsContext = createContext<SiteSettings | null>(null);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
    const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

    useEffect(() => {
        async function fetchSiteSettings() {
            try {
                const response = await axios.get(`/api/frontend-settings`);
                setSiteSettings(response.data.site_settings);
            } catch (error) {
                console.error('Failed to fetch site settings:', error);
            }
        }
        fetchSiteSettings();
    }, []);

    return (
        <SiteSettingsContext.Provider value={siteSettings}>
            {children}
        </SiteSettingsContext.Provider>
    );
}

export function useSiteSettings() {
    return useContext(SiteSettingsContext);
}
