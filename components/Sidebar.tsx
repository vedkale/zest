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
        <aside className="mx-0 flex-shrink-0 px-0 font-sans">
            <div className="sticky">
                <nav
                    className="fade relative flex scroll-pr-6 flex-row items-start overflow-hidden md:relative md:flex-col md:overflow-auto"
                    id="nav"
                >
                    <div className="mb-2 mt-2 flex flex-col space-x-0 pr-10 md:mt-0">
                        {navItems[pathname] ? (
                            <>
                                <div>
                                    <motion.div
                                        className="absolute z-[-1] h-[34px] rounded-md bg-neutral-100 dark:bg-neutral-800"
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
                                        "py-[5px] px-[10px] transition-all hover:text-neutral-800 dark:hover:text-neutral-200",
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
