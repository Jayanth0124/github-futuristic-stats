import { fetchUser } from "../../src/github/fetchUser.js"; 
import { getDevLevel } from "../../src/engine/devLevel.js";
import { detectSpecialty } from "../../src/engine/specialty.js";
import { generateSummary } from "../../src/engine/profileSummary.js";
import { getCache, setCache } from "../../src/utils/cache.js";
import { renderCard } from "../../src/renderer/cardRenderer.js";

export default async function handler(req, res) {
  const username = req.query.user || "Jayanth0124";
  
  // 1. GET THEME FROM LINK (Default to 'platinum')
  const theme = req.query.theme || req.query.color || "platinum";

  // 2. CHECK CACHE (Include theme in cache key so different themes cache separately!)
  const cacheKey = `${username}-${theme}`;
  const cached = getCache(cacheKey);
  if (cached) {
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=1800"); // 30 min browser cache
    return res.send(cached);
  }

  try {
    // 3. FETCH REAL DATA
    const {
      user,
      stars,
      totalCommits,
      streak,
      languages,
      experience // Ensure fetchUser returns this or calculate it
    } = await fetchUser(username);

    // Calculate derived stats
    // Note: Ensure fetchUser returns 'public_repos' inside 'user' object or adjust accordingly
    const level = getDevLevel(user.public_repos, stars, experience);
    const specialty = detectSpecialty(languages);
    
    // 4. RENDER WITH THEME
    const svg = renderCard({
      name: user.name || user.login,
      avatar: user.avatar_url,
      level,
      specialty,
      totalCommits,
      stars,
      streak,
      languages,
    }, theme); // Pass theme here

    // 5. SAVE TO CACHE
    setCache(cacheKey, svg);

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=1800");
    res.send(svg);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating card");
  }
}