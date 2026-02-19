<div align="center">
  <img width="140" src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"  alt="GitHub Profile Stats Renderer"/>
  <h2 align="center">GitHub Profile Stats Renderer</h2>
  <p align="center">⚡ Add dynamically generated, futuristic Developer Stat Cards to your README</p>
</div>

<div align="center">

[![stargazers](https://img.shields.io/github/stars/yourusername/github-profile-renderer)](https://github.com/yourusername/github-profile-renderer/stargazers)
[![forks](https://img.shields.io/github/forks/yourusername/github-profile-renderer)](https://github.com/yourusername/github-profile-renderer/network/members)
[![issues](https://img.shields.io/github/issues/yourusername/github-profile-renderer)](https://github.com/yourusername/github-profile-renderer/issues)
[![license](https://img.shields.io/github/license/yourusername/github-profile-renderer)](https://github.com/yourusername/github-profile-renderer/blob/master/LICENSE)

</div>

<p align="center">
  You can use this service for free. I'm looking for sponsors to help us keep up with this service ❤️
</p>
<div align="center">
  <a href="https://github.com/sponsors/yourusername">
    <img src="https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=ff69b4" alt="Sponsor"/>
  </a>
</div>

> ⚠️ **Notice for High Traffic**
> 
> Due to GitHub API rate limits, please consider self-hosting this project on Vercel or Netlify if you expect high traffic on your repository. The built-in caching engine handles standard loads, but deploying your own instance ensures 100% uptime.

# Quick Start

Add the following code to your GitHub profile README.md. Change the ?username= value to your actual GitHub username.

[![DevStats](https://your-vercel-app-url.vercel.app/api?username=yourusername)](https://github.com/yourusername/github-profile-renderer)

<p align="center">
  <img src="https://via.placeholder.com/800x450.png?text=Platinum+Theme+Preview" alt="Preview" />
</p>

## Use Theme

Add the optional &theme= parameter to customize the aesthetic of your card.

[![DevStats](https://your-vercel-app-url.vercel.app/api?username=yourusername&theme=matrix)](https://github.com/yourusername/github-profile-renderer)

---

# About Archetypes (Levels)

Your developer "Archetype" is calculated dynamically based on your repository count, total stars, and years of experience on GitHub. 

| Archetype             | Requirement (Score) | Description                                                               |
| --------------------- | ------------------- | ------------------------------------------------------------------------- |
| **Legendary Architect**| `Score > 800`     | You have reached the pinnacle of open-source influence. Bragging rights!  |
| **Elite Builder** | `Score > 400`     | A highly impactful developer with a strong and established ecosystem.     |
| **Advanced Developer** | `Score > 200`     | You are consistently shipping solid projects and gaining traction.        |
| **Rising Engineer** | `Score > 80`      | Making great progress. Keep building and growing your network!            |
| **Beginner Builder** | `< 80`            | You've begun your journey. Every great architect starts here.             |

---

# About Specialties

Our system scans the languages used across all your repositories and automatically assigns you a core specialty.

| Detected Specialty        | Keywords / Languages Triggered                            |
| ------------------------- | --------------------------------------------------------- |
| **AI / Machine Learning** | `python`, `tensorflow`, `pytorch`, `opencv`, `numpy`      |
| **Web Development** | `javascript`, `typescript`, `html`, `css`, `react`, `node`|
| **Embedded / IoT** | `c`, `cpp`, `arduino`, `embedded`                         |
| **Mobile Development** | `kotlin`, `swift`, `flutter`, `dart`                      |
| **DevOps & Automation** | `docker`, `bash`, `linux`, `yaml`                         |
| **Software Development** | *(Default fallback for mixed or general languages)* |

---

# About Display Details

Your rendered SVG card contains highly detailed metrics converted into a futuristic UI:

1. **ARCHITECT:** Your GitHub Display Name.
2. **TOTAL OUTPUT (TERAWATTS):** Scaled calculation of your total GitHub commits.
3. **STABILITY:** Calculated based on your commit streak percentage (max 100%).
4. **GRID INFLUENCE (NEURAL LINKS):** A scaled metric based on your total GitHub stars.
5. **ARCHETYPE:** Your calculated developer level.
6. **SPECIALTY:** Your dynamically detected domain.
7. **LANGUAGE RINGS:** An animated SVG radial chart showing your top 5 languages.

---

# Optional Request Parameters

You can customize your generated SVG by appending these parameters to your URL.

## Apply Theme

We offer multiple highly curated themes to match your GitHub profile's aesthetic. Pass the theme name via `&theme=THEME_NAME`.

| Theme Name   | Description                   |
| ------------ | ----------------------------- |
| `platinum`   | Original Luxury Gold (Default)|
| `bluelish`   | Cyber Future Blue             |
| `dracula`    | Vampire Pink & Purple         |
| `gruvbox`    | Retro Orange & Yellow         |
| `tokyonight` | Modern Dark Blue & Cyan       |
| `matrix`     | Hacker Terminal Green         |
| `monokai`    | Vibrant Code Editor Colors    |

### Platinum (Default)
https://your-vercel-app-url.vercel.app/api?username=yourusername&theme=platinum

### Tokyo Night
https://your-vercel-app-url.vercel.app/api?username=yourusername&theme=tokyonight

### Matrix
https://your-vercel-app-url.vercel.app/api?username=yourusername&theme=matrix

## Card Types

You can toggle between the highly detailed dashboard card or a smaller, simpler "Holographic ID" card.

https://your-vercel-app-url.vercel.app/api?username=yourusername&type=holographic

---

