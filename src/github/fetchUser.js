export async function fetchUser(username) {
  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
  };

  // basic profile
  const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
  const user = await userRes.json();

  // repos
  const repoRes = await fetch(user.repos_url + "?per_page=100", { headers });
  const repos = await repoRes.json();

  const stars = repos.reduce((acc, r) => acc + r.stargazers_count, 0);

  // language detection
  const languages = {};
  repos.forEach(repo => {
    if (repo.language) languages[repo.language] = (languages[repo.language] || 0) + 1;
  });

  const topLanguage =
    Object.entries(languages).sort((a,b)=>b[1]-a[1])[0]?.[0] || "N/A";

  const mostStarred = repos.sort((a,b)=>b.stargazers_count-a.stargazers_count)[0];
  const lastUpdated = repos.sort((a,b)=>new Date(b.updated_at)-new Date(a.updated_at))[0];

  const createdYear = new Date(user.created_at).getFullYear();
  const experience = new Date().getFullYear() - createdYear;

  // GraphQL for contributions & commits
  const query = {
    query: `
    query {
      user(login: "${username}") {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
              }
            }
          }
        }
      }
    }`
  };

  const gql = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers,
    body: JSON.stringify(query)
  });

  const gqlData = await gql.json();

  const weeks = gqlData.data.user.contributionsCollection.contributionCalendar.weeks;

  let totalCommits = 0;
  let streak = 0;
  let currentStreak = 0;

  weeks.forEach(week => {
    week.contributionDays.forEach(day => {
      totalCommits += day.contributionCount;

      if (day.contributionCount > 0) {
        currentStreak++;
        if (currentStreak > streak) streak = currentStreak;
      } else {
        currentStreak = 0;
      }
    });
  });

  return {
    user,
    stars,
    topLanguage,
    mostStarred: mostStarred?.name || "N/A",
    lastUpdated: lastUpdated?.name || "N/A",
    experience,
    totalCommits,
    streak,
    languages
  };
}
