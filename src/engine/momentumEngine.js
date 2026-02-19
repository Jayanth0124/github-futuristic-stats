export function getMomentum(followers) {
  if (followers > 200) return "Explosive Growth";
  if (followers > 100) return "Accelerating";
  if (followers > 30) return "Rising Fast";
  return "Building Momentum";
}
