/**
 * ThemeManager.js - Enhanced with weather support and more themes
 */
class ThemeManager {
    static THEMES = {
        default: {
            sky: ['#ff9a9e', '#fecfef'],
            dusk: ['#a18cd1', '#fbc2eb'],
            night: ['#667eea', '#764ba2']
        },
        sunset_bg: {
            sky: ['#ff6b6b', '#feca57'],
            dusk: ['#ff9f43', '#ee5a24'],
            night: ['#c44569', '#cf6a87']
        },
        night_bg: {
            sky: ['#2c3e50', '#4ca1af'],
            dusk: ['#1a1a2e', '#16213e'],
            night: ['#0f0c29', '#302b63']
        },
        galaxy_bg: {
            sky: ['#0f0c29', '#302b63'],
            dusk: ['#24243e', '#0f0c29'],
            night: ['#000000', '#1a1a2e']
        },
        neon_theme: {
            sky: ['#0a0a0a', '#1a1a2e'],
            dusk: ['#1a1a2e', '#16213e'],
            night: ['#000000', '#0a0a0a']
        },
        ocean_theme: {
            sky: ['#667eea', '#64b3f4'],
            dusk: ['#5f27cd', '#3498db'],
            night: ['#0c2461', '#1e3799']
        },
        lava_theme: {
            sky: ['#ff4e50', '#f9d423'],
            dusk: ['#d63031', '#ff7675'],
            night: ['#2d1f1f', '#6b2737']
        },
        sakura_theme: {
            sky: ['#ffb7c5', '#ffdde1'],
            dusk: ['#ff9a9e', '#fecfef'],
            night: ['#d4a5a5', '#c9b1ff']
        },
        aurora_theme: {
            sky: ['#1a1a2e', '#16213e'],
            dusk: ['#0f3460', '#16213e'],
            night: ['#0a0a0a', '#1a1a2e']
        },
        candy_theme: {
            sky: ['#ff9ff3', '#feca57'],
            dusk: ['#ff6b6b', '#ff9ff3'],
            night: ['#c44569', '#f8a5c2']
        },
        winter_theme: {
            sky: ['#e0f7fa', '#b2ebf2'],
            dusk: ['#80deea', '#4dd0e1'],
            night: ['#263238', '#455a64']
        },
        halloween_theme: {
            sky: ['#2d1f2d', '#4a2c4a'],
            dusk: ['#1a0a1a', '#2d1f2d'],
            night: ['#0a0a0a', '#1a0a1a']
        }
    };

    static BALLOON_PALETTES = {
        default: [
            { main: '#ff5e5e', highlight: '#ff9a9a' },
            { main: '#ffcc33', highlight: '#fff29a' },
            { main: '#5edfff', highlight: '#9aecff' },
            { main: '#ff8a5e', highlight: '#ffbc9a' },
            { main: '#a25eff', highlight: '#ca9aff' },
            { main: '#5effb1', highlight: '#9affd4' }
        ],
        pink_balloons: [
            { main: '#ff69b4', highlight: '#ffb6c1' },
            { main: '#ff1493', highlight: '#ff69b4' },
            { main: '#db7093', highlight: '#ffb6c1' },
            { main: '#f08080', highlight: '#ffcccb' },
            { main: '#ff6b6b', highlight: '#ffa07a' },
            { main: '#e91e63', highlight: '#f48fb1' }
        ],
        rainbow_balloons: [
            { main: '#ff0000', highlight: '#ff6666' },
            { main: '#ff8000', highlight: '#ffb366' },
            { main: '#ffff00', highlight: '#ffff99' },
            { main: '#00ff00', highlight: '#66ff66' },
            { main: '#0080ff', highlight: '#66b3ff' },
            { main: '#8000ff', highlight: '#b366ff' }
        ],
        pastel_balloons: [
            { main: '#ffb3ba', highlight: '#ffd1d6' },
            { main: '#ffdfba', highlight: '#ffeccc' },
            { main: '#ffffba', highlight: '#ffffdd' },
            { main: '#baffc9', highlight: '#d6ffdf' },
            { main: '#bae1ff', highlight: '#d6ecff' },
            { main: '#e0baff', highlight: '#ecd6ff' }
        ],
        neon_balloons: [
            { main: '#ff00ff', highlight: '#ff66ff' },
            { main: '#00ffff', highlight: '#66ffff' },
            { main: '#ffff00', highlight: '#ffff99' },
            { main: '#00ff00', highlight: '#66ff66' },
            { main: '#ff3366', highlight: '#ff8099' },
            { main: '#3366ff', highlight: '#8099ff' }
        ],
        lava_balloons: [
            { main: '#ff4500', highlight: '#ff7f50' },
            { main: '#ff6347', highlight: '#ff8c69' },
            { main: '#dc143c', highlight: '#ff6b6b' },
            { main: '#b22222', highlight: '#cd5c5c' },
            { main: '#ff0000', highlight: '#ff6666' },
            { main: '#ffd700', highlight: '#ffec8b' }
        ],
        crystal_balloons: [
            { main: '#00bfff', highlight: '#87ceeb' },
            { main: '#00ced1', highlight: '#7fffd4' },
            { main: '#4169e1', highlight: '#6495ed' },
            { main: '#9370db', highlight: '#b19cd9' },
            { main: '#e0ffff', highlight: '#f0ffff' },
            { main: '#87cefa', highlight: '#b0e0e6' }
        ],
        galaxy_balloons: [
            { main: '#483d8b', highlight: '#6a5acd' },
            { main: '#663399', highlight: '#8a2be2' },
            { main: '#4b0082', highlight: '#8b008b' },
            { main: '#9400d3', highlight: '#ba55d3' },
            { main: '#8b0000', highlight: '#dc143c' },
            { main: '#191970', highlight: '#4169e1' }
        ],
        emoji_balloons: [
            { main: '#ffcc33', highlight: '#fff29a' },
            { main: '#ff6b6b', highlight: '#ff9999' },
            { main: '#4ecdc4', highlight: '#7eddd6' },
            { main: '#ff8a5e', highlight: '#ffbc9a' },
            { main: '#9b59b6', highlight: '#bb8fce' },
            { main: '#3498db', highlight: '#74b9eb' }
        ]
    };

