"use client";

import { useEffect, useState } from "react";

const API_URL =
    "https://api.api-store.workers.dev/api/bazardor/products";

const AllProducts = () => {
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

                const productList = Array.isArray(data)
                    ? data
                    : data.products || data.data || [];

                setProducts(productList);
            } catch (error) {
                console.error("FETCH ERROR:", error);
                setError("পণ্যের তথ্য লোড করা যায়নি।");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <section
                id="সব-পণ্য"
                className="bg-[#f3f8f4] px-4 py-10 sm:py-12"
            >
                <div className="mx-auto max-w-7xl">
                    <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                        সব পণ্য
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        পণ্য লোড হচ্ছে...
                    </p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section
                id="সব-পণ্য"
                className="bg-[#f3f8f4] px-4 py-10 sm:py-12"
            >
                <div className="mx-auto max-w-7xl">
                    <div className="rounded-xl bg-red-50 p-5 text-center text-red-600">
                        {error}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            id="সব-পণ্য"
            className="bg-[#f3f8f4] px-4 py-10 sm:py-12"
        >
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-5">
                    <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                        সব পণ্য
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        বাজারের সব পণ্যের আজকের দাম
                    </p>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

                    {products.map((product) => {
                        const direction = product.change?.dir;
                        const percentage = product.change?.pct || 0;

                        return (
                            <div
                                key={product.id}
                                className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-4"
                            >
                                {/* Product Info */}
                                <div className="flex items-center gap-3">

                                    {/* Image / Emoji */}
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-2xl">
                                        {product.image ||
                                            product.categoryIcon ||
                                            "🛒"}
                                    </div>

                                    {/* Name */}
                                    <div className="min-w-0 flex-1">
                                        <h3 className="truncate text-sm font-semibold text-gray-900">
                                            {product.nameBn}
                                        </h3>

                                        <p className="mt-0.5 text-xs text-gray-400">
                                            প্রতি {product.unit}
                                        </p>
                                    </div>
                                </div>

                                {/* Bottom */}
                                <div className="mt-3 flex items-end justify-between gap-2">

                                    <div>
                                        <p className="text-xs text-gray-400">
                                            আজকের দাম
                                        </p>

                                        <p className="mt-0.5 text-base font-bold text-gray-900">
                                            ৳{product.today}
                                        </p>
                                    </div>

                                    {/* Change */}
                                    {direction === "up" && (
                                        <span className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-500">
                                            ▲ {percentage}%
                                        </span>
                                    )}

                                    {direction === "down" && (
                                        <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-600">
                                            ▼ {Math.abs(percentage)}%
                                        </span>
                                    )}

                                    {direction === "flat" && (
                                        <span className="rounded-full bg-gray-50 px-2 py-1 text-[10px] font-semibold text-gray-400">
                                            — 0%
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty */}
                {products.length === 0 && (
                    <div className="rounded-xl bg-white p-6 text-center text-gray-500">
                        কোনো পণ্য পাওয়া যায়নি।
                    </div>
                )}
            </div>
        </section>
    );
};

export default AllProducts;