/**
 * Balloon Pop Adventure - Enhanced Edition
 * Main game file with all features
 */

// ===== HOWLER.JS MOCK (for when not loaded) =====
if (typeof Howl === 'undefined') {
    class MockHowl {
        constructor(options) { this._volume = options.volume || 1; this._loop = options.loop || false; }
        play() { return 0; }
        pause() {}
        stop() {}
        volume(v) { if (v !== undefined) this._volume = v; return this._volume; }
        rate() {}
        mute() {}
        playing() { return false; }
    }npm 
    window.Howl = MockHowl;
}

// ===== GSAP MOCK =====
if (typeof gsap === 'undefined') {
    window.gsap = {
        to: (el, opts) => { setTimeout(() => opts.onComplete && opts.onComplete(), (opts.duration || 0) * 1000); },
        from: (el, opts) => { setTimeout(() => opts.onComplete && opts.onComplete(), (opts.duration || 0) * 1000); },
        fromTo: (el, from, to) => { setTimeout(() => to.onComplete && to.onComplete(), (to.duration || 0) * 1000); },
        set: () => {}
    };
}

// ===== DOM ELEMENTS =====
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// UI Screens
const startScreen = document.getElementById('start-screen');
const pauseScreen = document.getElementById('pause-screen');
const gameoverScreen = document.getElementById('gameover-screen');
const shopScreen = document.getElementById('shop-screen');
const collectionScreen = document.getElementById('collection-screen');
const leaderboardScreen = document.getElementById('leaderboard-screen');
const challengesScreen = document.getElementById('challenges-screen');
const achievementsScreen = document.getElementById('achievements-screen');
const settingsScreen = document.getElementById('settings-screen');
const statsScreen = document.getElementById('stats-screen');
const weeklyScreen = document.getElementById('weekly-screen');
const albumScreen = document.getElementById('album-screen');
const prestigeScreen = document.getElementById('prestige-screen');
const tutorialScreen = document.getElementById('tutorial-screen');
const minigameScreen = document.getElementById('minigame-screen');

// UI Elements
const scoreValue = document.getElementById('score-value');
const coinsValue = document.getElementById('coins-value');
const timerValue = document.getElementById('timer-value');
const livesValue = document.getElementById('lives-value');
const livesContainer = document.getElementById('lives-container');
const comboDisplay = document.getElementById('combo-display');
const comboCount = document.getElementById('combo-count');
const chainDisplay = document.getElementById('chain-display');
const chainCount = document.getElementById('chain-count');
const effectMessage = document.getElementById('effect-message');
const megaPopMessage = document.getElementById('mega-pop-message');
const reinforcementMessage = document.getElementById('reinforcement-message');
const unlockNotification = document.getElementById('unlock-notification');
const achievementNotification = document.getElementById('achievement-notification');
const powerupBar = document.getElementById('powerup-bar');
const targetIndicator = document.getElementById('target-indicator');
const bossIndicator = document.getElementById('boss-indicator');
const bossWarning = document.getElementById('boss-warning');
const mysteryReveal = document.getElementById('mystery-reveal');

// Buttons
const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById('pause-button');
const resumeButton = document.getElementById('resume-button');
const restartButton = document.getElementById('restart-button');
const restartFromPauseButton = document.getElementById('restart-from-pause-button');
const quitButton = document.getElementById('quit-button');
const homeButton = document.getElementById('home-button');
const musicToggle = document.getElementById('music-toggle');

// ===== AUDIO SYSTEM =====
const sounds = {
    pop: null,
    popGlitter: null,
    popRare: null,
    popBoss: null,
    popBomb: null,
    popFreeze: null,
    popTime: null,
    popMystery: null,
    popChain: null,
    combo: null,
    frenzy: null,
    bgm: null,
    bgmFrenzy: null,
    bgmBoss: null,
    powerup: null,
    coin: null,
    achievement: null,
    levelUp: null,
    click: null,
    bossWarning: null,
    bossDefeat: null,
    chainCombo: null,
    mysteryReveal: null
};

let audioInitialized = false;
let musicEnabled = true;
let sfxEnabled = true;
let musicVolume = 0.5;
let sfxVolume = 0.7;

// Web Audio context for generating sounds
let audioContext = null;

function initAudio() {
    if (audioInitialized) return;
    audioInitialized = true;
    
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.warn('Web Audio API not supported');
    }
}

// Generate a simple pop sound using Web Audio API
function playPopSound() {
    if (!sfxEnabled) return;
    
    // Create audio context on demand if needed
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            return;
        }
    }
    
    try {
        // Resume audio context if suspended (browser autoplay policy)
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Simple "pop" sound - short sine wave that drops in frequency
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.15);
        
        // Volume
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
    } catch (e) { }
}

function playSound(name, rate = 1) {
    // Use Web Audio for pop sound (guaranteed to work)
    if (name === 'pop' || name === 'combo' || name === 'coin') {
        playPopSound();
        return;
    }
    
    if (!sfxEnabled || !sounds[name]) return;
    try {
        const id = sounds[name].play();
        if (rate !== 1) sounds[name].rate(rate, id);
        return id;
    } catch (e) { }
}

function playMusic(name = 'bgm') {
    if (!musicEnabled || !sounds[name]) return;
    try {
        if (sounds.bgm && sounds.bgm.playing()) sounds.bgm.stop();
        sounds[name]?.play();
    } catch (e) { }
}

function stopMusic() {
    try {
        Object.values(sounds).forEach(s => {
            if (s && s.playing && s.playing()) s.stop();
        });
    } catch (e) { }
}

function toggleMusic() {
    musicEnabled = !musicEnabled;
    musicToggle.textContent = musicEnabled ? '🎵' : '🔇';
    if (musicEnabled && isPlaying && !isPaused) {
        playMusic();
    } else {
        stopMusic();
    }
}

// Haptic feedback
function haptic(style = 'light') {
    if (!progression?.data?.settings?.hapticFeedback) return;
    try {
        if (navigator.vibrate) {
            const patterns = { light: 10, medium: 25, heavy: 50, success: [50, 30, 50] };
            navigator.vibrate(patterns[style] || 10);
        }
    } catch (e) { }
}

// ===== GAME STATE =====
let isPlaying = false;
let isPaused = false;
let score = 0;
let highScore = 0;
let coins = 0;
let gameTime = 90;
let timeRemaining = gameTime;
let lives = 3;
let combo = 0;
let comboTimer = 0;
let lastPopTime = 0;
let totalPops = 0;
let glitterPops = 0;
let rarePops = 0;
let megaPops = 0;
let bossDefeated = 0;
let chainComboCount = 0;
let lastColorPopped = -1;
let chainComboActive = false;
let powerupsUsed = 0;
let frenzyCount = 0;
let hitBomb = false;
let gameStartTime = 0;

// Game mode
let currentMode = 'classic';
const gameModes = {
    classic: { time: 90, lives: 0, bombs: true, frenzy: true },
    zen: { time: 0, lives: 0, bombs: false, frenzy: false },
    survival: { time: 0, lives: 3, bombs: true, frenzy: true },
    frenzy: { time: 30, lives: 0, bombs: true, frenzy: true, alwaysFrenzy: true },
    target: { time: 60, lives: 3, bombs: false, frenzy: false, target: true },
    bossRush: { time: 0, lives: 5, bombs: false, frenzy: false, boss: true },
    endless: { time: 0, lives: 1, bombs: true, frenzy: true, endless: true },
    puzzle: { time: 120, lives: 0, bombs: false, frenzy: false, puzzle: true }
};

// Target mode
let targetColor = 0;
let targetRemaining = 5;
let targetRound = 1;

// Boss mode
let currentBoss = null;
let bossCount = 0;
let bossInterval = 50; // Spawn boss every 50 pops

// Endless mode
let difficultyLevel = 1;
let survivalTime = 0;

// Puzzle mode
let puzzleGrid = [];
let selectedBalloons = [];

// Effects
let isFrenzyMode = false;
let frenzyTimer = 0;
let isFreeze = false;
let freezeTimer = 0;
let balloonSpeedMultiplier = 1;

// Active power-ups
let activePowerups = {
    magnet: false,
    doubleScore: false,
    shield: false,
    slowmo: false,
    coinMagnet: false
};
let powerupTimers = {};

// Game objects
let balloons = [];
let particles = [];
let textParticles = [];
let clouds = [];
let butterflies = [];

// Environment systems
let weatherSystem = null;
let dynamicBackground = null;
let screenEffects = null;
let cursorTrail = null;

// Mini-game
let miniGameActive = false;
let miniGameScore = 0;
let miniGameTimer = 0;

// Canvas
let canvasWidth = 0;
let canvasHeight = 0;
let mouseX = 0;
let mouseY = 0;
let isMouseDown = false;
let lastSwipePoint = null;

// Managers
let progression = null;
let themeManager = null;
let firebaseManager = null;
let leaderboard = null;

// Animation
let lastFrameTime = 0;
let animationId = null;

