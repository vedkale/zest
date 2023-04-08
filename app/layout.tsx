import "./globals.css";
import { Roboto_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import { cache } from "react";

const roboto_mono = Roboto_Mono({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-roboto-mono",
});

export const metadata = {
    title: "Zest",
    description: "Budget App",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={`bg-[#121212] text-white ${roboto_mono.variable} mr-2`}
        >
            <body className="mb-40 flex pl-4 pr-4 pt-10 antialiased">
                <Sidebar />
                <main className="mt-0 flex min-w-fit flex-auto flex-col px-0">
                    {children}
                </main>
            </body>
        </html>
    );
}
