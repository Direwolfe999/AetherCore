import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SystemStatusBar } from "@/components/navigation/system-status-bar";
import { DesktopSidebar } from "@/components/navigation/desktop-sidebar";
import { MobileBottomDock } from "@/components/navigation/mobile-bottom-dock";
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
            <body className={inter.className}>
                <div className="relative min-h-screen bg-black">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,240,255,0.08),transparent_45%)]" />

                    {/* Navigation Components */}
                    <SystemStatusBar />
                    <DesktopSidebar />
                    <MobileBottomDock />

                    <div className="relative z-10 flex min-h-screen flex-col lg:ml-20">
                        {/* Top padding for status bar */}
                        <div className="h-16 md:h-14" />

                        {/* Main Content */}
                        <main className="flex-1 px-4 py-8 md:px-6 md:py-12 pb-24 lg:pb-8">
                            {children}
                        </main>

                        {/* Footer */}
                        <Footer />
                    </div>
                </div>
            </body>
        </html>
    );
}
