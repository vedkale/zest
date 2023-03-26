"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems: { [pathname: string]: { name: string; y: number; w: string } } =
    {
        "/": {
            name: "Home",
            y: 0,
            w: "64px",
        },
        "/transactions": {
            name: "Transactions",
            y: 35,
            w: "120px",
        },
        "/accounts": {
            name: "Accounts",
            y: 68,
            w: "92px",
        },
    };

export default function Sidebar() {
    let pathname = usePathname() || "/";
    return (
        <aside className="font-sans flex-shrink-0 px-0 mx-0">
            <div className="sticky">
                <nav
                    className="flex overflow-hidden flex-row md:flex-col items-start relative fade md:overflow-auto scroll-pr-6 md:relative"
                    id="nav"
                >
                    <div className="flex flex-col space-x-0 pr-10 mb-2 mt-2 md:mt-0">
                        {navItems[pathname] ? (
                            <>
                                <div>
                                    <motion.div
                                        className="absolute bg-neutral-100 dark:bg-neutral-800 h-[34px] rounded-md z-[-1]"
                                        layoutId="test2"
                                        initial={{
                                            opacity: 0,
                                            y: navItems[pathname].y,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: navItems[pathname].y,
                                            width: navItems[pathname].w,
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 350,
                                            damping: 30,
                                        }}
                                    />
                                </div>
                            </>
                        ) : null}
                        {Object.entries(navItems).map(([path, { name }]) => {
                            const isActive = path === pathname;

                            return (
                                <Link
                                    href={path}
                                    key={path}
                                    className={clsx(
                                        "transition-all hover:text-neutral-800 dark:hover:text-neutral-200 py-[5px] px-[10px]",
                                        {
                                            "text-neutral-500": !isActive,
                                            "font-bold": isActive,
                                        }
                                    )}
                                >
                                    {name}
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            </div>
        </aside>
    );
}
