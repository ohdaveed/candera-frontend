import seashell from "../assets/seashell-garden.jpg";
import meadowlight from "../assets/meadowlight-botanical.jpg";
import crimson from "../assets/crimson-noir.jpg";
import everAfter from "../assets/ever-after-glow.jpg";
import anyasEyes from "../assets/anyas-eyes.jpg";
import scarletBloom from "../assets/scarlet-bloom.jpg";

export const imageMap = {
  "seashell-garden-glow": seashell,
  "meadowlight-botanical": meadowlight,
  "crimson-noir": crimson,
  "ever-after-glow": everAfter,
  "anyas-eyes": anyasEyes,
  "scarlet-bloom": scarletBloom,
};

export function getImage(slug) {
  return imageMap[slug] ?? null;
}
