'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaDownload } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'

export default function FloatingAppInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstall, setShowInstall] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Register the service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(
          function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          },
          function(err) {
            console.log('ServiceWorker registration failed: ', err);
          }
        );
      });
    }

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsDismissed(true)
    }

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      
      // We only show the prompt if it hasn't been explicitly dismissed
      const dismissed = localStorage.getItem('pwa_install_dismissed')
      if (!dismissed) {
        setShowInstall(true)
      }
    });

    // Detect when the app is successfully installed
    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null)
      setShowInstall(false)
      setIsDismissed(true)
    })
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setShowInstall(false)
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowInstall(false)
    setIsDismissed(true)
    localStorage.setItem('pwa_install_dismissed', 'true')
  }

  // If there's no deferred prompt (either not supported, already installed, or not fired yet) 
  // or it was dismissed, we hide the button
  if (!showInstall && !isDismissed && deferredPrompt) {
     // fallback if showInstall got toggled
     setShowInstall(true)
  }

  return (
    <AnimatePresence>
      {(showInstall || deferredPrompt) && !isDismissed && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-[74px] left-2 right-2 z-[9999] md:bottom-24 md:left-auto md:right-6 md:w-[380px]"
        >
          <div className="bg-[#000180] rounded-xl p-3 shadow-2xl flex items-center justify-between gap-3 border border-white/5">
            <div className="flex items-center gap-3 pl-1">
              <FaDownload className="text-white text-lg" />
              <span className="text-white text-sm font-bold tracking-wide">Install App</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleInstallClick}
                className="bg-[#eef2ff] hover:bg-white text-[#000180] font-bold py-1.5 px-4 rounded-lg text-xs transition-all active:scale-95 shadow-sm"
              >
                Install
              </button>
              <button 
                onClick={handleDismiss}
                className="text-white/70 hover:text-white transition-colors p-1"
                aria-label="Close"
              >
                <IoClose size={22} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
