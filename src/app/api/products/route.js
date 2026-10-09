
import { NextResponse } from "next/server";
import { connection } from "next/server";

const API_URL =
    "https://api.api-store.workers.dev/api/bazardor/products";

export async function GET(request) {
    await connection();

    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");

        const url = new URL(API_URL);

        if (category) {
            url.searchParams.set("category", category);
        }

        const response = await fetch(url.toString(), {
            cache: "no-store",
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Products API failed" },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error("Products API error:", error);

        return NextResponse.json(
            { error: "Failed to load products" },
            { status: 500 }
        );
    }
}
