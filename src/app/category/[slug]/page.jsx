
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toBanglaNumber } from "../../components/priceUtils";

const API_BASE = "/api/products";

const categoryInfo = {
    chal: { name: "চাল", icon: "🍚" },
    dal: { name: "ডাল", icon: "🌾" },
    tel: { name: "তেল", icon: "🫙" },
    sobji: { name: "সবজি", icon: "🥬" },
    mach: { name: "মাছ", icon: "🐟" },
    mangsho: { name: "মাংস", icon: "🍗" },
    dim: { name: "ডিম-মধু", icon: "🥚" },
    mosla: { name: "মসলা", icon: "🌶️" },
};

export default function CategoryPage() {
    const params = useParams();
    const slug = params?.slug;

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState("default");
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!slug) return;

        let active = true;

        async function loadProducts() {
            setLoading(true);
            setError(false);

            try {
                const response = await fetch(
                    `${API_BASE}?category=${encodeURIComponent(slug)}`,
                    { cache: "no-store" }
                );

                if (!response.ok) {
                    throw new Error("Products fetch failed");
                }

                const data = await response.json();
                const list = Array.isArray(data)
                    ? data
                    : data.products || data.data || [];

                if (active) setProducts(list);
            } catch (err) {
                console.error("Category error:", err);
                if (active) setError(true);
            } finally {
                if (active) setLoading(false);
            }
        }

        loadProducts();

        return () => {
            active = false;
        };
    }, [slug]);

    const category = categoryInfo[slug] || {
        name: "পণ্য",
        icon: "🛒",
    };

    const sortedProducts = [...products].sort((a, b) => {
        if (sort === "low") return Number(a.today) - Number(b.today);
        if (sort === "high") return Number(b.today) - Number(a.today);
        return 0;
    });

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 px-4 py-10">
                <div className="mx-auto max-w-6xl animate-pulse">
                    <div className="mb-6 h-8 w-56 rounded bg-gray-200" />
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div key={item} className="rounded-2xl bg-white p-5">
                                <div className="h-12 w-12 rounded-xl bg-gray-200" />
                                <div className="mt-4 h-5 w-2/3 rounded bg-gray-200" />
                                <div className="mt-3 h-7 w-1/3 rounded bg-gray-200" />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    if (error || !categoryInfo[slug] || products.length === 0) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4">
                <div className="text-center">
                    <p className="text-5xl">😕</p>
                    <h1 className="mt-4 text-2xl font-bold text-gray-800">
                        {error ? "পণ্য লোড করা যায়নি" : "এই ক্যাটাগরিতে পণ্য পাওয়া যায়নি"}
                    </h1>
                    <p className="mt-2 text-gray-500">
                        অন্য ক্যাটাগরি নির্বাচন করে আবার চেষ্টা করো।
                    </p>
                    <Link
                        href="/"
                        className="mt-5 inline-block rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
                    >
                        ← হোমে ফিরে যাও
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <Link href="/" className="text-sm font-semibold text-green-700">
                    ← হোমে ফিরে যাও
                </Link>

                <section className="mt-5 flex flex-col justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-4xl">
                            {category.icon}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                {category.name}
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                মোট {toBanglaNumber(products.length)}টি পণ্য
                            </p>
                        </div>
                    </div>

                    <label className="flex items-center gap-3 text-sm font-medium text-gray-600">
                        দাম অনুযায়ী সাজাও
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 outline-none focus:border-green-500"
                        >
                            <option value="default">ডিফল্ট</option>
                            <option value="low">কম দাম থেকে বেশি</option>
                            <option value="high">বেশি দাম থেকে কম</option>
                        </select>
                    </label>
                </section>

                <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {sortedProducts.map((product) => {
                        const direction = product.change?.dir;
                        const slugValue = product.slug || product.id;

                        return (
                            <Link
                                key={product.id}
                                href={`/product/${slugValue}`}
                                className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-50 text-3xl">
                                        {product.image || product.categoryIcon || category.icon}
                                    </div>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${direction === "up"
                                                ? "bg-red-50 text-red-600"
                                                : direction === "down"
                                                    ? "bg-green-50 text-green-700"
                                                    : "bg-gray-100 text-gray-500"
                                            }`}
                                    >
                                        {direction === "up"
                                            ? `▲ ${toBanglaNumber(product.change?.pct)}%`
                                            : direction === "down"
                                                ? `▼ ${toBanglaNumber(product.change?.pct)}%`
                                                : "—"}
                                    </span>
                                </div>

                                <h2 className="mt-4 text-lg font-bold text-gray-900 group-hover:text-green-700">
                                    {product.nameBn || product.name}
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    প্রতি {product.unit === "kg" ? "কেজি" : product.unit === "liter" ? "লিটার" : product.unit || "একক"}
                                </p>

                                <div className="mt-4 flex items-end justify-between border-t border-gray-100 pt-4">
                                    <div>
                                        <p className="text-xs text-gray-500">আজকের দাম</p>
                                        <p className="mt-1 text-2xl font-bold text-gray-900">
                                            {toBanglaNumber(product.today)} টাকা
                                        </p>
                                    </div>
                                    <span className="text-sm font-semibold text-green-700">
                                        বিস্তারিত →
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}