// ===== INITIALIZATION =====
function init() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Initialize managers
    progression = new ProgressionManager();
    themeManager = new ThemeManager();
    
    // Initialize environment systems
    weatherSystem = new WeatherSystem(canvasWidth, canvasHeight);
    dynamicBackground = new DynamicBackground(canvasWidth, canvasHeight);
    screenEffects = new ScreenEffects(canvasWidth, canvasHeight);
    cursorTrail = new CursorTrail();
    
    // Apply settings
    applySettings();
    
    // Initialize Firebase (if available)
    try {
        firebaseManager = new FirebaseManager();
        leaderboard = new Leaderboard(firebaseManager);
    } catch (e) {
        console.log('Firebase not configured');
    }
    
    // Load high score
    highScore = progression.data.highScore;
    
    // Setup input handlers
    setupInputHandlers();
    setupButtonHandlers();
    
    // Initialize environment
    initEnvironment();
    
    // Update UI
    updateStartScreenUI();
    
    // Check tutorial
    if (progression.shouldShowTutorial()) {
        showTutorial();
    }
    
    // Check daily bonus
    if (progression.canClaimDailyBonus()) {
        document.getElementById('daily-bonus').classList.remove('hidden');
        document.getElementById('login-streak').textContent = progression.data.loginStreak;
    }
    
    // Start animation loop
    requestAnimationFrame(gameLoop);
}

function resizeCanvas() {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Resize systems
    weatherSystem?.resize(canvasWidth, canvasHeight);
    dynamicBackground?.resize(canvasWidth, canvasHeight);
    screenEffects?.resize(canvasWidth, canvasHeight);
}

function initEnvironment() {
    // Create initial clouds
    for (let i = 0; i < 5; i++) {
        const cloud = new Cloud(canvasWidth, canvasHeight);
        cloud.x = Math.random() * canvasWidth;
        clouds.push(cloud);
    }
    
    // Create butterflies
    for (let i = 0; i < 3; i++) {
        butterflies.push(new Butterfly(canvasWidth, canvasHeight));
    }
}

function applySettings() {
    const settings = progression.getSettings();
    musicVolume = settings.musicVolume;
    sfxVolume = settings.sfxVolume;
    
    if (sounds.bgm) sounds.bgm.volume(musicVolume);
    
    // Safely update UI elements (they may not exist on all screens)
    const setElementValue = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.value = value;
    };
    const setElementChecked = (id, checked) => {
        const el = document.getElementById(id);
        if (el) el.checked = checked;
    };
    
    setElementValue('music-volume', musicVolume * 100);
    setElementValue('sfx-volume', sfxVolume * 100);
    setElementChecked('colorblind-mode', settings.colorblindMode);
    setElementChecked('reduced-motion', settings.reducedMotion);
    setElementChecked('haptic-feedback', settings.hapticFeedback);
    setElementChecked('show-tutorial', settings.showTutorial);
    setElementChecked('auto-save', settings.autoSave);
}

// ===== INPUT HANDLERS =====
function setupInputHandlers() {
    // Mouse events
    canvas.addEventListener('mousedown', handlePointerStart);
    canvas.addEventListener('mousemove', handlePointerMove);
    canvas.addEventListener('mouseup', handlePointerEnd);
    canvas.addEventListener('mouseleave', handlePointerEnd);
    
    // Touch events
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('touchcancel', handleTouchEnd);
    
    // Prevent context menu on long press
    canvas.addEventListener('contextmenu', e => e.preventDefault());
}

function handlePointerStart(e) {
    initAudio(); // Initialize audio on first interaction
    if (!isPlaying || isPaused) return;
    isMouseDown = true;
    const pos = getEventPos(e);
    mouseX = pos.x;
    mouseY = pos.y;
    lastSwipePoint = { x: pos.x, y: pos.y };
    cursorTrail?.addPoint(pos.x, pos.y);
    checkBalloonHit(pos.x, pos.y);
}

function handlePointerMove(e) {
    const pos = getEventPos(e);
    mouseX = pos.x;
    mouseY = pos.y;
    cursorTrail?.addPoint(pos.x, pos.y);
    
    if (!isPlaying || isPaused) return;
    
    // React to cursor
    balloons.forEach(b => b.reactToCursor(pos.x, pos.y));
    butterflies.forEach(b => b.react(pos.x, pos.y));
    
    // Swipe detection
    if (isMouseDown && lastSwipePoint) {
        const dx = pos.x - lastSwipePoint.x;
        const dy = pos.y - lastSwipePoint.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 10) {
            checkSwipePath(lastSwipePoint.x, lastSwipePoint.y, pos.x, pos.y);
            lastSwipePoint = { x: pos.x, y: pos.y };
        }
    }
}

function handlePointerEnd() {
    isMouseDown = false;
    lastSwipePoint = null;
}

function handleTouchStart(e) {
    e.preventDefault();
    initAudio();
    const touch = e.touches[0];
    handlePointerStart({ clientX: touch.clientX, clientY: touch.clientY });
}

function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    handlePointerMove({ clientX: touch.clientX, clientY: touch.clientY });
}

function handleTouchEnd() {
    handlePointerEnd();
}

function getEventPos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) * (canvas.width / rect.width),
        y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
}

function checkSwipePath(x1, y1, x2, y2) {
    const steps = Math.ceil(Math.sqrt((x2-x1)**2 + (y2-y1)**2) / 20);
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = x1 + (x2 - x1) * t;
        const y = y1 + (y2 - y1) * t;
        checkBalloonHit(x, y);
    }
}

function checkBalloonHit(x, y) {
    for (let i = balloons.length - 1; i >= 0; i--) {
        const balloon = balloons[i];
        if (balloon.isPopping) continue;
        
        if (balloon.isHit(x, y)) {
            handleBalloonPop(balloon, i);
            break; // Only pop one balloon per click
        }
    }
}

// ===== BALLOON HANDLING =====
function handleBalloonPop(balloon, index) {
    // Check if balloon survives hit (boss, armored)
    if (!balloon.handleHit()) {
        // Balloon survived - show damage effect
        createHitEffect(balloon.x, balloon.y, balloon.color.main);
        haptic('medium');
        playSound('pop', 0.8);
        return;
    }
    
    // Handle bomb
    if (balloon.isBomb()) {
        handleBombHit(balloon);
        balloons.splice(index, 1);
        return;
    }
    
    // Pop the balloon
    balloon.isPopping = true;
    haptic('light');
    playSound('pop');
    
    // Calculate rewards
    let points = balloon.getPoints();
    let coinReward = balloon.getCoins();
    
    // Apply multipliers
    if (activePowerups.doubleScore) points *= 2;
    if (activePowerups.coinMagnet) coinReward *= 2;
    if (isFrenzyMode) points *= 2;
    
    // Combo system
    const now = Date.now();
    if (now - lastPopTime < 800) {
        combo++;
        if (combo >= 2) {
            showCombo(combo);
            points += combo;
        }
        comboTimer = 60;
    } else {
        combo = 1;
    }
    lastPopTime = now;
    
    // Color chain system
    handleColorChain(balloon);
    
    // Target mode logic
    if (currentMode === 'target') {
        handleTargetPop(balloon);
    }
    
    // Update score
    score += points;
    coins += coinReward;
    totalPops++;
    
    // Track balloon type
    trackBalloonPop(balloon);
    
    // Handle special effects
    handleSpecialBalloonEffect(balloon);
    
    // Create particles
    createPopParticles(balloon);
    
    // Floating text
    createFloatingText(balloon.x, balloon.y - 30, `+${points}`, '#ffed4a');
    if (coinReward > 0) {
        createFloatingText(balloon.x + 30, balloon.y - 20, `+${coinReward}🪙`, '#ffd700');
    }
    
    // Play sound
    playBalloonSound(balloon);
    
    // Update UI
    updateScoreUI();
    
    // Check for boss spawn
    if (totalPops > 0 && totalPops % bossInterval === 0 && !currentBoss) {
        spawnBoss();
    }
    
    // Check frenzy trigger
    if (combo >= 10 && !isFrenzyMode && gameModes[currentMode].frenzy) {
        triggerFrenzy();
    }
    
    // Reinforcement messages
    checkReinforcement();
}

function handleColorChain(balloon) {
    if (balloon.colorIndex === lastColorPopped) {
        chainComboCount++;
        if (chainComboCount >= 3) {
            showChainCombo(chainComboCount);
            score += chainComboCount * 2;
            createFloatingText(balloon.x, balloon.y - 60, `🔗 ${chainComboCount}x Chain!`, '#00bcd4');
            
            if (chainComboCount >= 5) {
                screenEffects?.addRipple(balloon.x, balloon.y, 'rgba(0, 188, 212, 0.5)');
            }
        }
    } else {
        chainComboCount = 1;
    }
    lastColorPopped = balloon.colorIndex;
}

function handleSpecialBalloonEffect(balloon) {
    switch (balloon.balloonType) {
        case 'freeze':
            activateFreeze();
            break;
        case 'time':
            addTime(5);
            break;
        case 'mega':
            triggerMegaPop(balloon);
            break;
        case 'mystery':
            triggerMysteryEffect(balloon);
            break;
        case 'chain':
            triggerChainReaction(balloon);
            break;
        case 'boss':
            handleBossDefeat(balloon);
            break;
    }
    
    // Rare balloon discovery
    if (balloon.isRare()) {
        handleRareBalloon(balloon);
    }
}

