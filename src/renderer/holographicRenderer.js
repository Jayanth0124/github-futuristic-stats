export function renderCard(data, theme) {
  return `
  <svg width="460" height="240" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" rx="20" fill="${theme.bg}" />
    
    <text x="20" y="40" fill="${theme.primary}" font-size="20">
      DEV HOLOGRAPHIC ID
    </text>

    <image href="${data.avatar}" x="360" y="20" width="70" height="70" />

    <text x="20" y="90" fill="${theme.text}">
      🧠 Builder: ${data.builder}
    </text>

    <text x="20" y="115" fill="${theme.text}">
      ⚡ Momentum: ${data.momentum}
    </text>

    <text x="20" y="140" fill="${theme.text}">
      🏆 Level: ${data.level}
    </text>

    <text x="20" y="165" fill="${theme.text}">
      ⭐ Stars: ${data.stars}
    </text>

    <text x="20" y="190" fill="${theme.text}">
      👥 Followers: ${data.followers}
    </text>
  </svg>
  `;
}
