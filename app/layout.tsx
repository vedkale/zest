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
            <body className="antialiased mb-40 flex mx-4 mr-8 mt-20 ">
                <Sidebar />
                <main className="flex-auto min-w-fit mt-0 flex flex-col px-0">{children}</main>
            </body>
        </html>
    );
}