function handleBombHit(balloon) {
    // Check for shield
    if (activePowerups.shield) {
        activePowerups.shield = false;
        showEffectMessage('🛡️ Shield Blocked!', 'powerup');
        screenEffects?.addFlash('rgba(0, 150, 255, 0.3)', 0.2);
        playSound('pop');
        particles.push(...ParticlePresets.smokeCloud(balloon.x, balloon.y, 8));
        haptic('medium');
        return;
    }
    
    hitBomb = true;
    showEffectMessage('💀 BOMB!', 'bomb');
    screenEffects?.addShockwave(balloon.x, balloon.y, 'rgba(255, 0, 0, 0.8)');
    screenEffects?.addFlash('rgba(255, 0, 0, 0.4)', 0.3);
    haptic('heavy');
    playSound('popBomb');
    particles.push(...ParticlePresets.fireEffect(balloon.x, balloon.y, 15));
    particles.push(...ParticlePresets.smokeCloud(balloon.x, balloon.y, 10));
    
    if (gameModes[currentMode].lives > 0) {
        lives--;
        livesValue.textContent = lives;
        if (lives <= 0) {
            endGame('bomb');
        }
    } else {
        endGame('bomb');
    }
}

function handleBossDefeat(balloon) {
    bossDefeated++;
    showEffectMessage(`👹 BOSS DEFEATED! +100`, 'rare');
    screenEffects?.addShockwave(balloon.x, balloon.y, 'rgba(255, 215, 0, 0.9)', 400);
    screenEffects?.addFlash('rgba(255, 215, 0, 0.3)', 0.4);
    haptic('success');
    playSound('bossDefeat');
    particles.push(...ParticlePresets.bossDefeated(balloon.x, balloon.y));
    
    // Track boss defeat in album
    progression.updateAlbumProgress('bossBalloons', 1);
    
    currentBoss = null;
    bossIndicator.classList.add('hidden');
    
    // Spawn bonus balloons
    for (let i = 0; i < 5; i++) {
        setTimeout(() => spawnBalloon('glitter'), i * 100);
    }
}

function handleRareBalloon(balloon) {
    const isFirst = progression.recordRarePop(balloon.balloonType);
    rarePops++;
    
    if (isFirst) {
        showEffectMessage(`🎉 NEW: ${balloon.balloonType.toUpperCase()}!`, 'rare');
        showUnlockNotification(`🌟 Discovered: ${balloon.balloonType}!`);
    } else {
        showEffectMessage(`✨ ${balloon.balloonType.toUpperCase()}!`, 'rare');
    }
    
    particles.push(...ParticlePresets.sparkleCloud(balloon.x, balloon.y, 30));
    screenEffects?.addRipple(balloon.x, balloon.y, 'rgba(255, 215, 0, 0.6)', 200);
}

function trackBalloonPop(balloon) {
    const type = balloon.balloonType;
    
    if (type === 'glitter') glitterPops++;
    if (type === 'mega') megaPops++;
    
    // Update album
    if (balloon.isRare()) {
        progression.updateAlbumProgress('rareBalloons', 1);
    } else if (balloon.isSpecial()) {
        progression.updateAlbumProgress('specialBalloons', 1);
    } else {
        progression.updateAlbumProgress('normalBalloons', 1);
    }
}

function triggerMegaPop(balloon) {
    megaPops++;
    screenEffects?.addShockwave(balloon.x, balloon.y);
    showMegaMessage();
    
    // Pop nearby balloons
    const radius = 150;
    balloons.forEach((b, i) => {
        if (b === balloon || b.isPopping || b.isBomb()) return;
        const dist = Math.sqrt((b.x - balloon.x) ** 2 + (b.y - balloon.y) ** 2);
        if (dist < radius) {
            setTimeout(() => {
                if (!b.isPopping) {
                    b.isPopping = true;
                    playSound('pop');
                    score += b.getPoints();
                    totalPops++;
                    createPopParticles(b);
                }
            }, dist * 2);
        }
    });
}

function triggerMysteryEffect(balloon) {
    const effect = balloon.getMysteryEffect();
    
    mysteryReveal.classList.remove('hidden');
    
    let effectText = '';
    switch (effect) {
        case 'coins':
            effectText = '💰 COIN BURST!';
            coins += 25;
            particles.push(...ParticlePresets.coinShower(balloon.x, balloon.y, 25));
            break;
        case 'powerup':
            effectText = '⚡ RANDOM POWER!';
            activateRandomPowerup();
            break;
        case 'bomb_swarm':
            effectText = '💀 BOMB SWARM!';
            for (let i = 0; i < 3; i++) {
                setTimeout(() => spawnBalloon('bomb'), i * 200);
            }
            break;
        case 'point_burst':
            effectText = '⭐ POINT BURST!';
            score += 50;
            particles.push(...ParticlePresets.sparkleCloud(balloon.x, balloon.y, 30));
            break;
        case 'freeze_all':
            effectText = '❄️ FREEZE ALL!';
            activateFreeze(5000);
            break;
        case 'double_spawn':
            effectText = '🎈 BALLOON RUSH!';
            for (let i = 0; i < 10; i++) {
                setTimeout(() => spawnBalloon(), i * 100);
            }
            break;
        case 'mega_chain':
            effectText = '⛓️ MEGA CHAIN!';
            triggerMegaChain(balloon);
            break;
    }
    
    document.getElementById('mystery-effect-text').textContent = effectText;
    showEffectMessage(effectText, 'mystery');
    particles.push(...ParticlePresets.mysteryReveal(balloon.x, balloon.y, effect));
    
    setTimeout(() => mysteryReveal.classList.add('hidden'), 1500);
}

function triggerChainReaction(balloon) {
    const sameColorBalloons = balloons.filter(
        b => !b.isPopping && b.colorIndex === balloon.colorIndex && b !== balloon
    );
    
    let delay = 0;
    sameColorBalloons.forEach(b => {
        setTimeout(() => {
            if (!b.isPopping) {
                b.isPopping = true;
                score += 2;
                totalPops++;
                createPopParticles(b);
                playSound('pop', 1 + delay * 0.05);
            }
        }, delay);
        delay += 50;
    });
    
    if (sameColorBalloons.length > 0) {
        showEffectMessage(`⛓️ ${sameColorBalloons.length + 1} CHAIN!`, 'chain');
        particles.push(...ParticlePresets.colorMatchChain(balloon.x, balloon.y, balloon.color.main, sameColorBalloons.length));
    }
}

function triggerMegaChain(balloon) {
    let poppedCount = 0;
    balloons.forEach((b, i) => {
        if (b.isPopping || b.isBomb()) return;
        setTimeout(() => {
            if (!b.isPopping) {
                b.isPopping = true;
                playSound('pop');
                score += 1;
                totalPops++;
                poppedCount++;
                createPopParticles(b);
            }
        }, poppedCount * 30);
    });
    
    screenEffects?.addShockwave(balloon.x, balloon.y, 'rgba(0, 188, 212, 0.8)', 500);
}

function createPopParticles(balloon) {
    const color = balloon.color.main;
    
    if (balloon.isBoss()) {
        particles.push(...ParticlePresets.bossDefeated(balloon.x, balloon.y));
    } else if (balloon.isRare()) {
        particles.push(...ParticlePresets.sparkleCloud(balloon.x, balloon.y, 25));
        particles.push(...ParticlePresets.coinShower(balloon.x, balloon.y, 10));
    } else if (balloon.balloonType === 'freeze') {
        particles.push(...ParticlePresets.iceShatter(balloon.x, balloon.y, 15));
    } else if (balloon.balloonType === 'glitter') {
        particles.push(...ParticlePresets.coinShower(balloon.x, balloon.y, 8));
        particles.push(...ParticlePresets.sparkleCloud(balloon.x, balloon.y, 10));
    } else {
        particles.push(...ParticlePresets.explosion(balloon.x, balloon.y, color, 12));
        if (combo >= 5) {
            particles.push(...ParticlePresets.confettiBurst(balloon.x, balloon.y, 15));
        }
    }
}

function createHitEffect(x, y, color) {
    particles.push(...ParticlePresets.sparkleCloud(x, y, 5));
    screenEffects?.addRipple(x, y, `${color}80`, 50);
}

function createFloatingText(x, y, text, color) {
    textParticles.push(new TextParticle(x, y, text, {
        color,
        fontSize: 20 + Math.min(combo * 2, 20),
        decay: 0.015,
        shadow: true
    }));
}

