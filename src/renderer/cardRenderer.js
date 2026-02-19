// --- 1. THEME DEFINITIONS ---
const themes = {
  // 1. ORIGINAL LUXURY (Default)
  platinum: {
    bgGrad: ["#141414", "#000000"],
    accent: "#D4AF37", // Gold
    accentGrad: ["#BF953F", "#FCF6BA", "#B38728"],
    textMain: "#ffffff",
    textSub: "#888888",
    ringColors: ["#D4AF37", "#E5E4E2", "#B76E79", "#CD7F32", "#C0C0C0"],
    grid: "#222222"
  },
  // 2. BLUELISH (Cyber Future)
  bluelish: {
    bgGrad: ["#0f172a", "#020617"],
    accent: "#38bdf8",
    accentGrad: ["#38bdf8", "#818cf8", "#22d3ee"],
    textMain: "#e2e8f0",
    textSub: "#64748b",
    ringColors: ["#38bdf8", "#818cf8", "#c084fc", "#2dd4bf", "#60a5fa"],
    grid: "#1e293b"
  },
  // 3. DRACULA (Vampire)
  dracula: {
    bgGrad: ["#282a36", "#1e1f29"],
    accent: "#ff79c6",
    accentGrad: ["#ff79c6", "#bd93f9", "#ff79c6"],
    textMain: "#f8f8f2",
    textSub: "#6272a4",
    ringColors: ["#ff79c6", "#bd93f9", "#8be9fd", "#50fa7b", "#ffb86c"],
    grid: "#44475a"
  },
  // 4. GRUVBOX (Retro)
  gruvbox: {
    bgGrad: ["#282828", "#1d2021"],
    accent: "#fabd2f",
    accentGrad: ["#fabd2f", "#fe8019", "#fabd2f"],
    textMain: "#ebdbb2",
    textSub: "#a89984",
    ringColors: ["#fabd2f", "#fe8019", "#b8bb26", "#8ec07c", "#d3869b"],
    grid: "#3c3836"
  },
  // 5. TOKYO NIGHT (Modern Dark)
  tokyonight: {
    bgGrad: ["#1a1b26", "#16161e"],
    accent: "#7aa2f7", // Blue
    accentGrad: ["#7aa2f7", "#bb9af7", "#7dcfff"], // Blue/Purple/Cyan
    textMain: "#c0caf5",
    textSub: "#565f89",
    ringColors: ["#7aa2f7", "#bb9af7", "#7dcfff", "#9ece6a", "#e0af68"],
    grid: "#292e42"
  },
  // 6. MATRIX (Hacker)
  matrix: {
    bgGrad: ["#000000", "#0d0208"], // Deepest Black
    accent: "#00ff41", // Matrix Green
    accentGrad: ["#008F11", "#00ff41", "#003b00"],
    textMain: "#00ff41",
    textSub: "#008F11",
    ringColors: ["#00ff41", "#008F11", "#003b00", "#005c00", "#00ff00"],
    grid: "#003b00"
  },
  // 7. MONOKAI (Vibrant Code)
  monokai: {
    bgGrad: ["#272822", "#1e1f1c"],
    accent: "#a6e22e", // Green
    accentGrad: ["#a6e22e", "#f92672", "#66d9ef"], // Green/Pink/Blue
    textMain: "#f8f8f2",
    textSub: "#75715e",
    ringColors: ["#a6e22e", "#f92672", "#66d9ef", "#fd971f", "#ae81ff"],
    grid: "#3e3d32"
  }
};

