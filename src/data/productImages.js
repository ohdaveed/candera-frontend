import products from "./products.json";

const imageMap = Object.fromEntries(
  products.map((p) => [p.slug, p.image]),
);

export function getImage(slug) {
  return imageMap[slug] ?? null;
}