function playBalloonSound(balloon) {
    const type = balloon.balloonType;
    
    if (balloon.isRare()) {
        playSound('popRare') || playSound('pop', 0.7);
    } else if (type === 'boss') {
        playSound('bossDefeat') || playSound('pop', 0.5);
    } else if (type === 'freeze') {
        playSound('popFreeze') || playSound('pop', 1.3);
    } else if (type === 'glitter') {
        playSound('popGlitter') || playSound('pop', 1.2);
    } else if (type === 'mystery') {
        playSound('popMystery') || playSound('pop', 0.8);
    } else {
        playSound('pop', 0.9 + Math.random() * 0.2);
    }
}

// ===== EFFECTS =====
function activateFreeze(duration = 3000) {
    isFreeze = true;
    freezeTimer = duration;
    showEffectMessage('❄️ FREEZE!', 'freeze');
    weatherSystem?.setWeather('snow');
    balloons.forEach(b => b.currentSpeed = b.baseSpeed * 0.2);
}

function deactivateFreeze() {
    isFreeze = false;
    weatherSystem?.setWeather('none');
    balloons.forEach(b => b.currentSpeed = b.baseSpeed * balloonSpeedMultiplier);
}

function addTime(seconds) {
    timeRemaining += seconds;
    showEffectMessage(`⏰ +${seconds}s!`, 'time');
}

function triggerFrenzy() {
    if (isFrenzyMode) return;
    isFrenzyMode = true;
    frenzyTimer = 10000;
    frenzyCount++;
    
    document.body.classList.add('frenzy-mode');
    showEffectMessage('🔥 FRENZY MODE! 🔥', 'powerup');
    
    playSound('frenzy');
    haptic('success');
    
    // Spawn extra balloons
    for (let i = 0; i < 10; i++) {
        setTimeout(() => spawnBalloon(), i * 100);
    }
}

function endFrenzy() {
    isFrenzyMode = false;
    document.body.classList.remove('frenzy-mode');
}

function activateRandomPowerup() {
    const powerups = ['magnet', 'doubleScore', 'slowmo', 'coinMagnet'];
    const randomPowerup = powerups[Math.floor(Math.random() * powerups.length)];
    activatePowerup(randomPowerup);
}

function activatePowerup(type) {
    const powerupInfo = ProgressionManager.POWERUPS[type];
    if (!powerupInfo) return;
    
    activePowerups[type] = true;
    powerupsUsed++;
    
    showEffectMessage(`${powerupInfo.name} Active!`, 'powerup');
    haptic('medium');
    
    if (powerupInfo.duration > 0) {
        powerupTimers[type] = setTimeout(() => {
            activePowerups[type] = false;
        }, powerupInfo.duration);
    }
    
    // Special effects
    if (type === 'slowmo') {
        balloonSpeedMultiplier = 0.5;
        balloons.forEach(b => b.currentSpeed = b.baseSpeed * balloonSpeedMultiplier);
    }
}

function usePowerup(type) {
    if (!progression.usePowerup(type)) return;
    
    if (type === 'autoPopBonus') {
        // Auto pop 5 random balloons
        const targets = balloons.filter(b => !b.isPopping && !b.isBomb()).slice(0, 5);
        targets.forEach((b, i) => {
            setTimeout(() => {
                if (!b.isPopping) handleBalloonPop(b, balloons.indexOf(b));
            }, i * 100);
        });
    } else {
        activatePowerup(type);
    }
    
    updatePowerupUI();
}

// ===== BOSS =====
function spawnBoss() {
    if (currentBoss) return;
    
    // Show warning
    bossWarning.classList.remove('hidden');
    playSound('bossWarning');
    haptic('heavy');
    
    setTimeout(() => {
        bossWarning.classList.add('hidden');
        
        currentBoss = BossBalloon.create(canvasWidth, canvasHeight, bossCount);
        balloons.push(currentBoss);
        bossCount++;
        
        bossIndicator.classList.remove('hidden');
        document.getElementById('boss-name').textContent = currentBoss.bossName || 'BOSS';
    }, 2000);
}

// ===== SPAWNING =====
function spawnBalloon(forceType = null) {
    const palette = themeManager.getEquippedPalette(progression);
    const colorIndex = Math.floor(Math.random() * 6);
    
    let allowedTypes = null;
    
    // Mode-specific type restrictions
    if (currentMode === 'zen') {
        allowedTypes = ['normal', 'glitter', 'time', 'mega', 'rainbow', 'star'];
    } else if (currentMode === 'target') {
        allowedTypes = ['normal'];
    } else if (currentMode === 'puzzle') {
        allowedTypes = ['normal'];
    }
    
    const balloon = new Balloon(canvasWidth, canvasHeight, colorIndex, palette, allowedTypes, forceType);
    
    // Target mode coloring
    if (currentMode === 'target' && balloon.balloonType === 'normal') {
        balloon.colorIndex = Math.floor(Math.random() * 4); // Limit colors for target mode
    }
    
    balloons.push(balloon);
}

function getSpawnRate() {
    let baseRate = 60; // frames between spawns
    
    if (currentMode === 'frenzy' || isFrenzyMode) baseRate = 30;
    if (currentMode === 'endless') baseRate = Math.max(20, 60 - difficultyLevel * 2);
    
    // Increase rate with score
    baseRate = Math.max(30, baseRate - Math.floor(score / 50));
    
    return baseRate;
}

// ===== TARGET MODE =====
function initTargetMode() {
    targetColor = Math.floor(Math.random() * 4);
    targetRemaining = 5 + targetRound * 2;
    updateTargetUI();
}

function handleTargetPop(balloon) {
    if (balloon.colorIndex === targetColor) {
        targetRemaining--;
        if (targetRemaining <= 0) {
            // Round complete
            targetRound++;
            score += targetRound * 10;
            showEffectMessage(`✨ Round ${targetRound} Complete!`, 'powerup');
            initTargetMode();
        }
    } else {
        // Wrong color
        lives--;
        livesValue.textContent = lives;
        showEffectMessage('❌ Wrong Color!', 'bomb');
        if (lives <= 0) {
            endGame('lives');
        }
    }
    updateTargetUI();
}

function updateTargetUI() {
    if (!targetIndicator) return;
    const colors = ['🔴', '🟡', '🔵', '🟢'];
    document.getElementById('target-color-display').textContent = colors[targetColor] || '🔴';
    document.getElementById('target-remaining').textContent = `${targetRemaining} left`;
}

// ===== GAME FLOW =====
function startGame() {
    initAudio();
    
    // Reset state
    isPlaying = true;
    isPaused = false;
    score = 0;
    coins = 0;
    combo = 0;
    totalPops = 0;
    glitterPops = 0;
    rarePops = 0;
    megaPops = 0;
    bossDefeated = 0;
    chainComboCount = 0;
    lastColorPopped = -1;
    powerupsUsed = 0;
    frenzyCount = 0;
    hitBomb = false;
    gameStartTime = Date.now();
    currentBoss = null;
    
    // Mode setup
    const mode = gameModes[currentMode];
    timeRemaining = mode.time || Infinity;
    gameTime = mode.time || 0;
    lives = mode.lives || 0;
    
    // Reset effects
    isFrenzyMode = mode.alwaysFrenzy || false;
    isFreeze = false;
    balloonSpeedMultiplier = 1;
    activePowerups = { magnet: false, doubleScore: false, shield: false, slowmo: false, coinMagnet: false };
    
    // Clear objects
    balloons = [];
    particles = [];
    textParticles = [];
    
    // Reset boss interval
    bossInterval = 50;
    bossCount = 0;
    
    // Mode-specific init
    if (currentMode === 'target') {
        targetRound = 1;
        initTargetMode();
        targetIndicator.classList.remove('hidden');
    }
    if (currentMode === 'endless') {
        difficultyLevel = 1;
        survivalTime = 0;
    }
    if (currentMode === 'bossRush') {
        bossInterval = 10; // Bosses more frequent in Boss Rush
    }
    
    // Show/hide UI
    startScreen.classList.add('hidden');
    livesContainer.classList.toggle('hidden', !mode.lives);
    powerupBar.classList.remove('hidden');
    bossIndicator.classList.add('hidden');
    
    if (mode.lives) livesValue.textContent = lives;
    
    // Update power-up counts
    updatePowerupUI();
    
    // Spawn initial balloons
    for (let i = 0; i < 5; i++) {
        spawnBalloon();
    }
    
    // Start music
    playMusic();
    
    updateScoreUI();
}

function togglePause() {
    if (!isPlaying) return;
    isPaused = !isPaused;
    
    pauseScreen.classList.toggle('hidden', !isPaused);
    document.getElementById('pause-score').textContent = score;
    
    if (isPaused) {
        stopMusic();
    } else {
        playMusic();
    }
}

