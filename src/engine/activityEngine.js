export function getActivityLevel(repos) {
  if (repos > 80) return "Very High";
  if (repos > 40) return "High";
  if (repos > 15) return "Moderate";
  return "Growing";
}
