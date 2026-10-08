"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, signUp } from "@/lib/auth-client";

export default function SignupPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setLoading(true);

        try {
            const { data, error } = await signUp.email({
                name,
                email,
                password,
            });

            if (error) {
                setError(error.message || "Signup failed.");
                return;
            }

            if (data) {
                router.push("/signin");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        setError("");
        setSocialLoading(provider);

        try {
            await signIn.social({
                provider,
                callbackURL: "/",
            });
        } catch (err) {
            setError("Social login failed. Please try again.");
            setSocialLoading("");
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-600 text-white text-3xl shadow-lg mb-4">
                        🛒
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900">
                        Create Account
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Create your account and get started
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-7">

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Full Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setError("");
                                }}
                                required
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>

                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("");
                                }}
                                required
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="Minimum 8 characters"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError("");
                                }}
                                required
                                minLength={8}
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                                <p className="text-sm text-red-600">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Signup button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-green-600 px-4 py-3.5 font-semibold text-white shadow-md hover:bg-green-700 disabled:opacity-60"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-7">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>

                        <div className="relative flex justify-center">
                            <span className="bg-white px-4 text-sm text-gray-400">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    {/* Google */}
                    <button
                        type="button"
                        onClick={() => handleSocialLogin("google")}
                        disabled={socialLoading !== ""}
                        className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-200 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                    >
                        <span>G</span>

                        {socialLoading === "google"
                            ? "Connecting..."
                            : "Continue with Google"}
                    </button>

                    {/* GitHub */}
                    <button
                        type="button"
                        onClick={() => handleSocialLogin("github")}
                        disabled={socialLoading !== ""}
                        className="w-full mt-3 flex items-center justify-center gap-3 rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white hover:bg-black disabled:opacity-60"
                    >
                        <span>●</span>

                        {socialLoading === "github"
                            ? "Connecting..."
                            : "Continue with GitHub"}
                    </button>

                    {/* Login */}
                    <p className="text-center text-sm text-gray-500 mt-7">
                        Already have an account?{" "}
                        <Link
                            href="/signin"
                            className="font-semibold text-green-600 hover:text-green-700"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