function endGame(reason = 'time') {
    isPlaying = false;
    isPaused = false;
    
    stopMusic();
    
    // Calculate play time
    const playTime = Math.floor((Date.now() - gameStartTime) / 1000);
    
    // Calculate stars
    let stars = Math.floor(score / 10);
    stars = progression.addStars(stars);
    
    // Add coins
    const earnedCoins = progression.addCoins(coins);
    
    // Update high score
    const isNewHighScore = progression.updateHighScore(score);
    highScore = progression.data.highScore;
    
    // Record game
    progression.recordGamePlayed(currentMode, score, playTime);
    
    // Update challenges
    const challengeStats = {
        pops: totalPops,
        score: score,
        maxCombo: combo,
        glitterPops,
        rarePops,
        megaPops,
        powerupsUsed,
        frenzyCount,
        gamesPlayed: 1,
        noBombGame: !hitBomb,
        bossDefeated,
        chainCombo: chainComboCount
    };
    
    const completedChallenges = progression.updateChallengeProgress(challengeStats);
    progression.updateWeeklyChallengeProgress(challengeStats);
    
    // Update achievements
    const newAchievements = progression.updateStats({
        pops: totalPops,
        combo,
        score,
        bombsAvoided: hitBomb ? 0 : 1
    });
    
    // Check mode achievement
    const modeStats = { pops: totalPops, score, lives, won: lives > 0, survivalTime, perfect: !hitBomb };
    const modeAchievement = progression.checkModeAchievement(currentMode, modeStats);
    if (modeAchievement) newAchievements.push(modeAchievement);
    
    // Check rank up
    const newRank = progression.checkRankUp();
    
    // Update game over screen
    let title = 'Time\'s Up!';
    if (reason === 'bomb') title = '💥 BOOM!';
    if (reason === 'lives') title = '💔 Game Over!';
    if (currentMode === 'zen') title = 'Nice Session!';
    
    document.getElementById('gameover-title').textContent = title;
    document.getElementById('final-score-display').textContent = score;
    document.getElementById('high-score-display').textContent = `Best: ${highScore}`;
    document.getElementById('high-score-badge').classList.toggle('hidden', !isNewHighScore);
    
    document.getElementById('game-pops').textContent = totalPops;
    document.getElementById('game-combo').textContent = combo;
    document.getElementById('game-bosses').textContent = bossDefeated;
    
    document.getElementById('stars-earned').textContent = stars;
    document.getElementById('coins-earned').textContent = earnedCoins;
    
    // Show rank up
    if (newRank) {
        const notification = document.getElementById('rank-up-notification');
        notification.classList.remove('hidden');
        document.getElementById('new-rank-emoji').textContent = newRank.emoji;
        document.getElementById('new-rank-name').textContent = newRank.name;
        playSound('rankUp');
        haptic('success');
    } else {
        document.getElementById('rank-up-notification').classList.add('hidden');
    }
    
    // Show achievements
    newAchievements.forEach((a, i) => {
        setTimeout(() => showAchievementNotification(a), i * 1500);
    });
    
    // Clean up
    powerupBar.classList.add('hidden');
    targetIndicator.classList.add('hidden');
    bossIndicator.classList.add('hidden');
    document.body.classList.remove('frenzy-mode');
    
    // Show game over
    gameoverScreen.classList.remove('hidden');
    
    // Check for leaderboard
    if (score > 0 && leaderboard) {
        document.getElementById('initials-entry').classList.remove('hidden');
    }
}

function goHome() {
    isPlaying = false;
    isPaused = false;
    
    gameoverScreen.classList.add('hidden');
    pauseScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    powerupBar.classList.add('hidden');
    
    updateStartScreenUI();
}

function updateStartScreenUI() {
    document.getElementById('stars-amount').textContent = progression.data.totalStars;
    document.getElementById('coins-amount').textContent = progression.data.coins;
    
    const rank = progression.getCurrentRank();
    document.getElementById('rank-emoji').textContent = rank.emoji;
    document.getElementById('rank-name').textContent = rank.name;
    
    // Prestige badge
    if (progression.data.prestigeLevel > 0) {
        document.getElementById('prestige-badge').classList.remove('hidden');
        document.getElementById('prestige-level').textContent = progression.data.prestigeLevel;
    }
    
    // Gems
    if (progression.data.gems > 0) {
        document.getElementById('total-gems').classList.remove('hidden');
        document.getElementById('gems-amount').textContent = progression.data.gems;
    }
    
    // Season
    const season = progression.checkSeasonalEvent();
    if (season) {
        document.getElementById('seasonal-banner').classList.remove('hidden');
        document.getElementById('season-icon').textContent = season.name.includes('Spring') ? '🌸' :
            season.name.includes('Summer') ? '☀️' :
            season.name.includes('Fall') ? '🍂' : '❄️';
        document.getElementById('season-name').textContent = season.name;
    }
}

function updateScoreUI() {
    scoreValue.textContent = score;
    coinsValue.textContent = coins;
}

function updatePowerupUI() {
    Object.keys(ProgressionManager.POWERUPS).forEach(id => {
        const count = progression.getPowerupCount(id);
        const countEl = document.getElementById(`powerup-${id}-count`);
        if (countEl) countEl.textContent = count;
        
        const btn = document.querySelector(`.powerup-btn[data-powerup="${id}"]`);
        if (btn) btn.classList.toggle('disabled', count <= 0);
    });
}

// ===== UI MESSAGES =====
function showCombo(count) {
    comboDisplay.classList.remove('hidden');
    comboCount.textContent = `${count}x`;
    comboDisplay.classList.remove('jump');
    void comboDisplay.offsetWidth;
    comboDisplay.classList.add('jump');
    
    // Play combo sounds at milestones
    if (count === 5 || count === 10 || count === 15 || count === 20) {
        playSound('combo');
        haptic('medium');
    }
    
    // Level up sound for big combos
    if (count === 25 || count === 50) {
        playSound('levelUp');
        haptic('success');
    }
    
    clearTimeout(comboDisplay.hideTimeout);
    comboDisplay.hideTimeout = setTimeout(() => comboDisplay.classList.add('hidden'), 1000);
}

function showChainCombo(count) {
    chainDisplay.classList.remove('hidden');
    chainCount.textContent = count;
    chainDisplay.classList.remove('jump');
    void chainDisplay.offsetWidth;
    chainDisplay.classList.add('jump');
    
    clearTimeout(chainDisplay.hideTimeout);
    chainDisplay.hideTimeout = setTimeout(() => chainDisplay.classList.add('hidden'), 1500);
}

function showEffectMessage(text, type = '') {
    effectMessage.textContent = text;
    effectMessage.className = type;
    effectMessage.classList.remove('hidden');
    
    clearTimeout(effectMessage.hideTimeout);
    effectMessage.hideTimeout = setTimeout(() => effectMessage.classList.add('hidden'), 2000);
}

function showMegaMessage() {
    const messages = ['FANTASTIC!', 'AMAZING!', 'INCREDIBLE!', 'SUPERB!', 'AWESOME!'];
    megaPopMessage.textContent = messages[Math.floor(Math.random() * messages.length)];
    megaPopMessage.classList.remove('hidden');
    
    clearTimeout(megaPopMessage.hideTimeout);
    megaPopMessage.hideTimeout = setTimeout(() => megaPopMessage.classList.add('hidden'), 1000);
}

function checkReinforcement() {
    const milestones = [10, 25, 50, 75, 100, 150, 200];
    if (milestones.includes(totalPops)) {
        showReinforcement(`🎉 ${totalPops} pops!`);
    }
}

function showReinforcement(text) {
    reinforcementMessage.textContent = text;
    reinforcementMessage.classList.remove('hidden');
    
    clearTimeout(reinforcementMessage.hideTimeout);
    reinforcementMessage.hideTimeout = setTimeout(() => reinforcementMessage.classList.add('hidden'), 1500);
}

function showUnlockNotification(text) {
    document.getElementById('unlock-text').textContent = text;
    unlockNotification.classList.remove('hidden');
    
    // Play sound for discoveries/unlocks (if not already playing another sound)
    if (text.includes('Discovered') || text.includes('Unlock')) {
        playSound('achievement');
    }
    
    setTimeout(() => unlockNotification.classList.add('hidden'), 3000);
}

function showAchievementNotification(achievement) {
    document.getElementById('achievement-popup-icon').textContent = achievement.icon;
    document.getElementById('achievement-popup-name').textContent = achievement.name;
    document.getElementById('achievement-popup-reward').textContent = `+${achievement.reward}🪙`;
    
    achievementNotification.classList.remove('hidden');
    playSound('achievement');
    haptic('success');
    
    setTimeout(() => achievementNotification.classList.add('hidden'), 3000);
}

// ===== GAME LOOP =====
function gameLoop(timestamp) {
    const deltaTime = timestamp - lastFrameTime;
    lastFrameTime = timestamp;
    
    update(deltaTime);
    render();
    
    animationId = requestAnimationFrame(gameLoop);
}