    // Weather mappings for themes
    static THEME_WEATHER = {
        sakura_theme: 'sakura',
        winter_theme: 'snow',
        aurora_theme: 'aurora',
        ocean_theme: 'rain',
        // Autumn/fall themes could use 'leaves'
    };

    constructor() {
        this.currentTheme = 'default';
        this.currentPalette = 'default';
    }

    getEquippedTheme(progression) {
        return progression?.data?.equippedTheme || 'default';
    }

    getEquippedPalette(progression) {
        const paletteId = progression?.data?.equippedBalloons || 'default';
        return ThemeManager.BALLOON_PALETTES[paletteId] || ThemeManager.BALLOON_PALETTES.default;
    }

    getThemeColors(themeId) {
        return ThemeManager.THEMES[themeId] || ThemeManager.THEMES.default;
    }

    getBackgroundGradient(themeId, score = 0) {
        const theme = this.getThemeColors(themeId);
        
        // Dynamic progression based on score
        if (score < 30) {
            return theme.sky;
        } else if (score < 75) {
            return theme.dusk;
        } else {
            return theme.night;
        }
    }

    getWeatherForTheme(themeId) {
        return ThemeManager.THEME_WEATHER[themeId] || null;
    }

    isNightTheme(themeId) {
        return ['night_bg', 'galaxy_bg', 'neon_theme', 'aurora_theme', 'halloween_theme'].includes(themeId);
    }

    // Apply theme CSS variables to body
    applyThemeToBody(themeId) {
        const theme = this.getThemeColors(themeId);
        const root = document.documentElement;
        
        // Set CSS variables for dynamic theming
        if (theme.sky) {
            root.style.setProperty('--bg-gradient', `linear-gradient(135deg, ${theme.sky[0]}, ${theme.sky[1]})`);
        }
        
        // Add theme class to body
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        if (this.isNightTheme(themeId)) {
            document.body.classList.add('theme-night');
        } else if (themeId === 'lava_theme') {
            document.body.classList.add('theme-lava');
        }
    }

    // Get particle colors based on theme
    getParticleColors(themeId) {
        const palette = ThemeManager.BALLOON_PALETTES[themeId] || ThemeManager.BALLOON_PALETTES.default;
        return palette.map(c => c.main);
    }

    // Get confetti colors for celebrations
    getConfettiColors() {
        return ['#ff0000', '#ff8000', '#ffff00', '#00ff00', '#0080ff', '#8000ff', '#ff00ff', '#ffd700'];
    }

    // Get glow color for special effects based on theme
    getGlowColor(themeId) {
        const glowColors = {
            default: 'rgba(255, 215, 0, 0.5)',
            neon_theme: 'rgba(0, 255, 255, 0.6)',
            lava_theme: 'rgba(255, 69, 0, 0.6)',
            aurora_theme: 'rgba(0, 255, 127, 0.5)',
            galaxy_bg: 'rgba(147, 112, 219, 0.5)',
            sakura_theme: 'rgba(255, 182, 193, 0.5)',
            winter_theme: 'rgba(135, 206, 235, 0.5)',
            ocean_theme: 'rgba(64, 224, 208, 0.5)'
        };
        return glowColors[themeId] || glowColors.default;
    }

    // Get UI accent color based on theme
    getAccentColor(themeId) {
        const accents = {
            default: '#ff9a9e',
            sunset_bg: '#ff6b6b',
            night_bg: '#667eea',
            galaxy_bg: '#9400d3',
            neon_theme: '#00ffff',
            ocean_theme: '#00ced1',
            lava_theme: '#ff4500',
            sakura_theme: '#ffb7c5',
            aurora_theme: '#00ff7f',
            candy_theme: '#ff9ff3',
            winter_theme: '#87ceeb',
            halloween_theme: '#ff6600'
        };
        return accents[themeId] || accents.default;
    }
}
