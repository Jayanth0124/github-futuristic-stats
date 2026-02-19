import { fetchUser } from '../../src/github/fetchUser';
import { detectSpecialty } from '../../src/engine/specialty';
import { getDevLevel } from '../../src/engine/devLevel';
import { renderCard } from '../../src/renderer/cardRenderer';

// 1. Helper function to fetch the image and convert it to Base64
async function getBase64Image(url) {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const mimeType = response.headers.get('content-type') || 'image/jpeg';
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error("Failed to convert image to Base64:", error);
    return ""; // Fallback empty string if it fails
  }
}

export default async function handler(req, res) {
  try {
    const { username, theme = 'platinum' } = req.query;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const githubData = await fetchUser(username);

    // 2. Convert the avatar URL to a Base64 string before rendering
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
      // 3. Pass the Base64 string to the renderer instead of the URL
      avatar: base64Avatar, 
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