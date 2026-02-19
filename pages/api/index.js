import { fetchUser } from '../../src/github/fetchUser';
import { detectSpecialty } from '../../src/engine/specialty';
import { getDevLevel } from '../../src/engine/devLevel';
import { renderCard } from '../../src/renderer/cardRenderer';

export default async function handler(req, res) {
  try {
    // 1. Get query parameters from the URL
    const { username, theme = 'platinum' } = req.query;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // 2. Fetch the user data from GitHub
    const githubData = await fetchUser(username);

    // 3. Process the data through your engines
    const specialty = detectSpecialty(githubData.languages);
    const level = getDevLevel(
      githubData.user.public_repos,
      githubData.stars,
      githubData.experience
    );

    // 4. Prepare the data payload for the renderer
    const renderData = {
      name: githubData.user.name || username,
      level: level,
      specialty: specialty,
      avatar: githubData.user.avatar_url,
      totalCommits: githubData.totalCommits || 0,
      stars: githubData.stars || 0,
      streak: githubData.streak || 0,
      languages: githubData.languages || {}
    };

    // 5. Generate the SVG string
    const svg = renderCard(renderData, theme);

    // 6. Set the headers so the browser knows it's an SVG image
    res.setHeader('Content-Type', 'image/svg+xml');
    
    // Optional: Add caching headers to prevent hitting GitHub API limits
    res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=1800, stale-while-revalidate=86400');

    // 7. Send the SVG!
    res.status(200).send(svg);

  } catch (error) {
    console.error('Error generating card:', error);
    res.status(500).json({ error: 'Failed to generate profile stats card.' });
  }
}