function update(deltaTime) {
    // Update environment
    weatherSystem?.update();
    dynamicBackground?.update();
    screenEffects?.update();
    cursorTrail?.update();
    
    clouds.forEach((c, i) => { if (c.update()) clouds[i] = new Cloud(canvasWidth, canvasHeight); });
    butterflies.forEach(b => b.update());
    
    if (!isPlaying || isPaused) return;
    
    // Timer
    if (timeRemaining !== Infinity && gameTime > 0) {
        timeRemaining -= deltaTime / 1000;
        if (timeRemaining <= 0) {
            endGame('time');
            return;
        }
        updateTimerUI();
    }
    
    // Endless mode timer
    if (currentMode === 'endless') {
        survivalTime += deltaTime / 1000;
        difficultyLevel = 1 + Math.floor(survivalTime / 30);
        updateTimerUI();
    }
    
    // Freeze timer
    if (isFreeze) {
        freezeTimer -= deltaTime;
        if (freezeTimer <= 0) deactivateFreeze();
    }
    
    // Frenzy timer
    if (isFrenzyMode && !gameModes[currentMode].alwaysFrenzy) {
        frenzyTimer -= deltaTime;
        if (frenzyTimer <= 0) endFrenzy();
    }
    
    // Combo decay
    if (comboTimer > 0) {
        comboTimer -= 1;
        if (comboTimer <= 0) combo = 0;
    }
    
    // Update balloons
    for (let i = balloons.length - 1; i >= 0; i--) {
        const b = balloons[i];
        b.update();
        
        // Magnet effect
        if (activePowerups.magnet && !b.isBomb()) {
            const dx = mouseX - b.x;
            const dy = mouseY - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200 && dist > 20) {
                b.x += dx * 0.02;
                b.y += dy * 0.02;
            }
        }
        
        // Remove off-screen or fully popped
        if (b.y < -b.radius * 2 || b.opacity <= 0) {
            if (b === currentBoss) currentBoss = null;
            balloons.splice(i, 1);
        }
    }
    
    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].opacity <= 0) particles.splice(i, 1);
    }
    
    // Update text particles
    for (let i = textParticles.length - 1; i >= 0; i--) {
        textParticles[i].update();
        if (textParticles[i].opacity <= 0) textParticles.splice(i, 1);
    }
    
    // Spawn balloons
    if (Math.random() * getSpawnRate() < 1) {
        spawnBalloon();
    }
}

function updateTimerUI() {
    if (currentMode === 'endless') {
        const mins = Math.floor(survivalTime / 60);
        const secs = Math.floor(survivalTime % 60);
        timerValue.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    } else if (gameTime > 0) {
        const mins = Math.floor(timeRemaining / 60);
        const secs = Math.floor(timeRemaining % 60);
        timerValue.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    } else {
        timerValue.textContent = '∞';
    }
}

function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw background
    const theme = themeManager.getEquippedTheme(progression);
    const bgColors = themeManager.getBackgroundGradient(theme, isPlaying ? score : 0);
    dynamicBackground?.drawAnimatedGradient(ctx, bgColors, isFrenzyMode ? 0.5 : 0);
    
    // Draw weather (stars for night theme)
    const isNight = theme === 'night_bg' || theme === 'galaxy_bg';
    weatherSystem?.draw(ctx, isNight);
    
    // Draw parallax (if enabled)
    dynamicBackground?.draw(ctx, false);
    
    // Draw clouds
    clouds.forEach(c => c.draw(ctx));
    
    // Draw butterflies
    butterflies.forEach(b => b.draw(ctx));
    
    // Draw cursor trail
    cursorTrail?.draw(ctx);
    
    // Draw balloons
    balloons.forEach(b => b.draw(ctx));
    
    // Draw particles
    particles.forEach(p => p.draw(ctx));
    
    // Draw text particles
    textParticles.forEach(t => t.draw(ctx));
    
    // Draw screen effects
    screenEffects?.draw(ctx);
}

// ===== BUTTON HANDLERS =====
function setupButtonHandlers() {
    // Main buttons
    playButton?.addEventListener('click', () => { playSound('click'); startGame(); });
    pauseButton?.addEventListener('click', () => { playSound('click'); togglePause(); });
    resumeButton?.addEventListener('click', () => { playSound('click'); togglePause(); });
    restartButton?.addEventListener('click', () => { playSound('click'); gameoverScreen.classList.add('hidden'); startGame(); });
    restartFromPauseButton?.addEventListener('click', () => { playSound('click'); togglePause(); startGame(); });
    quitButton?.addEventListener('click', () => { playSound('click'); togglePause(); goHome(); });
    homeButton?.addEventListener('click', () => { playSound('click'); goHome(); });
    musicToggle?.addEventListener('click', () => { playSound('click'); toggleMusic(); });
    
    // Mode selection
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            currentMode = btn.dataset.mode;
            playSound('click');
        });
    });
    
    // Power-up buttons
    document.querySelectorAll('.powerup-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.powerup;
            if (type && isPlaying && !isPaused) {
                usePowerup(type);
            }
        });
    });
    
    // Menu buttons
    document.getElementById('shop-button')?.addEventListener('click', () => showScreen('shop'));
    document.getElementById('collection-button')?.addEventListener('click', () => showScreen('collection'));
    document.getElementById('leaderboard-button')?.addEventListener('click', () => showScreen('leaderboard'));
    document.getElementById('stats-button')?.addEventListener('click', () => showScreen('stats'));
    document.getElementById('achievements-button')?.addEventListener('click', () => showScreen('achievements'));
    document.getElementById('challenges-button')?.addEventListener('click', () => showScreen('challenges'));
    document.getElementById('weekly-button')?.addEventListener('click', () => showScreen('weekly'));
    document.getElementById('album-button')?.addEventListener('click', () => showScreen('album'));
    document.getElementById('prestige-button')?.addEventListener('click', () => showScreen('prestige'));
    document.getElementById('settings-button')?.addEventListener('click', () => showScreen('settings'));
    
    // Back buttons
    document.getElementById('shop-back-button')?.addEventListener('click', () => hideScreen('shop'));
    document.getElementById('collection-back-button')?.addEventListener('click', () => hideScreen('collection'));
    document.getElementById('leaderboard-back-button')?.addEventListener('click', () => hideScreen('leaderboard'));
    document.getElementById('stats-back-button')?.addEventListener('click', () => hideScreen('stats'));
    document.getElementById('achievements-back-button')?.addEventListener('click', () => hideScreen('achievements'));
    document.getElementById('challenges-back-button')?.addEventListener('click', () => hideScreen('challenges'));
    document.getElementById('weekly-back-button')?.addEventListener('click', () => hideScreen('weekly'));
    document.getElementById('album-back-button')?.addEventListener('click', () => hideScreen('album'));
    document.getElementById('prestige-back-button')?.addEventListener('click', () => hideScreen('prestige'));
    document.getElementById('settings-back-button')?.addEventListener('click', () => hideScreen('settings'));
    
    // Daily bonus
    document.getElementById('claim-bonus-btn')?.addEventListener('click', claimDailyBonus);
    
    // Settings
    setupSettingsHandlers();
    
    // Tutorial
    setupTutorialHandlers();
    
    // Prestige
    document.getElementById('prestige-btn')?.addEventListener('click', performPrestige);
    
    // Tabs
    setupTabHandlers();
}

function showScreen(name) {
    playSound('click');
    startScreen.classList.add('hidden');
    
    const screen = document.getElementById(`${name}-screen`);
    if (screen) {
        screen.classList.remove('hidden');
        populateScreen(name);
    }
}

function hideScreen(name) {
    playSound('click');
    const screen = document.getElementById(`${name}-screen`);
    if (screen) screen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    updateStartScreenUI();
}

function populateScreen(name) {
    switch (name) {
        case 'shop': populateShop(); break;
        case 'collection': populateCollection(); break;
        case 'leaderboard': populateLeaderboard(); break;
        case 'stats': populateStats(); break;
        case 'achievements': populateAchievements(); break;
        case 'challenges': populateChallenges(); break;
        case 'weekly': populateWeeklyChallenges(); break;
        case 'album': populateAlbum(); break;
        case 'prestige': populatePrestige(); break;
    }
}

// ===== SCREEN POPULATORS =====
function populateShop() {
    document.getElementById('shop-coins-value').textContent = progression.data.coins;
    document.getElementById('shop-gems-value').textContent = progression.data.gems;
    
    const grid = document.getElementById('shop-grid');
    const activeTab = document.querySelector('#shop-tabs .tab-btn.active')?.dataset.tab || 'themes';
    
    const items = ProgressionManager.SHOP_ITEMS.filter(item => {
        if (activeTab === 'themes') return item.type === 'theme';
        if (activeTab === 'balloons') return item.type === 'balloons';
        if (activeTab === 'sounds') return item.type === 'sound';
        if (activeTab === 'trails') return item.type === 'trail';
        if (activeTab === 'powerups') return false;
        return false;
    });
    
    if (activeTab === 'powerups') {
        grid.innerHTML = Object.entries(ProgressionManager.POWERUPS).map(([id, p]) => `
            <div class="shop-item can-afford" data-powerup="${id}">
                <span style="font-size:1.8rem">${p.name.split(' ')[0]}</span>
                <span class="item-price">${p.price}🪙</span>
            </div>
        `).join('');
        
        grid.querySelectorAll('.shop-item').forEach(el => {
            el.addEventListener('click', () => {
                const id = el.dataset.powerup;
                if (progression.buyPowerup(id)) {
                    populateShop();
                    showUnlockNotification(`Bought ${ProgressionManager.POWERUPS[id].name}!`);
                }
            });
        });
        return;
    }
    
    grid.innerHTML = items.map(item => {
        const owned = progression.isPurchased(item.id);
        const canAfford = progression.data.coins >= item.price;
        return `
            <div class="shop-item ${owned ? 'owned' : ''} ${canAfford && !owned ? 'can-afford' : ''}" data-id="${item.id}">
                <span style="font-size:1.8rem">${item.name.split(' ')[0]}</span>
                ${owned ? '<span class="item-owned">✓</span>' : `<span class="item-price">${item.price}🪙</span>`}
            </div>
        `;
    }).join('');
    
    grid.querySelectorAll('.shop-item:not(.owned)').forEach(el => {
        el.addEventListener('click', () => {
            const id = el.dataset.id;
            if (progression.purchaseItem(id)) {
                populateShop();
                const item = ProgressionManager.SHOP_ITEMS.find(i => i.id === id);
                showUnlockNotification(`Bought ${item.name}!`);
            }
        });
    });
}

