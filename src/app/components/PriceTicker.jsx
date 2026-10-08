"use client";

import styles from "./PriceTicker.module.css";

const prices = [
    {
        name: "চাল (মিনিকেট)",
        price: "৬৫ টাকা/কেজি",
        change: "২.৭%",
        direction: "up",
        icon: "🍚",
    },
    {
        name: "তেল (সয়াবিন)",
        price: "১৭৫ টাকা/লিটার",
        change: "১.২%",
        direction: "up",
        icon: "🫙",
    },
    {
        name: "পেঁয়াজ",
        price: "৪০ টাকা/কেজি",
        change: "০.৯%",
        direction: "down",
        icon: "🧅",
    },
    {
        name: "টমেটো",
        price: "৩০ টাকা/কেজি",
        change: "৮.৬%",
        direction: "up",
        icon: "🍅",
    },
    {
        name: "আলু",
        price: "২৫ টাকা/কেজি",
        change: "১.৮%",
        direction: "down",
        icon: "🥔",
    },
];

function PriceItems() {
    return (
        <div className="flex shrink-0 items-center">
            {prices.map((item, index) => (
                <div
                    key={`${item.name}-${index}`}
                    className="flex shrink-0 items-center gap-2 border-r border-gray-200 px-6 py-3 text-xs sm:px-8 sm:text-sm"
                >
                    <span className="text-lg">
                        {item.icon}
                    </span>

                    <span className="font-semibold text-gray-800">
                        {item.name}
                    </span>

                    <span className="text-gray-600">
                        {item.price}
                    </span>

                    {item.direction === "up" ? (
                        <span className="font-semibold text-green-600">
                            ▲ {item.change}
                        </span>
                    ) : (
                        <span className="font-semibold text-red-500">
                            ▼ {item.change}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}

export default function PriceTicker() {
    return (
        <div className="w-full overflow-hidden border-b border-gray-200 bg-[#f0faf6]">
            <div className={styles.ticker}>
                <PriceItems />
            </div>
        </div>
    );
}