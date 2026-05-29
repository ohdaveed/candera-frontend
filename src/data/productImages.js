export const imageMap = {
  "seashell-garden-glow": "/images/seashell-garden.jpg",
  "meadowlight-botanical": "/images/meadowlight-botanical.jpg",
  "crimson-noir": "/images/crimson-noir.jpg",
  "ever-after-glow": "/images/ever-after-glow.jpg",
  "anyas-eyes": "/images/anyas-eyes.jpg",
  "scarlet-bloom": "/images/scarlet-bloom.jpg",
};

export function getImage(slug) {
  return imageMap[slug] ?? null;
}
