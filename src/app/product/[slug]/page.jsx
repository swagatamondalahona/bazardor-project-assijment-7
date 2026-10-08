"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toBanglaNumber } from "../../components/priceUtils";

const API_BASE =
    "https://api.api-store.workers.dev/api/bazardor";

function ProductDetailContent() {
    const params = useParams();
    const slug = params?.slug;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!slug) return;

        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(false);

                console.log("Product URL:", slug);

                // সব products নিয়ে আসি
                const response = await fetch(
                    `${API_BASE}/products`,
                    {
                        cache: "no-store",
                    }
                );

                if (!response.ok) {
                    throw new Error("Products API failed");
                }

                const data = await response.json();

                const products = Array.isArray(data)
                    ? data
                    : data?.products || data?.data || [];

                console.log("Products:", products);

                // slug অথবা id দিয়ে product খুঁজবো
                const foundProduct = products.find(
                    (item) =>
                        String(item.slug) === String(slug) ||
                        String(item.id) === String(slug)
                );

                console.log("Found Product:", foundProduct);

                if (!foundProduct) {
                    throw new Error("Product not found");
                }

                // Detail API
                const detailResponse = await fetch(
                    `${API_BASE}/products/${foundProduct.id}`,
                    {
                        cache: "no-store",
                    }
                );

                if (!detailResponse.ok) {
                    throw new Error("Product detail API failed");
                }

                const detailData = await detailResponse.json();

                console.log("Product Detail:", detailData);

                // API সরাসরি object return করছে
                setProduct(detailData);
            } catch (err) {
                console.error("Product Detail Error:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    // Loading
    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 px-4 py-10">
                <div className="mx-auto max-w-6xl animate-pulse">
                    <div className="h-5 w-32 rounded bg-gray-200" />

                    <div className="mt-6 rounded-3xl bg-white p-8">
                        <div className="h-24 w-24 rounded-2xl bg-gray-200" />

                        <div className="mt-6 h-8 w-72 rounded bg-gray-200" />

                        <div className="mt-3 h-5 w-48 rounded bg-gray-200" />
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        <div className="h-32 rounded-2xl bg-gray-200" />
                        <div className="h-32 rounded-2xl bg-gray-200" />
                        <div className="h-32 rounded-2xl bg-gray-200" />
                    </div>
                </div>
            </main>
        );
    }

    // Error
    if (error || !product) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
                <div className="text-center">
                    <div className="text-6xl">😕</div>

                    <h1 className="mt-5 text-2xl font-bold text-gray-900">
                        পণ্য পাওয়া যায়নি
                    </h1>

                    <p className="mt-2 text-gray-500">
                        পণ্যের তথ্য লোড করা যায়নি।
                    </p>

                    <Link
                        href="/"
                        className="mt-6 inline-block rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
                    >
                        ← হোমে ফিরে যান
                    </Link>
                </div>
            </main>
        );
    }

    const markets = Array.isArray(product.markets)
        ? product.markets
        : [];

    const minimum =
        markets.length > 0
            ? Math.min(
                ...markets.map((market) =>
                    Number(market.min)
                )
            )
            : Number(product.today);

    const maximum =
        markets.length > 0
            ? Math.max(
                ...markets.map((market) =>
                    Number(market.max)
                )
            )
            : Number(product.today);

    const average = Math.round(
        (minimum + maximum) / 2
    );

    const changeDir = product.change?.dir;
    const changePct = Number(
        product.change?.pct || 0
    );

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">

                {/* Back */}
                <Link
                    href="/"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800"
                >
                    ← সব পণ্যে ফিরে যান
                </Link>

                {/* Product Header */}
                <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

                        {/* Icon */}
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-6xl">
                            {product.image ||
                                product.categoryIcon ||
                                "🛒"}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="mb-3 flex flex-wrap gap-2">

                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                    {product.categoryNameBn ||
                                        product.category}
                                </span>

                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                                    প্রতি {product.unit || "একক"}
                                </span>

                            </div>

                            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                                {product.nameBn ||
                                    product.name}
                            </h1>

                            <p className="mt-2 text-gray-500">
                                আজকের বাজারদর ও বিভিন্ন বাজারের মূল্য
                            </p>
                        </div>

                        {/* Today Price */}
                        <div className="sm:text-right">

                            <p className="text-sm text-gray-500">
                                আজকের দাম
                            </p>

                            <p className="mt-1 text-3xl font-bold text-gray-900">
                                {toBanglaNumber(
                                    product.today
                                )}{" "}
                                টাকা
                            </p>

                            {changeDir === "up" && (
                                <span className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                                    ▲{" "}
                                    {toBanglaNumber(
                                        changePct
                                    )}
                                    %
                                </span>
                            )}

                            {changeDir === "down" && (
                                <span className="mt-2 inline-block rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">
                                    ▼{" "}
                                    {toBanglaNumber(
                                        changePct
                                    )}
                                    %
                                </span>
                            )}

                            {!changeDir && (
                                <span className="mt-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-500">
                                    —
                                </span>
                            )}

                        </div>
                    </div>
                </section>

                {/* Statistics */}
                <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-500">
                            সর্বনিম্ন দাম
                        </p>

                        <p className="mt-2 text-2xl font-bold text-green-600">
                            {toBanglaNumber(minimum)} টাকা
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-500">
                            সর্বোচ্চ দাম
                        </p>

                        <p className="mt-2 text-2xl font-bold text-red-500">
                            {toBanglaNumber(maximum)} টাকা
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-500">
                            গড় দাম
                        </p>

                        <p className="mt-2 text-2xl font-bold text-gray-900">
                            {toBanglaNumber(average)} টাকা
                        </p>
                    </div>

                </section>

                {/* Markets */}
                <section className="mt-10">

                    <div className="mb-5">
                        <h2 className="text-2xl font-bold text-gray-900">
                            বাজারভিত্তিক আজকের দাম
                        </h2>

                        <p className="mt-1 text-gray-500">
                            বিভিন্ন বাজারে{" "}
                            {product.nameBn} এর দাম
                        </p>
                    </div>

                    {markets.length === 0 ? (
                        <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm">
                            বাজারভিত্তিক তথ্য পাওয়া যায়নি।
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

                            {markets.map(
                                (market, index) => (
                                    <div
                                        key={`${market.market}-${index}`}
                                        className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                    >
                                        <div className="flex items-start justify-between gap-3">

                                            <div>
                                                <h3 className="font-bold text-gray-900">
                                                    {market.market}
                                                </h3>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    {market.division}
                                                </p>
                                            </div>

                                            <span className="text-2xl">
                                                {product.categoryIcon ||
                                                    "🏪"}
                                            </span>

                                        </div>

                                        <div className="mt-5 grid grid-cols-2 gap-3">

                                            <div className="rounded-xl bg-green-50 p-3">
                                                <p className="text-xs text-gray-500">
                                                    সর্বনিম্ন
                                                </p>

                                                <p className="mt-1 font-bold text-green-700">
                                                    {toBanglaNumber(
                                                        market.min
                                                    )}{" "}
                                                    টাকা
                                                </p>
                                            </div>

                                            <div className="rounded-xl bg-red-50 p-3">
                                                <p className="text-xs text-gray-500">
                                                    সর্বোচ্চ
                                                </p>

                                                <p className="mt-1 font-bold text-red-600">
                                                    {toBanglaNumber(
                                                        market.max
                                                    )}{" "}
                                                    টাকা
                                                </p>
                                            </div>

                                        </div>
                                    </div>
                                )
                            )}

                        </div>
                    )}

                </section>
            </div>
        </main>
    );
}

function ProductDetailLoading() {
    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="mx-auto max-w-6xl animate-pulse">

                <div className="h-5 w-32 rounded bg-gray-200" />

                <div className="mt-6 rounded-3xl bg-white p-8">
                    <div className="h-24 w-24 rounded-2xl bg-gray-200" />

                    <div className="mt-5 h-8 w-72 rounded bg-gray-200" />

                    <div className="mt-3 h-5 w-48 rounded bg-gray-200" />
                </div>

            </div>
        </main>
    );
}

export default function ProductDetailPage() {
    return (
        <Suspense fallback={<ProductDetailLoading />}>
            <ProductDetailContent />
        </Suspense>
    );
}