"use client";

import { useSession, signOut } from "@/lib/auth-client";
import Image from "next/image";
import { LogOut, UserRound, Mail } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    const { data: session, isPending } = useSession();

    const handleSignOut = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    window.location.href = "/";
                },
            },
        });
    };

    if (isPending) {
        return (<main className="flex min-h-[60vh] items-center justify-center"> <p className="text-gray-500">লোড হচ্ছে...</p> </main>
        );
    }

    if (!session?.user) {
        return (<main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center"> <UserRound className="mb-4 h-12 w-12 text-gray-400" />


            <h1 className="text-2xl font-bold text-gray-800">
                লগইন করা নেই
            </h1>

            <p className="mt-2 text-gray-600">
                প্রোফাইল দেখতে অনুগ্রহ করে লগইন করুন।
            </p>

            <Link
                href="/signin"
                className="mt-5 rounded-lg bg-emerald-600 px-6 py-2.5 text-white transition hover:bg-emerald-700"
            >
                লগইন করো
            </Link>
        </main>
        );

    }

    return (<main className="mx-auto min-h-[70vh] max-w-3xl px-4 py-10"> <div className="mb-8"> <h1 className="text-3xl font-bold text-gray-900">
        আমার প্রোফাইল </h1>

        ```
        <p className="mt-2 text-sm text-gray-500">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখতে পারবেন।
        </p>
    </div>

        <div className="space-y-6">
            {/* User Profile Card */}
            <section className="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="flex min-w-0 items-center gap-4">
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-xl font-bold text-emerald-700">
                        {session.user.image ? (
                            <Image
                                src={session.user.image}
                                alt={session.user.name || "User Avatar"}
                                fill
                                sizes="64px"
                                className="object-cover"
                            />
                        ) : (
                            session.user.name?.charAt(0)?.toUpperCase() || "U"
                        )}
                    </div>

                    <div className="min-w-0">
                        <h2 className="truncate text-lg font-semibold text-gray-900">
                            {session.user.name || "ব্যবহারকারী"}
                        </h2>

                        <p className="break-all text-sm text-gray-500">
                            {session.user.email}
                        </p>

                        <span className="mt-2 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                            সক্রিয় অ্যাকাউন্ট
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex shrink-0 items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                    <LogOut className="h-4 w-4" />
                    সাইন আউট
                </button>
            </section>

            {/* Account Information */}
            <section className="space-y-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900">
                    অ্যাকাউন্টের তথ্য
                </h3>

                <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-600">
                        <UserRound className="h-4 w-4" />
                        নাম
                    </label>

                    <input
                        type="text"
                        readOnly
                        value={session.user.name || ""}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none"
                    />
                </div>

                <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-600">
                        <Mail className="h-4 w-4" />
                        ইমেইল
                    </label>

                    <input
                        type="email"
                        readOnly
                        value={session.user.email || ""}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none"
                    />
                </div>
            </section>
        </div>
    </main>


    );
}
