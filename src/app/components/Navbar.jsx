"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const categories = [
    {
        name: "চাল",
        icon: "🍚",
        slug: "chal",
    },
    {
        name: "ডাল",
        icon: "🌾",
        slug: "dal",
    },
    {
        name: "তেল",
        icon: "🫙",
        slug: "tel",
    },
    {
        name: "সবজি",
        icon: "🥬",
        slug: "sobji",
    },
    {
        name: "মাছ",
        icon: "🐟",
        slug: "mach",
    },
    {
        name: "মাংস",
        icon: "🍗",
        slug: "mangsho",
    },
    {
        name: "ডিম-মধু",
        icon: "🥚",
        slug: "dim",
    },
    {
        name: "মসলা",
        icon: "🌶️",
        slug: "mosla",
    },
];

export default function Navbar() {
    const pathname = usePathname();

    const isLoggedIn = false;

    return (
        <header className="w-full bg-white">

            {/* TOP BAR */}
            <div className="bg-[#1f1f1f]">
                <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="text-sm font-medium text-[#8ed8ff] transition hover:text-white"
                    >
                        Home
                    </Link>

                    <div className="text-lg font-bold text-[#8ed8ff]">
                        &lt;/&gt;
                    </div>
                </div>
            </div>

            {/* LOGO + AUTH */}
            <div className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex min-h-[82px] items-center justify-between">

                        {/* LOGO */}
                        <Link
                            href="/"
                            className="flex items-center gap-3"
                        >
                            <div className="relative h-11 w-11 sm:h-12 sm:w-12">
                                <Image
                                    src="/logo-icon.png"
                                    alt="বাজার দর"
                                    fill
                                    priority
                                    sizes="48px"
                                    className="object-contain"
                                />
                            </div>

                            <div>
                                <h1 className="text-lg font-bold text-gray-800 sm:text-xl">
                                    বাজার দর
                                </h1>

                                <p className="text-[10px] text-gray-500 sm:text-xs">
                                    শুক্রবার, ৯ অক্টোবর, ২০২৬
                                </p>
                            </div>
                        </Link>

                        {/* AUTH */}
                        {!isLoggedIn ? (
                            <div className="flex items-center gap-1 sm:gap-3">
                                <Link
                                    href="/signin"
                                    className="px-2 py-2 text-xs font-medium text-gray-700 transition hover:text-green-600 sm:px-3 sm:text-sm"
                                >
                                    সাইন ইন
                                </Link>

                                <Link
                                    href="/signup"
                                    className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700 sm:px-5 sm:py-2.5 sm:text-sm"
                                >
                                    সাইন আপ
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/profile"
                                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                                >
                                    প্রোফাইল
                                </Link>

                                <button
                                    type="button"
                                    className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                                >
                                    সাইন আউট
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CATEGORY NAVIGATION */}
            <div className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">

                    <nav className="flex items-center justify-between overflow-x-auto scrollbar-hide">

                        {categories.map((category) => {
                            const isActive =
                                pathname === `/category/${category.slug}` ||
                                pathname.startsWith(
                                    `/category/${category.slug}/`
                                );

                            return (
                                <Link
                                    key={category.slug}
                                    href={`/category/${category.slug}`}
                                    className={
                                        isActive
                                            ? "flex shrink-0 items-center justify-center gap-2 border-b-2 border-green-600 bg-green-50 px-3 py-3 text-xs font-medium text-green-600 transition-all sm:px-5 sm:py-4 sm:text-sm"
                                            : "flex shrink-0 items-center justify-center gap-2 border-b-2 border-transparent px-3 py-3 text-xs font-medium text-gray-700 transition-all hover:bg-green-50 hover:text-green-600 sm:px-5 sm:py-4 sm:text-sm"
                                    }
                                >
                                    <span className="shrink-0 text-base sm:text-lg">
                                        {category.icon}
                                    </span>

                                    <span>
                                        {category.name}
                                    </span>
                                </Link>
                            );
                        })}

                    </nav>
                </div>
            </div>

        </header>
    );
}