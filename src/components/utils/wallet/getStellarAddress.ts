export const getStellarAddress = (): string | null => {
  if (typeof window === "undefined") return null;

  const item = localStorage.getItem("address-wallet");
  if (!item) return null;

  try {
    const parsed = JSON.parse(item);
    return parsed.state?.address ?? null;
  } catch (err) {
    console.error("❌ Error parsing wallet address:", err);
    return null;
  }
};
