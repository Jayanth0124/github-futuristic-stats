import { fetchUser } from '../../src/github/fetchUser';
import { detectSpecialty } from '../../src/engine/specialty';
import { getDevLevel } from '../../src/engine/devLevel';
import { renderCard } from '../../src/renderer/cardRenderer';

export default async function handler(req, res) {
  try {
    // 1. Added "text" to the query parameters
    const { username, theme = 'platinum', text } = req.query;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const githubData = await fetchUser(username);
    const specialty = detectSpecialty(githubData.languages);
    const level = getDevLevel(
      githubData.user.public_repos,
      githubData.stars,
      githubData.experience
    );

    // 2. Fallback logic: Use the provided text, OR the first 2 letters of the username
    const centerText = text || username.substring(0, 2).toUpperCase();

    const renderData = {
      name: githubData.user.name || username,
      level: level,
      specialty: specialty,
      centerText: centerText, // Pass the text to the renderer
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