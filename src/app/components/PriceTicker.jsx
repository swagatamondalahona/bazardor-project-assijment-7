"use client";

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

export default function PriceTicker() {
    return (
        <div className="price-ticker-wrapper">
            <div className="price-ticker-track">
                {prices.map((item, index) => (
                    <div
                        key={`${item.name}-${index}`}
                        className="price-item"
                    >
                        <span className="price-icon">
                            {item.icon}
                        </span>

                        <span className="price-name">
                            {item.name}
                        </span>

                        <span className="price-value">
                            {item.price}
                        </span>

                        {item.direction === "up" ? (
                            <span className="price-up">
                                ▲ {item.change}
                            </span>
                        ) : (
                            <span className="price-down">
                                ▼ {item.change}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}