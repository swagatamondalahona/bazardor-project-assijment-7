export const toBanglaNumber = (value) => {
    if (value === null || value === undefined) return "";

    const banglaDigits = "০১২৩৪৫৬৭৮৯";

    return String(value).replace(/\d/g, (digit) => {
        return banglaDigits[digit];
    });
};

export const getProductSlug = (product) => {
    if (product.slug) return product.slug;

    return String(product.nameBn || product.name || "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");
};