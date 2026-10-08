"use client";

import { useEffect, useState } from "react";

const API_URL =
    "https://api.api-store.workers.dev/api/bazardor/products";

const PriceRisers = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(API_URL);

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`);
                }

                const data = await response.json();

                console.log("API DATA:", data);

                const productList = Array.isArray(data)
                    ? data
                    : data.products || data.data || [];

                // শুধু যেসব পণ্যের দাম বেড়েছে
                // percentage অনুযায়ী বড় থেকে ছোট সাজানো
                const risers = productList
                    .filter((product) => product.change?.dir === "up")
                    .sort(
                        (a, b) =>
                            (b.change?.pct || 0) - (a.change?.pct || 0)
                    )
                    .slice(0, 6);

                console.log("TOP 6 RISERS:", risers);

                setProducts(risers);
            } catch (error) {
                console.error("FETCH ERROR:", error);
                setError("পণ্যের তথ্য লোড করা যায়নি।");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Loading
    if (loading) {
        return (
            <section className="bg-[#f3f8f4] px-4 py-12">
                <div className="mx-auto max-w-7xl">
                    <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 sm:text-2xl">
                        <span className="text-base text-red-500">
                            ▲
                        </span>
                        আজ দাম বেড়েছে
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        পণ্য লোড হচ্ছে...
                    </p>
                </div>
            </section>
        );
    }

    // Error
    if (error) {
        return (
            <section className="bg-[#f3f8f4] px-4 py-12">
                <div className="mx-auto max-w-7xl">
                    <div className="rounded-xl bg-red-50 p-5 text-center text-red-600">
                        {error}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-[#f3f8f4] px-4 py-12">
            <div className="mx-auto max-w-7xl">

                {/* Section Header */}
                <div className="mb-6">
                    <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 sm:text-2xl">
                        <span className="text-base text-red-500">
                            ▲
                        </span>
                        আজ দাম বেড়েছে
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        আজ যেসব পণ্যের দাম বেড়েছে
                    </p>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            {/* Product Info */}
                            <div className="flex items-center gap-4">

                                {/* Product Icon */}
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-3xl">
                                    {product.image ||
                                        product.categoryIcon ||
                                        "🛒"}
                                </div>

                                {/* Product Name */}
                                <div className="min-w-0">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {product.nameBn}
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        প্রতি {product.unit}
                                    </p>
                                </div>
                            </div>

                            {/* Price + Change */}
                            <div className="mt-6 flex items-end justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        আজকের দাম
                                    </p>

                                    <p className="mt-1 text-xl font-bold text-gray-900">
                                        ৳{product.today}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-400">
                                        প্রতি {product.unit}
                                    </p>
                                </div>

                                {/* Change Badge */}
                                <span className="rounded-full bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-600">
                                    ▲ {product.change?.pct}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {products.length === 0 && (
                    <div className="rounded-xl bg-gray-50 p-6 text-center text-gray-500">
                        কোনো পণ্যের দাম বাড়েনি।
                    </div>
                )}

            </div>
        </section>
    );
};

export default PriceRisers;