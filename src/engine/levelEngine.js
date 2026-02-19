export function getLevel(score) {
  if (score > 800) return "Legendary Architect";
  if (score > 400) return "Elite Builder";
  if (score > 150) return "Advanced Developer";
  if (score > 50) return "Rising Creator";
  return "Beginner Builder";
}