function populateCollection() {
    const grid = document.getElementById('collection-grid');
    const activeTab = document.querySelector('#collection-tabs .tab-btn.active')?.dataset.tab || 'themes';
    
    // Combine unlocks and purchases
    const allItems = [...ProgressionManager.UNLOCKS, ...ProgressionManager.SHOP_ITEMS]
        .filter(item => {
            if (activeTab === 'themes') return item.type === 'theme';
            if (activeTab === 'balloons') return item.type === 'balloons';
            if (activeTab === 'sounds') return item.type === 'sound';
            if (activeTab === 'trails') return item.type === 'trail';
            return false;
        });
    
    // Add default
    const defaultItem = { id: 'default', name: '🎈 Default', type: activeTab.slice(0, -1) };
    const items = [defaultItem, ...allItems];
    
    // Map tab names to equipped keys
    const equippedKeyMap = {
        'themes': 'equippedTheme',
        'balloons': 'equippedBalloons',
        'sounds': 'equippedSound',
        'trails': 'equippedTrail'
    };
    const equippedKey = equippedKeyMap[activeTab] || 'equippedTheme';
    const equipped = progression.data[equippedKey] || 'default';
    
    grid.innerHTML = items.map(item => {
        const unlocked = progression.isUnlocked(item.id) || item.id === 'default';
        const isEquipped = equipped === item.id;
        return `
            <div class="collection-item ${unlocked ? '' : 'locked'} ${isEquipped ? 'equipped' : ''}" data-id="${item.id}" data-type="${activeTab.slice(0, -1)}">
                <span style="font-size:1.8rem">${item.name.split(' ')[0]}</span>
                ${!unlocked ? '<span class="lock-overlay">🔒</span>' : ''}
            </div>
        `;
    }).join('');
    
    grid.querySelectorAll('.collection-item:not(.locked)').forEach(el => {
        el.addEventListener('click', () => {
            const id = el.dataset.id;
            const type = el.dataset.type;
            progression.equipItem(type, id);
            populateCollection();
        });
    });
}

function populateLeaderboard() {
    const list = document.getElementById('leaderboard-list');
    const activeTab = document.querySelector('#leaderboard-tabs .tab-btn.active')?.dataset.tab || 'local';
    
    if (activeTab === 'local') {
        // Show local stats
        const stats = progression.getStatistics();
        list.innerHTML = `
            <div class="leaderboard-item rank-1">
                <span class="leaderboard-rank">🏆</span>
                <span class="leaderboard-name">Your Best</span>
                <span class="leaderboard-score">${stats.highScore}</span>
            </div>
            <div class="leaderboard-item">
                <span class="leaderboard-rank">⭐</span>
                <span class="leaderboard-name">Total Stars</span>
                <span class="leaderboard-score">${progression.data.totalStars}</span>
            </div>
            <div class="leaderboard-item">
                <span class="leaderboard-rank">🎮</span>
                <span class="leaderboard-name">Games</span>
                <span class="leaderboard-score">${stats.gamesPlayed}</span>
            </div>
        `;
    } else {
        // Global leaderboard (placeholder)
        list.innerHTML = '<div class="leaderboard-item"><span>Loading...</span></div>';
        // In production, fetch from Firebase
    }
}

function populateStats() {
    const stats = progression.getStatistics();
    
    document.getElementById('stat-high-score').textContent = stats.highScore.toLocaleString();
    document.getElementById('stat-total-pops').textContent = stats.totalPops.toLocaleString();
    document.getElementById('stat-games-played').textContent = stats.gamesPlayed.toLocaleString();
    document.getElementById('stat-max-combo').textContent = `${stats.maxCombo}x`;
    document.getElementById('stat-play-time').textContent = `${Math.floor(stats.totalPlayTime / 3600)}h`;
    document.getElementById('stat-avg-score').textContent = stats.averageScore.toLocaleString();
    
    // Mode stats
    const modeGrid = document.getElementById('mode-stats-grid');
    modeGrid.innerHTML = Object.entries(stats.modeStats).map(([mode, data]) => `
        <div class="mode-stat-item">
            <div class="mode-stat-name">${mode}</div>
            <div class="mode-stat-score">${data.bestScore}</div>
            <div class="mode-stat-name">${data.played} played</div>
        </div>
    `).join('');
    
    // Rare collection
    const rareGrid = document.getElementById('rare-stats-grid');
    const rareCollection = progression.getRareCollection();
    const rareDiscovered = progression.getRareDiscovered();
    const rareTypes = [
        { id: 'rainbow', icon: '🌈' },
        { id: 'star', icon: '⭐' },
        { id: 'alien', icon: '👽' },
        { id: 'unicorn', icon: '🦄' },
        { id: 'diamond', icon: '💎' }
    ];
    
    rareGrid.innerHTML = rareTypes.map(r => `
        <div class="rare-item ${rareDiscovered.includes(r.id) ? '' : 'locked'}">
            <div class="rare-icon">${r.icon}</div>
            <div class="rare-count">${rareCollection[r.id] || 0}</div>
        </div>
    `).join('');
}

function populateAchievements() {
    const achievements = progression.getAchievements();
    const unlocked = achievements.filter(a => a.unlocked).length;
    
    document.getElementById('achievement-points-value').textContent = progression.data.achievementPoints;
    document.getElementById('achievements-unlocked').textContent = unlocked;
    document.getElementById('achievements-total').textContent = achievements.length;
    
    const grid = document.getElementById('achievements-grid');
    grid.innerHTML = achievements.map(a => `
        <div class="achievement-item ${a.unlocked ? 'unlocked' : 'locked'}">
            <span class="achievement-icon">${a.icon}</span>
            <div class="achievement-info">
                <div class="achievement-name">${a.name}</div>
                <div class="achievement-desc">${a.desc}</div>
                <div class="achievement-reward">+${a.reward}🪙</div>
            </div>
            ${a.unlocked ? '<span class="achievement-check">✓</span>' : ''}
        </div>
    `).join('');
}

function populateChallenges() {
    const challenges = progression.getDailyChallenges();
    document.getElementById('streak-count').textContent = progression.getChallengeStreak();
    
    const list = document.getElementById('challenges-list');
    list.innerHTML = challenges.map(c => {
        const progress = Math.min(c.progress / c.target * 100, 100);
        return `
            <div class="challenge-item ${c.completed ? 'completed' : ''} ${c.claimed ? 'claimed' : ''}">
                <div class="challenge-desc">${c.desc}</div>
                <div class="challenge-progress-bar">
                    <div class="challenge-progress-fill" style="width: ${progress}%"></div>
                </div>
                <div class="challenge-row">
                    <span class="challenge-progress-text">${c.progress}/${c.target}</span>
                    <span class="challenge-reward">+${c.reward}🪙</span>
                    ${c.completed && !c.claimed ? `<button class="claim-btn" data-id="${c.id}">Claim</button>` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    list.querySelectorAll('.claim-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const reward = progression.claimChallengeReward(btn.dataset.id);
            if (reward) {
                showUnlockNotification(`+${reward}🪙 claimed!`);
                playSound('coin');
                haptic('medium');
                populateChallenges();
            }
        });
    });
}

function populateWeeklyChallenges() {
    const challenges = progression.checkWeeklyChallenges();
    document.getElementById('weekly-streak-count').textContent = progression.data.weeklyStreak;
    
    // Calculate time remaining
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilReset = (7 - dayOfWeek) % 7 || 7;
    document.getElementById('weekly-time-remaining').textContent = `${daysUntilReset}d`;
    
    const list = document.getElementById('weekly-challenges-list');
    list.innerHTML = challenges.map(c => {
        const progress = Math.min((c.progress / c.target) * 100, 100);
        return `
            <div class="challenge-item ${c.completed ? 'completed' : ''} ${c.claimed ? 'claimed' : ''}">
                <div class="challenge-desc">${c.desc}</div>
                <div class="challenge-progress-bar">
                    <div class="challenge-progress-fill" style="width: ${progress}%"></div>
                </div>
                <div class="challenge-row">
                    <span class="challenge-progress-text">${c.progress || 0}/${c.target}</span>
                    <span class="challenge-reward">+${c.reward}🪙</span>
                    ${c.completed && !c.claimed ? `<button class="claim-btn" data-id="${c.id}">Claim</button>` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    list.querySelectorAll('.claim-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const reward = progression.claimWeeklyChallengeReward(btn.dataset.id);
            if (reward) {
                showUnlockNotification(`+${reward}🪙 claimed!`);
                playSound('levelUp'); // Weekly rewards are bigger, use level up sound
                haptic('success');
                populateWeeklyChallenges();
            }
        });
    });
}

