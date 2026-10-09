
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toBanglaNumber } from "../../components/priceUtils";

const API_BASE = "https://api.api-store.workers.dev/api/bazardor";

const unitLabels = {
    kg: "কেজি",
    liter: "লিটার",
    litre: "লিটার",
    l: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
    pcs: "পিস",
    unit: "একক",
};

function getUnitLabel(unit) {
    if (!unit) return "একক";

    return unitLabels[String(unit).toLowerCase()] || unit;
}

function getProducts(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.products)) return data.products;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.data?.products)) return data.data.products;

    return [];
}

function ProductDetailLoading() {
    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="mx-auto max-w-6xl animate-pulse">
                <div className="h-5 w-36 rounded bg-gray-200" />

                <div className="mt-6 rounded-3xl bg-white p-6 sm:p-8">
                    <div className="h-24 w-24 rounded-2xl bg-gray-200" />
                    <div className="mt-6 h-8 w-72 max-w-full rounded bg-gray-200" />
                    <div className="mt-3 h-5 w-48 max-w-full rounded bg-gray-200" />
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="h-32 rounded-2xl bg-gray-200"
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}

function ProductDetailContent() {
    const params = useParams();
    const slug = params?.slug;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!slug) return;

        let cancelled = false;

        async function fetchProduct() {
            try {
                setLoading(true);
                setError(false);
                setProduct(null);

                // প্রথমে সব পণ্য থেকে নির্দিষ্ট পণ্য খুঁজব
                const response = await fetch(`${API_BASE}/products`, {
                    cache: "no-store",
                });

                if (!response.ok) {
                    throw new Error("Products API failed");
                }

                const data = await response.json();
                const products = getProducts(data);

                const foundProduct = products.find(
                    (item) =>
                        String(item.slug) === String(slug) ||
                        String(item.id) === String(slug)
                );

                if (!foundProduct) {
                    throw new Error("Product not found");
                }

                // তালিকার তথ্য দিয়ে শুরু করব
                let finalProduct = { ...foundProduct };

                // বিস্তারিত API কাজ করলে তার তথ্যও যুক্ত হবে
                try {
                    const detailResponse = await fetch(
                        `${API_BASE}/products/${foundProduct.id}`,
                        { cache: "no-store" }
                    );

                    if (detailResponse.ok) {
                        const detailData = await detailResponse.json();

                        const detailProduct =
                            detailData?.product ??
                            detailData?.data?.product ??
                            detailData?.data ??
                            detailData;

                        if (
                            detailProduct &&
                            typeof detailProduct === "object" &&
                            !Array.isArray(detailProduct)
                        ) {
                            finalProduct = {
                                ...foundProduct,
                                ...detailProduct,
                            };
                        }
                    }
                } catch (detailError) {
                    console.warn(
                        "Product detail API unavailable; using product list data.",
                        detailError
                    );
                }

                // বাজারের তথ্য যেন হারিয়ে না যায়
                if (!Array.isArray(finalProduct.markets)) {
                    finalProduct.markets = Array.isArray(foundProduct.markets)
                        ? foundProduct.markets
                        : [];
                }

                if (!cancelled) {
                    setProduct(finalProduct);
                }
            } catch (err) {
                console.error("Product Detail Error:", err);

                if (!cancelled) {
                    setError(true);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchProduct();

        return () => {
            cancelled = true;
        };
    }, [slug]);

    if (loading) {
        return <ProductDetailLoading />;
    }

    if (error || !product) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
                <div className="text-center">
                    <div className="text-6xl">😕</div>

                    <h1 className="mt-5 text-2xl font-bold text-gray-900">
                        পণ্য পাওয়া যায়নি
                    </h1>

                    <p className="mt-2 text-gray-500">
                        পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।
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

    const validMarkets = markets.filter(
        (market) =>
            market.min !== null &&
            market.min !== undefined &&
            market.max !== null &&
            market.max !== undefined &&
            market.min !== "" &&
            market.max !== "" &&
            Number.isFinite(Number(market.min)) &&
            Number.isFinite(Number(market.max))
    );

    const minimum = validMarkets.length
        ? Math.min(...validMarkets.map((market) => Number(market.min)))
        : Number(product.today || 0);

    const maximum = validMarkets.length
        ? Math.max(...validMarkets.map((market) => Number(market.max)))
        : Number(product.today || 0);

    const average = validMarkets.length
        ? Math.round(
            validMarkets.reduce(
                (sum, market) =>
                    sum +
                    (Number(market.min) + Number(market.max)) / 2,
                0
            ) / validMarkets.length
        )
        : Number(product.today || 0);

    const changeDir = product.change?.dir;
    const changePct = Math.abs(Number(product.change?.pct || 0));

    const bn = (value) => toBanglaNumber(Number(value || 0));
    const unitLabel = getUnitLabel(product.unit);
    const productIcon =
        product.image || product.categoryIcon || "🛒";

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <Link
                    href="/"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-green-700 transition hover:text-green-800"
                >
                    ← সব পণ্যে ফিরে যান
                </Link>

                {/* Product Header */}
                <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-6xl">
                            {productIcon}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="mb-3 flex flex-wrap gap-2">
                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                    {product.categoryNameBn ||
                                        product.category ||
                                        "অন্যান্য"}
                                </span>

                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                                    প্রতি {unitLabel}
                                </span>
                            </div>

                            <h1 className="break-words text-2xl font-bold text-gray-900 sm:text-4xl">
                                {product.nameBn || product.name || "পণ্যের নাম"}
                            </h1>

                            <p className="mt-2 text-gray-500">
                                আজকের বাজারদর ও বিভিন্ন বাজারের মূল্য
                            </p>
                        </div>

                        <div className="rounded-2xl bg-gray-50 p-4 sm:min-w-44 sm:bg-transparent sm:p-0 sm:text-right">
                            <p className="text-sm text-gray-500">
                                আজকের দাম
                            </p>

                            <p className="mt-1 text-3xl font-bold text-gray-900">
                                {bn(product.today)} টাকা
                            </p>

                            {changeDir === "up" && (
                                <span className="mt-2 inline-block rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-600">
                                    ▲ {bn(changePct)}%
                                </span>
                            )}

                            {changeDir === "down" && (
                                <span className="mt-2 inline-block rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
                                    ▼ {bn(changePct)}%
                                </span>
                            )}

                            {(!changeDir || changeDir === "flat") && (
                                <span className="mt-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-500">
                                    — অপরিবর্তিত
                                </span>
                            )}
                        </div>
                    </div>
                </section>

                {/* Price Statistics */}
                <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                        <p className="text-sm text-gray-500">
                            সর্বনিম্ন দাম
                        </p>
                        <p className="mt-3 text-2xl font-bold text-green-600">
                            {bn(minimum)} টাকা
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                        <p className="text-sm text-gray-500">
                            সর্বোচ্চ দাম
                        </p>
                        <p className="mt-3 text-2xl font-bold text-red-500">
                            {bn(maximum)} টাকা
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                        <p className="text-sm text-gray-500">
                            বাজারের আনুমানিক গড় দাম
                        </p>
                        <p className="mt-3 text-2xl font-bold text-gray-900">
                            {bn(average)} টাকা
                        </p>
                    </div>
                </section>

                {/* Market Prices */}
                <section className="mt-10">
                    <div className="mb-5">
                        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                            বাজারভিত্তিক আজকের দাম
                        </h2>

                        <p className="mt-1 text-gray-500">
                            বিভিন্ন বাজারে {product.nameBn || product.name} এর মূল্য
                        </p>
                    </div>

                    {validMarkets.length === 0 ? (
                        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
                            <div className="text-4xl">🏪</div>
                            <p className="mt-3 font-semibold text-gray-700">
                                বাজারভিত্তিক তথ্য পাওয়া যায়নি।
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {validMarkets.map((market, index) => (
                                <article
                                    key={`${market.market || "market"}-${index}`}
                                    className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <h3 className="break-words font-bold text-gray-900">
                                                {market.market || "স্থানীয় বাজার"}
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-500">
                                                {market.division || "বাংলাদেশ"}
                                            </p>
                                        </div>

                                        <span className="shrink-0 text-2xl">
                                            {product.categoryIcon || "🏪"}
                                        </span>
                                    </div>

                                    <div className="mt-5 grid grid-cols-2 gap-3">
                                        <div className="rounded-xl bg-green-50 p-3">
                                            <p className="text-xs text-gray-500">
                                                সর্বনিম্ন
                                            </p>
                                            <p className="mt-1 break-words text-sm font-bold text-green-700 sm:text-base">
                                                {bn(market.min)} টাকা
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-red-50 p-3">
                                            <p className="text-xs text-gray-500">
                                                সর্বোচ্চ
                                            </p>
                                            <p className="mt-1 break-words text-sm font-bold text-red-600 sm:text-base">
                                                {bn(market.max)} টাকা
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <p className="mt-8 text-center text-xs text-gray-400">
                    বাজারদর স্থান ও সময় অনুযায়ী পরিবর্তিত হতে পারে।
                </p>
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



