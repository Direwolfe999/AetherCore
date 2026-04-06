import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SystemStatusBar } from "@/components/navigation/system-status-bar";
import { DesktopSidebar } from "@/components/navigation/desktop-sidebar";
import { MobileBottomDock } from "@/components/navigation/mobile-bottom-dock";
import { CommandPalette } from "@/components/navigation/command-palette";
import { GlobalBootManager } from "@/components/ui/global-boot-manager";
import { Toaster } from "sonner";
import { Auth0Provider } from '@auth0/nextjs-auth0/client';
import { DisableInteraction } from "@/components/ui/disable-interaction";

import { Suspense } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AetherCore Premium Frontend",
    description: "Sovereign AI Guardian Interface",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} overflow-x-hidden`}>
                <Auth0Provider>
                    <GlobalBootManager>
                        <div className="relative min-h-screen w-full overflow-x-clip bg-black">
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,240,255,0.08),transparent_45%)]" />

                            {/* Navigation Components */}
                            <SystemStatusBar />
                            <DesktopSidebar />
                            <MobileBottomDock />
                            <CommandPalette />

                            <div className="relative z-10 flex min-h-screen max-w-full flex-col lg:ml-20">
                                {/* Top padding for status bar */}
                                <div className="h-16 md:h-14" />

                                {/* Main Content */}
                                <main className="flex-1 max-w-full px-4 py-8 pb-[calc(6.5rem+env(safe-area-inset-bottom))] md:px-6 md:py-12 lg:pb-8">
                                    {children}
                                </main>

                                {/* Footer */}
                                <Footer />
                            </div>
                        </div>
                        <Toaster theme="dark" position="bottom-right" toastOptions={{ className: 'border border-white/10 bg-black/50 text-white font-mono' }} />
                    </GlobalBootManager>
                </Auth0Provider>
            </body>
        </html>
    );
}
