
export const formatCurrency = (value) => {
    if (value) return value.toLocaleString({ style: "currency", currency: "THB" });
    return
}