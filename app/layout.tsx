import "./globals.css";
import { Roboto_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar";

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
            className={`text-white bg-[#121212] ${roboto_mono.variable}`}
        >
            <body className="antialiased mb-40 flex pl-4 pt-10 pr-4">
                <Sidebar />
                <main className="flex-auto min-w-fit flex flex-col px-0 mt-0">{children}</main>
            </body>
        </html>
    );
}

