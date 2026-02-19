export function getDevLevel(repos, stars, experience) {
  const score = repos + stars + experience * 5;

  if (score > 800) return "Legendary Architect";
  if (score > 400) return "Elite Builder";
  if (score > 200) return "Advanced Developer";
  if (score > 80) return "Rising Engineer";
  return "Beginner Builder";
}
