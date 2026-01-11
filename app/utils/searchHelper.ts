import { Product } from "../types";

/**
 * Calculates a match score for a product based on a query.
 * Higher score means better match.
 */
const getMatchScore = (product: Product, queryTokens: string[]): number => {
  let score = 0;

  // Safely default arrays to empty
  const colors = Array.isArray(product.colors) ? product.colors : [];
  const occasions = Array.isArray(product.occasions) ? product.occasions : [];
  const tags = Array.isArray(product.tags) ? product.tags : [];

  const searchableText = [
    product.name ?? "",
    product.category?.title ?? "",
    product.material ?? "",
    ...colors,
    ...occasions,
    ...tags,
  ]
    .join(" ")
    .toLowerCase();

  for (const token of queryTokens) {
    if (product.name?.toLowerCase().includes(token)) score += 10; // High priority for name
    if (product.category?.title.toLowerCase().includes(token)) score += 5; // Medium for category
    if (searchableText.includes(token)) score += 2; // Low for other fields
  }

  return score;
};

export const searchProducts = (
  products: Product[],
  query: string
): Product[] => {
  if (!query || query.trim() === "") return [];

  const normalizedQuery = query.toLowerCase().trim();
  const tokens = normalizedQuery.split(/\s+/);

  // Filter and map to score
  const scoredProducts = products.map((product) => ({
    product,
    score: getMatchScore(product, tokens),
  }));

  // Return items with score > 0, sorted by score descending
  return scoredProducts
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.product);
};

/**
 * Split text by search query tokens for highlighting in React
 */
export const highlightText = (text: string, highlight: string) => {
  if (!highlight.trim()) return text;
  const regex = new RegExp(
    `(${highlight.trim().split(/\s+/).join("|")})`,
    "gi"
  );
  const parts = text.split(regex);
  return parts;
};
