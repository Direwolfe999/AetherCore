const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/globe.tsx', 'utf8');

code = code.replace(
    'baseColor: threatActive ? [1, 0.2, 0.1] : [0.1, 0.1, 0.1], // Dark gray or Red',
    'baseColor: threatActive ? [1, 0.1, 0.1] : [0.15, 0.2, 0.3], // Dark blue-gray so it is visible'
);

code = code.replace(
    'glowColor: threatActive ? [1, 0.2, 0.1] : [0.1, 0.5, 0.8], // Red or Cyan',
    'glowColor: threatActive ? [1, 0.1, 0.1] : [0.1, 0.6, 0.9], // Cyan glow'
);

code = code.replace(
    'dark: 1,',
    'dark: 0.95,'
)

fs.writeFileSync('src/components/dashboard/globe.tsx', code);
