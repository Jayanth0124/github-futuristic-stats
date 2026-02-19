import { fetchUser } from '../../src/github/fetchUser';
import { detectSpecialty } from '../../src/engine/specialty';
import { getDevLevel } from '../../src/engine/devLevel';
import { renderCard } from '../../src/renderer/cardRenderer';

// 1. Bulletproof Base64 Image Fetcher
async function getBase64Image(url) {
  try {
    // Append size parameter to force a small 120px image. 
    // This keeps the Base64 string very small and prevents GitHub Camo from blocking it.
    const sizeUrl = url.includes('?') ? `${url}&s=120` : `${url}?s=120`;
    
    const response = await fetch(sizeUrl, {
      headers: {
        // Prevents GitHub from blocking the automated Vercel request
        "User-Agent": "GitHub-Stats-Renderer" 
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = response.headers.get('content-type') || 'image/jpeg';
    
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error("Base64 Image Error:", error);
    // Fallback: A transparent 1x1 pixel so it doesn't show a broken "X" icon if it fails
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  }
}

export default async function handler(req, res) {
  try {
    const { username, theme = 'platinum' } = req.query;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const githubData = await fetchUser(username);

    // 2. Get the optimized Base64 Avatar
    const base64Avatar = await getBase64Image(githubData.user.avatar_url);

    const specialty = detectSpecialty(githubData.languages);
    const level = getDevLevel(
      githubData.user.public_repos,
      githubData.stars,
      githubData.experience
    );

    const renderData = {
      name: githubData.user.name || username,
      level: level,
      specialty: specialty,
      avatar: base64Avatar, // 3. Inject the clean Base64 string
      totalCommits: githubData.totalCommits || 0,
      stars: githubData.stars || 0,
      streak: githubData.streak || 0,
      languages: githubData.languages || {}
    };

    const svg = renderCard(renderData, theme);

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=1800, stale-while-revalidate=86400');
    
    res.status(200).send(svg);

  } catch (error) {
    console.error('Error generating card:', error);
    res.status(500).json({ error: 'Failed to generate profile stats card.' });
  }
}