// --- HELPER: Safe XML Escaping ---
function escapeHTML(str) {
  if (!str) return "UNKNOWN";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// --- MAIN RENDER FUNCTION ---
export function renderCard(data, themeName = "platinum") {
  // 1. Select Theme (Default to platinum if invalid)
  const theme = themes[themeName.toLowerCase()] || themes.platinum;

  // 2. Data Preparation
  const safe = escapeHTML;
  const user = {
    name: safe(data.name.toUpperCase()),
    level: safe(data.level.toUpperCase()),
    specialty: safe(data.specialty.toUpperCase()),
    // Changed: Grabs the centerText instead of avatar
    centerText: safe((data.centerText || 'DEV').substring(0, 3).toUpperCase()), 
    commits: (data.totalCommits * 1.5).toLocaleString(),
    stars: (data.stars * 850).toLocaleString(),
    stability: Math.min(100, (data.streak / 365) * 100).toFixed(1),
  };

  // 3. Layout Constants
  const width = 800;
  const height = 450;
  const center = { x: width / 2, y: height / 2 };
  const radius = 115;

  // 4. Ring Math
  const langs = Object.entries(data.languages || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const totalVal = langs.reduce((acc, curr) => acc + curr[1], 0);
  let currentAngle = -90;

  const ringElements = langs
    .map(([lang, val], i) => {
      const percent = val / totalVal;
      const degrees = percent * 360;
      const endAngle = currentAngle + degrees;

      // Geometry
      const toRad = (deg) => (deg * Math.PI) / 180;
      const x1 = center.x + radius * Math.cos(toRad(currentAngle));
      const y1 = center.y + radius * Math.sin(toRad(currentAngle));
      const x2 = center.x + radius * Math.cos(toRad(endAngle));
      const y2 = center.y + radius * Math.sin(toRad(endAngle));

      const largeArc = degrees > 180 ? 1 : 0;

      // Use theme ring colors
      const color = theme.ringColors[i % theme.ringColors.length];

      const d = `M ${center.x} ${center.y} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      currentAngle = endAngle;

      return `
      <g>
        <path d="${d}" fill="none" stroke="${color}" stroke-width="1" stroke-dasharray="4 4" opacity="0.3">
           <animate attributeName="stroke-dashoffset" from="100" to="0" dur="${40 + i * 10}s" repeatCount="indefinite" />
        </path>
        <path d="${d}" fill="none" stroke="${color}" stroke-width="20" stroke-dasharray="${radius * 2 * Math.PI}" stroke-dashoffset="${radius * 2 * Math.PI * (1 - percent)}" transform="rotate(3, ${center.x}, ${center.y})">
           <title>${safe(lang)}: ${Math.round(percent * 100)}%</title>
        </path>
        <text x="${x2 + (x2 > center.x ? 25 : -25)}" y="${y2 + (y2 > center.y ? 15 : -15)}" fill="${color}" font-size="10" font-family="'Cinzel', serif" font-weight="bold" text-anchor="middle">
          ${safe(lang.toUpperCase())}
        </text>
      </g>
    `;
    })
    .join("");

  // 5. Build Gradient Strings
  const accentGradStops = theme.accentGrad
    .map((c, i, arr) => {
      const offset = Math.round((i / (arr.length - 1)) * 100);
      return `<stop offset="${offset}%" style="stop-color:${c};stop-opacity:1" />`;
    })
    .join("");

  // --- 6. FINAL SVG ---
  return `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&amp;family=Montserrat:wght@300;500;700&amp;display=swap');
      </style>

      <radialGradient id="bgGrad" cx="50%" cy="50%" r="90%" fx="50%" fy="50%">
        <stop offset="0%" style="stop-color:${theme.bgGrad[0]};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${theme.bgGrad[1]};stop-opacity:1" />
      </radialGradient>

      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        ${accentGradStops}
      </linearGradient>
      
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${theme.grid}" stroke-width="0.5"/>
      </pattern>
    </defs>

    <rect width="${width}" height="${height}" rx="4" fill="url(#bgGrad)" stroke="#333" stroke-width="1"/>
    <rect width="${width}" height="${height}" fill="url(#grid)" opacity="0.6"/>
    
    <path d="M60 60 L160 60 L180 90" fill="none" stroke="url(#accentGrad)" stroke-width="1.5" opacity="0.9"/>
    <path d="M740 400 L640 400 L620 370" fill="none" stroke="url(#accentGrad)" stroke-width="1.5" opacity="0.9"/>
    
    <text x="60" y="50" fill="${theme.textSub}" font-family="'Cinzel', serif" font-size="10" letter-spacing="2">ARCHITECT: ${user.name}</text>
    <text x="740" y="430" fill="${theme.textSub}" font-family="'Cinzel', serif" font-size="10" letter-spacing="2" text-anchor="end">EDITION: ${themeName.toUpperCase()}</text>

    <g transform="translate(${center.x}, ${center.y})">
      <circle r="150" fill="none" stroke="${theme.grid}" stroke-width="1" />
      <circle r="140" fill="none" stroke="${theme.grid}" stroke-width="1" stroke-dasharray="1 5" />
      <circle r="130" fill="none" stroke="${theme.grid}" stroke-width="1" stroke-dasharray="40 200">
        <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="120s" repeatCount="indefinite"/>
      </circle>
      
      <g transform="translate(-${center.x}, -${center.y})">
        ${ringElements}
      </g>
      
      <circle r="55" fill="none" stroke="url(#accentGrad)" stroke-width="1.5" />
      <circle r="48" fill="${theme.grid}" opacity="0.6"/>
      <text x="0" y="12" fill="${theme.textMain}" font-family="'Montserrat', sans-serif" font-weight="700" font-size="36" text-anchor="middle" letter-spacing="2">
        ${user.centerText}
      </text>
      <circle r="48" fill="url(#accentGrad)" opacity="0.1" />
    </g>

    <g transform="translate(60, 150)">
       <line x1="0" y1="0" x2="0" y2="150" stroke="${theme.accent}" stroke-width="1" />
       
       <text x="15" y="20" fill="${theme.textSub}" font-family="'Cinzel', serif" font-size="10" letter-spacing="1">TOTAL OUTPUT</text>
       <text x="15" y="55" fill="${theme.textMain}" font-family="'Montserrat', sans-serif" font-weight="300" font-size="32">${user.commits}</text>
       <text x="15" y="75" fill="${theme.accent}" font-family="'Cinzel', serif" font-size="10">TERAWATTS</text>
       
       <text x="15" y="115" fill="${theme.textSub}" font-family="'Cinzel', serif" font-size="10" letter-spacing="1">STABILITY</text>
       <text x="15" y="145" fill="${theme.textMain}" font-family="'Montserrat', sans-serif" font-weight="300" font-size="28">${user.stability}%</text>
    </g>

    <g transform="translate(560, 150)">
       <line x1="180" y1="0" x2="180" y2="150" stroke="${theme.accent}" stroke-width="1" />
       
       <text x="170" y="20" fill="${theme.textSub}" font-family="'Cinzel', serif" font-size="10" letter-spacing="1" text-anchor="end">GRID INFLUENCE</text>
       <text x="170" y="55" fill="${theme.textMain}" font-family="'Montserrat', sans-serif" font-weight="300" font-size="32" text-anchor="end">${user.stars}</text>
       <text x="170" y="75" fill="${theme.accent}" font-family="'Cinzel', serif" font-size="10" text-anchor="end">NEURAL LINKS</text>

       <text x="170" y="115" fill="${theme.textSub}" font-family="'Cinzel', serif" font-size="10" letter-spacing="1" text-anchor="end">ARCHETYPE</text>
       <text x="170" y="145" fill="${theme.accent}" font-family="'Montserrat', sans-serif" font-weight="300" font-size="24" text-anchor="end">${user.level}</text>
    </g>

    <rect x="200" y="380" width="400" height="1" fill="${theme.grid}" />
    <text x="400" y="400" fill="${theme.textSub}" font-family="'Montserrat', sans-serif" font-size="10" text-anchor="middle" letter-spacing="2">
       SPECIALTY // ${user.specialty}
    </text>

  </svg>
  `;
}