function populateAlbum() {
    const albumProgress = progression.getAlbumProgress();
    
    // Normal balloons
    const normal = albumProgress.normalBalloons;
    document.getElementById('normal-count').textContent = normal.count;
    document.getElementById('normal-next').textContent = normal.nextMilestone || 'MAX';
    document.getElementById('normal-reward').textContent = normal.nextReward || 0;
    document.getElementById('normal-progress').style.width = normal.nextMilestone ? 
        `${(normal.count / normal.nextMilestone) * 100}%` : '100%';
    
    // Special balloons
    const special = albumProgress.specialBalloons;
    document.getElementById('special-count').textContent = special.count;
    document.getElementById('special-next').textContent = special.nextMilestone || 'MAX';
    document.getElementById('special-reward').textContent = special.nextReward || 0;
    document.getElementById('special-progress').style.width = special.nextMilestone ?
        `${(special.count / special.nextMilestone) * 100}%` : '100%';
    
    // Rare balloons
    const rare = albumProgress.rareBalloons;
    document.getElementById('rare-count').textContent = rare.count;
    document.getElementById('rare-next').textContent = rare.nextMilestone || 'MAX';
    document.getElementById('rare-reward').textContent = rare.nextReward || 0;
    document.getElementById('rare-progress').style.width = rare.nextMilestone ?
        `${(rare.count / rare.nextMilestone) * 100}%` : '100%';
    
    // Boss balloons
    const boss = albumProgress.bossBalloons;
    document.getElementById('boss-count').textContent = boss.count;
    document.getElementById('boss-next').textContent = boss.nextMilestone || 'MAX';
    document.getElementById('boss-reward').textContent = boss.nextReward || 0;
    document.getElementById('boss-progress').style.width = boss.nextMilestone ?
        `${(boss.count / boss.nextMilestone) * 100}%` : '100%';
    
    // Rare gallery
    const rareDiscovered = progression.getRareDiscovered();
    const rareTypes = [
        { id: 'rainbow', icon: '🌈', name: 'Rainbow' },
        { id: 'star', icon: '⭐', name: 'Star' },
        { id: 'alien', icon: '👽', name: 'Alien' },
        { id: 'unicorn', icon: '🦄', name: 'Unicorn' },
        { id: 'diamond', icon: '💎', name: 'Diamond' }
    ];
    
    document.getElementById('rare-gallery-grid').innerHTML = rareTypes.map(r => `
        <div class="rare-gallery-item ${rareDiscovered.includes(r.id) ? '' : 'undiscovered'}">
            <div class="rare-gallery-icon">${r.icon}</div>
            <div class="rare-gallery-name">${rareDiscovered.includes(r.id) ? r.name : '???'}</div>
        </div>
    `).join('');
}

function populatePrestige() {
    const info = progression.getPrestigeInfo();
    
    document.getElementById('current-prestige-level').textContent = info.currentLevel;
    document.getElementById('current-multiplier').textContent = info.currentMultiplier.toFixed(1);
    document.getElementById('lifetime-stars').textContent = info.starsProgress.toLocaleString();
    document.getElementById('prestige-requirement').textContent = info.starsRequired?.toLocaleString() || 'MAX';
    
    const progress = info.starsRequired ? (info.starsProgress / info.starsRequired) * 100 : 100;
    document.getElementById('prestige-progress-fill').style.width = `${Math.min(progress, 100)}%`;
    
    if (info.nextReward) {
        document.getElementById('prestige-gems').textContent = info.nextReward.gems;
        document.getElementById('prestige-coins').textContent = info.nextReward.coins.toLocaleString();
        document.getElementById('prestige-new-mult').textContent = info.nextMultiplier.toFixed(1);
    }
    
    const btn = document.getElementById('prestige-btn');
    btn.disabled = !progression.canPrestige();
}

function performPrestige() {
    if (!progression.canPrestige()) return;
    
    if (confirm('Are you sure you want to prestige? Your stars and rank will reset, but you\'ll get rewards and a permanent bonus!')) {
        const result = progression.performPrestige();
        if (result) {
            showUnlockNotification(`⭐ Prestige ${progression.data.prestigeLevel}! +${result.reward.coins}🪙 +${result.reward.gems}💎`);
            playSound('levelUp');
            haptic('success');
            populatePrestige();
        }
    }
}

function claimDailyBonus() {
    const result = progression.claimDailyBonus();
    if (result) {
        let message = `+${result.coins}🪙`;
        if (result.gems > 0) message += ` +${result.gems}💎`;
        showUnlockNotification(`Daily Bonus! ${message}`);
        playSound('levelUp');
        haptic('success');
        document.getElementById('daily-bonus').classList.add('hidden');
        updateStartScreenUI();
    }
}

// ===== SETTINGS =====
function setupSettingsHandlers() {
    document.getElementById('music-volume')?.addEventListener('input', (e) => {
        const val = e.target.value / 100;
        document.getElementById('music-volume-value').textContent = `${e.target.value}%`;
        musicVolume = val;
        if (sounds.bgm) sounds.bgm.volume(val);
        progression.updateSettings({ musicVolume: val });
    });
    
    document.getElementById('sfx-volume')?.addEventListener('input', (e) => {
        const val = e.target.value / 100;
        document.getElementById('sfx-volume-value').textContent = `${e.target.value}%`;
        sfxVolume = val;
        progression.updateSettings({ sfxVolume: val });
    });
    
    document.getElementById('colorblind-mode')?.addEventListener('change', (e) => {
        progression.updateSettings({ colorblindMode: e.target.checked });
    });
    
    document.getElementById('reduced-motion')?.addEventListener('change', (e) => {
        progression.updateSettings({ reducedMotion: e.target.checked });
    });
    
    document.getElementById('haptic-feedback')?.addEventListener('change', (e) => {
        progression.updateSettings({ hapticFeedback: e.target.checked });
    });
    
    document.getElementById('show-tutorial')?.addEventListener('change', (e) => {
        progression.updateSettings({ showTutorial: e.target.checked });
    });
    
    document.getElementById('auto-save')?.addEventListener('change', (e) => {
        progression.updateSettings({ autoSave: e.target.checked });
    });
    
    document.getElementById('reset-tutorial-btn')?.addEventListener('click', () => {
        progression.data.tutorialCompleted = false;
        progression.data.tutorialStep = 0;
        progression.updateSettings({ showTutorial: true });
        progression.save();
        showUnlockNotification('Tutorial reset!');
    });
    
    document.getElementById('reset-progress-btn')?.addEventListener('click', () => {
        if (confirm('Are you SURE? This will delete ALL your progress!')) {
            if (confirm('This cannot be undone. Are you absolutely sure?')) {
                localStorage.removeItem('balloonPop_progression');
                location.reload();
            }
        }
    });
}

// ===== TUTORIAL =====
let currentTutorialStep = 0;

function showTutorial() {
    currentTutorialStep = 0;
    tutorialScreen.classList.remove('hidden');
    startScreen.classList.add('hidden');
    updateTutorialStep();
}

function setupTutorialHandlers() {
    document.getElementById('tutorial-next')?.addEventListener('click', () => {
        currentTutorialStep++;
        if (currentTutorialStep >= 6) {
            completeTutorial();
        } else {
            updateTutorialStep();
        }
    });
    
    document.getElementById('tutorial-skip')?.addEventListener('click', completeTutorial);
    
    document.querySelectorAll('.tutorial-dots .dot').forEach(dot => {
        dot.addEventListener('click', () => {
            currentTutorialStep = parseInt(dot.dataset.step);
            updateTutorialStep();
        });
    });
}

function updateTutorialStep() {
    document.querySelectorAll('.tutorial-step').forEach(step => {
        step.classList.toggle('hidden', parseInt(step.dataset.step) !== currentTutorialStep);
    });
    document.querySelectorAll('.tutorial-dots .dot').forEach(dot => {
        dot.classList.toggle('active', parseInt(dot.dataset.step) === currentTutorialStep);
    });
    
    const nextBtn = document.getElementById('tutorial-next');
    if (nextBtn) {
        nextBtn.textContent = currentTutorialStep >= 5 ? 'Start Playing!' : 'Next →';
    }
}

function completeTutorial() {
    progression.completeTutorial();
    tutorialScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    showUnlockNotification('Tutorial complete! +50🪙');
    updateStartScreenUI();
}

// ===== TABS =====
function setupTabHandlers() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const parent = btn.parentElement;
            parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const screenId = parent.id?.replace('-tabs', '');
            if (screenId) populateScreen(screenId);
        });
    });
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', init);
