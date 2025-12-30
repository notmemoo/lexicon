/**
 * ProgressionManager - Enhanced with Weekly Challenges, Prestige, Rank Rewards, Collection Album
 */
class ProgressionManager {
    constructor() {
        this.storageKey = 'balloonPop_progression';
        this.data = this.load();
        this.checkDailyBonus();
        this.checkWeeklyChallenges();
        this.checkSeasonalEvent();
    }

    getDefaultData() {
        return {
            // Core stats
            totalStars: 0,
            highScore: 0,
            currentStreak: 0,
            lastPlayDate: null,
            gamesPlayed: 0,
            totalPops: 0,
            maxCombo: 0,
            bombsAvoided: 0,
            totalPlayTime: 0,
            
            // Currency
            coins: 0,
            totalCoinsEarned: 0,
            gems: 0, // Premium currency
            
            // Daily system
            lastLoginDate: null,
            dailyBonusClaimed: false,
            loginStreak: 0,
            
            // Equipment
            equippedTheme: 'default',
            equippedCursor: 'default',
            equippedBalloons: 'default',
            equippedSound: 'default',
            equippedTrail: 'default',
            
            // Unlocks
            unlockedItems: ['default'],
            purchasedItems: [],
            
            // Rank system
            rank: 'beginner',
            rankRewardsClaimed: [],
            
            // Power-ups
            powerups: {
                magnet: 0,
                doubleScore: 0,
                shield: 0,
                slowmo: 0,
                autoPopBonus: 0,
                coinMagnet: 0
            },
            
            // Rare balloon collection
            rareCollection: {
                rainbow: 0,
                star: 0,
                alien: 0,
                unicorn: 0,
                diamond: 0
            },
            rareDiscovered: [],
            
            // Collection album
            albumProgress: {
                normalBalloons: { popped: 0, milestone: 0 },
                specialBalloons: { popped: 0, milestone: 0 },
                rareBalloons: { popped: 0, milestone: 0 },
                bossBalloons: { defeated: 0, milestone: 0 }
            },
            
            // Daily challenges
            dailyChallenges: [],
            challengeStreak: 0,
            lastChallengeDate: null,
            challengesCompleted: 0,
            
            // Weekly challenges
            weeklyChallenges: [],
            weeklyStreak: 0,
            lastWeeklyDate: null,
            weeklyCompleted: 0,
            
            // Achievements
            achievements: [],
            achievementPoints: 0,
            
            // Prestige system
            prestigeLevel: 0,
            prestigeMultiplier: 1.0,
            lifetimeStars: 0,
            lifetimeCoins: 0,
            
            // Season/Events
            currentSeason: null,
            seasonProgress: 0,
            seasonRewardsClaimed: [],
            eventParticipation: {},
            
            // Settings
            settings: {
                musicVolume: 0.5,
                sfxVolume: 0.7,
                hapticFeedback: true,
                colorblindMode: false,
                reducedMotion: false,
                showTutorial: true,
                autoSave: true
            },
            
            // Statistics for dashboard
            statistics: {
                gamesPerDay: {},
                scoreHistory: [],
                favoriteMode: 'classic',
                modeStats: {
                    classic: { played: 0, bestScore: 0, totalScore: 0 },
                    zen: { played: 0, bestScore: 0, totalScore: 0 },
                    survival: { played: 0, bestScore: 0, totalScore: 0 },
                    frenzy: { played: 0, bestScore: 0, totalScore: 0 },
                    target: { played: 0, bestScore: 0, totalScore: 0 },
                    bossRush: { played: 0, bestScore: 0, totalScore: 0 },
                    endless: { played: 0, bestScore: 0, totalScore: 0 },
                    puzzle: { played: 0, bestScore: 0, totalScore: 0 }
                },
                balloonTypeStats: {},
                averageScore: 0,
                bestCombo: 0,
                longestGame: 0
            },
            
            // Tutorial progress
            tutorialCompleted: false,
            tutorialStep: 0
        };
    }

    load() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const data = { ...this.getDefaultData(), ...JSON.parse(saved) };
                // Ensure nested objects are properly merged
                data.settings = { ...this.getDefaultData().settings, ...data.settings };
                data.statistics = { ...this.getDefaultData().statistics, ...data.statistics };
                data.albumProgress = { ...this.getDefaultData().albumProgress, ...data.albumProgress };
                data.powerups = { ...this.getDefaultData().powerups, ...data.powerups };
                return data;
            }
        } catch (e) {
            console.warn('Failed to load progression:', e);
        }
        return this.getDefaultData();
    }

    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (e) {
            console.warn('Failed to save progression:', e);
        }
    }

    // ===== COINS & CURRENCY =====
    addCoins(amount) {
        const multipliedAmount = Math.floor(amount * this.data.prestigeMultiplier);
        this.data.coins += multipliedAmount;
        this.data.totalCoinsEarned += multipliedAmount;
        this.data.lifetimeCoins += multipliedAmount;
        this.save();
        return multipliedAmount;
    }

    spendCoins(amount) {
        if (this.data.coins >= amount) {
            this.data.coins -= amount;
            this.save();
            return true;
        }
        return false;
    }

    getCoins() {
        return this.data.coins;
    }

    addGems(amount) {
        this.data.gems += amount;
        this.save();
        return this.data.gems;
    }

    spendGems(amount) {
        if (this.data.gems >= amount) {
            this.data.gems -= amount;
            this.save();
            return true;
        }
        return false;
    }

    // ===== DAILY BONUS =====
    checkDailyBonus() {
        const today = new Date().toDateString();
        if (this.data.lastLoginDate !== today) {
            // Check if consecutive day
            const lastDate = this.data.lastLoginDate ? new Date(this.data.lastLoginDate) : null;
            const todayDate = new Date(today);
            
            if (lastDate) {
                const diffDays = Math.round((todayDate - lastDate) / (1000 * 60 * 60 * 24));
                if (diffDays === 1) {
                    this.data.loginStreak++;
                } else if (diffDays > 1) {
                    this.data.loginStreak = 1;
                }
            } else {
                this.data.loginStreak = 1;
            }
            
            this.data.lastLoginDate = today;
            this.data.dailyBonusClaimed = false;
            this.save();
        }
    }

    claimDailyBonus() {
        if (!this.data.dailyBonusClaimed) {
            this.data.dailyBonusClaimed = true;
            
            // Base bonus + streak bonus
            const baseBonus = 25;
            const streakBonus = Math.min(this.data.loginStreak * 5, 50);
            const totalBonus = baseBonus + streakBonus;
            
            this.addCoins(totalBonus);
            
            // Bonus gem every 7 days
            if (this.data.loginStreak % 7 === 0) {
                this.addGems(1);
            }
            
            this.save();
            return { coins: totalBonus, gems: this.data.loginStreak % 7 === 0 ? 1 : 0, streak: this.data.loginStreak };
        }
        return null;
    }

    canClaimDailyBonus() {
        return !this.data.dailyBonusClaimed;
    }

    // ===== STARS =====
    addStars(amount) {
        const multipliedAmount = Math.floor(amount * this.data.prestigeMultiplier);
        this.data.totalStars += multipliedAmount;
        this.data.lifetimeStars += multipliedAmount;
        this.checkUnlocks();
        this.checkRankUp();
        this.save();
        return multipliedAmount;
    }

    updateHighScore(score) {
        if (score > this.data.highScore) {
            this.data.highScore = score;
            this.save();
            return true;
        }
        return false;
    }

    recordGamePlayed(mode = 'classic', score = 0, playTime = 0) {
        this.data.gamesPlayed++;
        this.data.totalPlayTime += playTime;
        
        // Update mode stats
        if (this.data.statistics.modeStats[mode]) {
            this.data.statistics.modeStats[mode].played++;
            this.data.statistics.modeStats[mode].totalScore += score;
            if (score > this.data.statistics.modeStats[mode].bestScore) {
                this.data.statistics.modeStats[mode].bestScore = score;
            }
        }
        
        // Update daily games
        const today = new Date().toDateString();
        if (!this.data.statistics.gamesPerDay[today]) {
            this.data.statistics.gamesPerDay[today] = 0;
        }
        this.data.statistics.gamesPerDay[today]++;
        
        // Update score history (keep last 50)
        this.data.statistics.scoreHistory.push({ date: today, score, mode });
        if (this.data.statistics.scoreHistory.length > 50) {
            this.data.statistics.scoreHistory.shift();
        }
        
        // Update average
        const totalScores = this.data.statistics.scoreHistory.reduce((sum, s) => sum + s.score, 0);
        this.data.statistics.averageScore = Math.floor(totalScores / this.data.statistics.scoreHistory.length);
        
        // Update favorite mode
        let maxPlayed = 0;
        Object.entries(this.data.statistics.modeStats).forEach(([m, stats]) => {
            if (stats.played > maxPlayed) {
                maxPlayed = stats.played;
                this.data.statistics.favoriteMode = m;
            }
        });
        
        // Update longest game
        if (playTime > this.data.statistics.longestGame) {
            this.data.statistics.longestGame = playTime;
        }
        
        // Streak handling
        if (this.data.lastPlayDate === today) {
            // Already played today
        } else if (this.data.lastPlayDate === new Date(Date.now() - 86400000).toDateString()) {
            this.data.currentStreak++;
        } else {
            this.data.currentStreak = 1;
        }
        this.data.lastPlayDate = today;
        
        this.save();
    }

    // ===== UNLOCKS (Star-based, free) =====
    static UNLOCKS = [
        { id: 'sunset_bg', type: 'theme', name: '🌅 Sunset Sky', stars: 50 },
        { id: 'pink_balloons', type: 'balloons', name: '🎀 Pink Dreams', stars: 100 },
        { id: 'night_bg', type: 'theme', name: '🌙 Night Sky', stars: 200 },
        { id: 'rainbow_balloons', type: 'balloons', name: '🌈 Rainbow Pop', stars: 350 },
        { id: 'galaxy_bg', type: 'theme', name: '🌌 Galaxy', stars: 500 },
        { id: 'sparkle_trail', type: 'trail', name: '✨ Sparkle Trail', stars: 750 },
        { id: 'neon_trail', type: 'trail', name: '💡 Neon Trail', stars: 1000 },
    ];

    // ===== SHOP ITEMS =====
    static SHOP_ITEMS = [
        // Themes
        { id: 'neon_theme', type: 'theme', name: '🌃 Neon Nights', price: 350 },
        { id: 'ocean_theme', type: 'theme', name: '🌊 Ocean Depths', price: 400 },
        { id: 'lava_theme', type: 'theme', name: '🌋 Volcano', price: 500 },
        { id: 'sakura_theme', type: 'theme', name: '🌸 Sakura', price: 450 },
        { id: 'aurora_theme', type: 'theme', name: '🌌 Aurora', price: 550 },
        { id: 'candy_theme', type: 'theme', name: '🍬 Candy Land', price: 600 },
        { id: 'winter_theme', type: 'theme', name: '❄️ Winter', price: 500 },
        { id: 'halloween_theme', type: 'theme', name: '🎃 Halloween', price: 550 },

        // Balloons
        { id: 'pastel_balloons', type: 'balloons', name: '🎀 Pastel', price: 250 },
        { id: 'neon_balloons', type: 'balloons', name: '💡 Neon Glow', price: 350 },
        { id: 'lava_balloons', type: 'balloons', name: '🔥 Magma', price: 400 },
        { id: 'crystal_balloons', type: 'balloons', name: '💎 Crystal', price: 450 },
        { id: 'galaxy_balloons', type: 'balloons', name: '✨ Galaxy', price: 500 },
        { id: 'emoji_balloons', type: 'balloons', name: '😊 Emoji', price: 350 },

        // Sounds
        { id: 'retro_sounds', type: 'sound', name: '🕹️ Retro Beeps', price: 175 },
        { id: 'magical_sounds', type: 'sound', name: '✨ Magical', price: 250 },
        { id: 'nature_sounds', type: 'sound', name: '🌿 Nature', price: 200 },
        { id: 'arcade_sounds', type: 'sound', name: '🎮 Arcade', price: 300 },
        { id: 'asmr_sounds', type: 'sound', name: '🎧 ASMR', price: 350 },

        // Trails
        { id: 'rainbow_trail', type: 'trail', name: '🌈 Rainbow', price: 400 },
        { id: 'fire_trail', type: 'trail', name: '🔥 Fire', price: 450 },
        { id: 'ice_trail', type: 'trail', name: '❄️ Ice', price: 450 },
        { id: 'hearts_trail', type: 'trail', name: '💕 Hearts', price: 500 },
    ];

    // ===== POWER-UPS =====
    static POWERUPS = {
        magnet: { name: '🧲 Magnet', desc: 'Attract balloons to cursor', price: 50, duration: 8000 },
        doubleScore: { name: '2️⃣ Double Score', desc: '2x points for 15 seconds', price: 75, duration: 15000 },
        shield: { name: '🛡️ Shield', desc: 'Block 1 bomb hit', price: 100, duration: 0 },
        slowmo: { name: '⏱️ Slow-Mo', desc: 'Slow all balloons for 10s', price: 60, duration: 10000 },
        autoPopBonus: { name: '🎯 Auto-Pop', desc: 'Auto-pop 5 random balloons', price: 80, duration: 0 },
        coinMagnet: { name: '🪙 Coin Magnet', desc: '2x coins for 20 seconds', price: 65, duration: 20000 }
    };

    // ===== RANKS =====
    static RANKS = [
        { id: 'beginner', name: 'Beginner', emoji: '🎈', minStars: 0, reward: { coins: 0 } },
        { id: 'popper', name: 'Popper', emoji: '💥', minStars: 100, reward: { coins: 50, powerup: 'magnet' } },
        { id: 'collector', name: 'Collector', emoji: '⭐', minStars: 300, reward: { coins: 100, powerup: 'doubleScore' } },
        { id: 'champion', name: 'Champion', emoji: '🏅', minStars: 750, reward: { coins: 200, powerup: 'shield' } },
        { id: 'master', name: 'Pop Master', emoji: '🎯', minStars: 1500, reward: { coins: 400, gems: 1 } },
        { id: 'grandmaster', name: 'Grand Master', emoji: '👑', minStars: 3000, reward: { coins: 750, gems: 2 } },
        { id: 'legend', name: 'Legend', emoji: '🌟', minStars: 5000, reward: { coins: 1000, gems: 3 } },
        { id: 'mythic', name: 'Mythic', emoji: '🔮', minStars: 10000, reward: { coins: 2000, gems: 5 } }
    ];

    checkRankUp() {
        let newRank = ProgressionManager.RANKS[0];
        for (const rank of ProgressionManager.RANKS) {
            if (this.data.totalStars >= rank.minStars) {
                newRank = rank;
            }
        }
        
        const rankChanged = this.data.rank !== newRank.id;
        this.data.rank = newRank.id;
        
        return rankChanged ? newRank : null;
    }

    claimRankReward(rankId) {
        if (this.data.rankRewardsClaimed.includes(rankId)) return null;
        
        const rank = ProgressionManager.RANKS.find(r => r.id === rankId);
        if (!rank) return null;
        
        // Check if player has reached this rank
        const currentRankIndex = ProgressionManager.RANKS.findIndex(r => r.id === this.data.rank);
        const targetRankIndex = ProgressionManager.RANKS.findIndex(r => r.id === rankId);
        
        if (targetRankIndex > currentRankIndex) return null;
        
        this.data.rankRewardsClaimed.push(rankId);
        
        // Give rewards
        if (rank.reward.coins) this.addCoins(rank.reward.coins);
        if (rank.reward.gems) this.addGems(rank.reward.gems);
        if (rank.reward.powerup) {
            this.data.powerups[rank.reward.powerup] = (this.data.powerups[rank.reward.powerup] || 0) + 1;
        }
        
        this.save();
        return rank.reward;
    }

    getUnclaimedRankRewards() {
        const currentRankIndex = ProgressionManager.RANKS.findIndex(r => r.id === this.data.rank);
        return ProgressionManager.RANKS.slice(0, currentRankIndex + 1).filter(
            r => !this.data.rankRewardsClaimed.includes(r.id) && r.reward.coins > 0
        );
    }

    getCurrentRank() {
        return ProgressionManager.RANKS.find(r => r.id === this.data.rank) || ProgressionManager.RANKS[0];
    }

    getNextRank() {
        const currentIndex = ProgressionManager.RANKS.findIndex(r => r.id === this.data.rank);
        return ProgressionManager.RANKS[currentIndex + 1] || null;
    }

    // ===== WEEKLY CHALLENGES =====
    static WEEKLY_CHALLENGE_TEMPLATES = [
        { id: 'weekly_pops', desc: 'Pop {target} balloons this week', stat: 'pops', min: 500, max: 1500, reward: 150 },
        { id: 'weekly_score', desc: 'Earn {target} total points', stat: 'totalScore', min: 1000, max: 5000, reward: 200 },
        { id: 'weekly_games', desc: 'Play {target} games', stat: 'gamesPlayed', min: 10, max: 30, reward: 100 },
        { id: 'weekly_combo', desc: 'Get a {target}x combo', stat: 'maxCombo', min: 10, max: 20, reward: 250 },
        { id: 'weekly_boss', desc: 'Defeat {target} boss balloon(s)', stat: 'bossDefeated', min: 3, max: 10, reward: 300 },
        { id: 'weekly_rare', desc: 'Pop {target} rare balloons', stat: 'rarePops', min: 5, max: 15, reward: 350 },
        { id: 'weekly_perfect', desc: 'Complete {target} games without bombs', stat: 'perfectGames', min: 3, max: 8, reward: 400 },
        { id: 'weekly_modes', desc: 'Play all game modes', stat: 'modesPlayed', min: 8, max: 8, reward: 250 }
    ];

    getWeekNumber() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const diff = now - start;
        const oneWeek = 1000 * 60 * 60 * 24 * 7;
        return Math.floor(diff / oneWeek);
    }

    checkWeeklyChallenges() {
        const currentWeek = `${new Date().getFullYear()}-W${this.getWeekNumber()}`;
        
        if (this.data.lastWeeklyDate !== currentWeek) {
            // Check if last week's challenges were completed
            const allCompleted = this.data.weeklyChallenges.length > 0 &&
                this.data.weeklyChallenges.every(c => c.completed);
            
            if (allCompleted) {
                this.data.weeklyStreak++;
            } else if (this.data.lastWeeklyDate) {
                this.data.weeklyStreak = 0;
            }
            
            // Generate new weekly challenges
            this.data.weeklyChallenges = this.generateWeeklyChallenges();
            this.data.lastWeeklyDate = currentWeek;
            this.save();
        }
        
        return this.data.weeklyChallenges;
    }

    generateWeeklyChallenges() {
        const templates = [...ProgressionManager.WEEKLY_CHALLENGE_TEMPLATES];
        const challenges = [];
        
        for (let i = 0; i < 4 && templates.length > 0; i++) {
            const idx = Math.floor(Math.random() * templates.length);
            const template = templates.splice(idx, 1)[0];
            const target = Math.floor(Math.random() * (template.max - template.min + 1)) + template.min;
            
            challenges.push({
                id: template.id,
                desc: template.desc.replace('{target}', target),
                stat: template.stat,
                target: target,
                progress: 0,
                completed: false,
                claimed: false,
                reward: template.reward
            });
        }
        
        return challenges;
    }

    updateWeeklyChallengeProgress(stats) {
        if (!this.data.weeklyChallenges) return [];
        
        const newlyCompleted = [];
        
        this.data.weeklyChallenges.forEach(challenge => {
            if (challenge.completed) return;
            
            const statValue = stats[challenge.stat] || 0;
            
            if (['pops', 'totalScore', 'gamesPlayed', 'bossDefeated', 'rarePops', 'perfectGames'].includes(challenge.stat)) {
                challenge.progress = (challenge.progress || 0) + statValue;
            } else if (challenge.stat === 'modesPlayed') {
                // Track unique modes
                challenge.progress = stats.modesPlayed || 0;
            } else {
                challenge.progress = Math.max(challenge.progress || 0, statValue);
            }
            
            if (challenge.progress >= challenge.target && !challenge.completed) {
                challenge.completed = true;
                newlyCompleted.push(challenge);
            }
        });
        
        this.save();
        return newlyCompleted;
    }

    claimWeeklyChallengeReward(challengeId) {
        const challenge = this.data.weeklyChallenges.find(c => c.id === challengeId);
        if (!challenge || !challenge.completed || challenge.claimed) return 0;
        
        challenge.claimed = true;
        this.data.weeklyCompleted++;
        
        const streakBonus = Math.min(this.data.weeklyStreak * 0.1, 0.5);
        const totalReward = Math.floor(challenge.reward * (1 + streakBonus));
        
        this.addCoins(totalReward);
        this.save();
        return totalReward;
    }

    // ===== DAILY CHALLENGES =====
    static DAILY_CHALLENGE_TEMPLATES = [
        { id: 'pop_balloons', desc: 'Pop {target} balloons', stat: 'pops', min: 30, max: 100, reward: 15 },
        { id: 'get_combo', desc: 'Get a {target}x combo', stat: 'maxCombo', min: 3, max: 8, reward: 20 },
        { id: 'score_points', desc: 'Score {target} points', stat: 'score', min: 50, max: 200, reward: 15 },
        { id: 'pop_glitter', desc: 'Pop {target} glitter balloons', stat: 'glitterPops', min: 3, max: 8, reward: 25 },
        { id: 'pop_rare', desc: 'Pop {target} rare balloon(s)', stat: 'rarePops', min: 1, max: 3, reward: 50 },
        { id: 'use_powerup', desc: 'Use {target} power-up(s)', stat: 'powerupsUsed', min: 1, max: 3, reward: 20 },
        { id: 'no_bombs', desc: 'Complete without hitting a bomb', stat: 'noBombGame', min: 1, max: 1, reward: 40 },
        { id: 'play_games', desc: 'Play {target} games', stat: 'gamesPlayed', min: 2, max: 5, reward: 15 },
        { id: 'frenzy_mode', desc: 'Trigger frenzy {target} time(s)', stat: 'frenzyCount', min: 1, max: 3, reward: 30 },
        { id: 'mega_pop', desc: 'Pop {target} mega balloon(s)', stat: 'megaPops', min: 1, max: 3, reward: 25 },
        { id: 'defeat_boss', desc: 'Defeat {target} boss balloon(s)', stat: 'bossDefeated', min: 1, max: 2, reward: 45 },
        { id: 'chain_combo', desc: 'Get a {target}+ color chain', stat: 'chainCombo', min: 3, max: 6, reward: 35 }
    ];

    generateDailyChallenges() {
        const templates = [...ProgressionManager.DAILY_CHALLENGE_TEMPLATES];
        const challenges = [];

        for (let i = 0; i < 3 && templates.length > 0; i++) {
            const idx = Math.floor(Math.random() * templates.length);
            const template = templates.splice(idx, 1)[0];
            const target = Math.floor(Math.random() * (template.max - template.min + 1)) + template.min;

            challenges.push({
                id: template.id,
                desc: template.desc.replace('{target}', target),
                stat: template.stat,
                target: target,
                progress: 0,
                completed: false,
                claimed: false,
                reward: template.reward
            });
        }

        return challenges;
    }

    checkDailyChallenges() {
        const today = new Date().toDateString();

        if (!this.data.dailyChallenges) {
            this.data.dailyChallenges = [];
        }

        if (this.data.lastChallengeDate !== today) {
            const allCompleted = this.data.dailyChallenges.length > 0 &&
                this.data.dailyChallenges.every(c => c.completed);

            if (allCompleted && this.data.lastChallengeDate) {
                const lastDate = new Date(this.data.lastChallengeDate);
                const todayDate = new Date(today);
                const diffDays = Math.round((todayDate - lastDate) / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    this.data.challengeStreak = (this.data.challengeStreak || 0) + 1;
                } else {
                    this.data.challengeStreak = 0;
                }
            } else if (this.data.lastChallengeDate) {
                this.data.challengeStreak = 0;
            }

            this.data.dailyChallenges = this.generateDailyChallenges();
            this.data.lastChallengeDate = today;
            this.save();
        }

        return this.data.dailyChallenges;
    }

    updateChallengeProgress(stats) {
        if (!this.data.dailyChallenges) return [];

        const newlyCompleted = [];

        this.data.dailyChallenges.forEach(challenge => {
            if (challenge.completed) return;

            const statValue = stats[challenge.stat] || 0;

            if (['pops', 'glitterPops', 'rarePops', 'megaPops', 'powerupsUsed', 'frenzyCount', 'gamesPlayed', 'bossDefeated', 'chainCombo'].includes(challenge.stat)) {
                challenge.progress = (challenge.progress || 0) + statValue;
            } else {
                challenge.progress = Math.max(challenge.progress || 0, statValue);
            }

            if (challenge.stat === 'noBombGame' && stats.noBombGame) {
                challenge.progress = 1;
            }

            if (challenge.progress >= challenge.target && !challenge.completed) {
                challenge.completed = true;
                newlyCompleted.push(challenge);
            }
        });

        this.save();
        return newlyCompleted;
    }

    claimChallengeReward(challengeId) {
        const challenge = this.data.dailyChallenges.find(c => c.id === challengeId);
        if (!challenge || !challenge.completed || challenge.claimed) return 0;

        challenge.claimed = true;
        this.data.challengesCompleted = (this.data.challengesCompleted || 0) + 1;

        const streakBonus = Math.min(this.data.challengeStreak * 0.25, 1);
        const totalReward = Math.floor(challenge.reward * (1 + streakBonus));

        this.addCoins(totalReward);
        this.save();
        return totalReward;
    }

    getDailyChallenges() {
        return this.data.dailyChallenges || [];
    }

    getChallengeStreak() {
        return this.data.challengeStreak || 0;
    }

    // ===== PRESTIGE SYSTEM =====
    static PRESTIGE_REQUIREMENTS = [
        { level: 1, stars: 5000, multiplier: 1.1, reward: { gems: 5, coins: 1000 } },
        { level: 2, stars: 15000, multiplier: 1.2, reward: { gems: 10, coins: 2500 } },
        { level: 3, stars: 35000, multiplier: 1.35, reward: { gems: 20, coins: 5000 } },
        { level: 4, stars: 75000, multiplier: 1.5, reward: { gems: 35, coins: 10000 } },
        { level: 5, stars: 150000, multiplier: 1.75, reward: { gems: 50, coins: 20000 } },
        { level: 6, stars: 300000, multiplier: 2.0, reward: { gems: 100, coins: 50000 } }
    ];

    canPrestige() {
        const nextPrestige = ProgressionManager.PRESTIGE_REQUIREMENTS[this.data.prestigeLevel];
        if (!nextPrestige) return false;
        return this.data.lifetimeStars >= nextPrestige.stars;
    }

    getPrestigeInfo() {
        const current = this.data.prestigeLevel;
        const next = ProgressionManager.PRESTIGE_REQUIREMENTS[current];
        return {
            currentLevel: current,
            currentMultiplier: this.data.prestigeMultiplier,
            nextLevel: next ? current + 1 : null,
            starsRequired: next ? next.stars : null,
            starsProgress: this.data.lifetimeStars,
            nextMultiplier: next ? next.multiplier : null,
            nextReward: next ? next.reward : null
        };
    }

    performPrestige() {
        if (!this.canPrestige()) return null;
        
        const prestigeData = ProgressionManager.PRESTIGE_REQUIREMENTS[this.data.prestigeLevel];
        
        // Apply prestige
        this.data.prestigeLevel++;
        this.data.prestigeMultiplier = prestigeData.multiplier;
        
        // Give rewards
        this.addGems(prestigeData.reward.gems);
        this.addCoins(prestigeData.reward.coins);
        
        // Reset some progress (but keep lifetime stats)
        this.data.totalStars = 0;
        this.data.rank = 'beginner';
        this.data.rankRewardsClaimed = [];
        
        this.save();
        return prestigeData;
    }

    // ===== COLLECTION ALBUM =====
    static ALBUM_MILESTONES = {
        normalBalloons: [100, 500, 1000, 5000, 10000],
        specialBalloons: [50, 200, 500, 1000, 2500],
        rareBalloons: [5, 25, 50, 100, 250],
        bossBalloons: [1, 10, 25, 50, 100]
    };

    static ALBUM_REWARDS = {
        normalBalloons: [25, 50, 100, 250, 500],
        specialBalloons: [50, 100, 200, 500, 1000],
        rareBalloons: [100, 250, 500, 1000, 2500],
        bossBalloons: [100, 300, 750, 1500, 3000]
    };

    updateAlbumProgress(category, amount) {
        if (!this.data.albumProgress[category]) return [];
        
        // Handle different key names for different categories
        const countKey = category === 'bossBalloons' ? 'defeated' : 'popped';
        this.data.albumProgress[category][countKey] = (this.data.albumProgress[category][countKey] || 0) + amount;
        
        const newMilestones = [];
        const milestones = ProgressionManager.ALBUM_MILESTONES[category];
        const rewards = ProgressionManager.ALBUM_REWARDS[category];
        const current = this.data.albumProgress[category];
        
        while (current.milestone < milestones.length && current.popped >= milestones[current.milestone]) {
            const reward = rewards[current.milestone];
            this.addCoins(reward);
            newMilestones.push({
                category,
                milestone: milestones[current.milestone],
                reward
            });
            current.milestone++;
        }
        
        this.save();
        return newMilestones;
    }

    getAlbumProgress() {
        const progress = {};
        
        Object.entries(this.data.albumProgress).forEach(([category, data]) => {
            const milestones = ProgressionManager.ALBUM_MILESTONES[category];
            const rewards = ProgressionManager.ALBUM_REWARDS[category];
            const nextMilestoneIndex = data.milestone;
            
            progress[category] = {
                count: data.popped || data.defeated || 0,
                currentMilestone: nextMilestoneIndex > 0 ? milestones[nextMilestoneIndex - 1] : 0,
                nextMilestone: milestones[nextMilestoneIndex] || null,
                nextReward: rewards[nextMilestoneIndex] || null,
                completedMilestones: nextMilestoneIndex,
                totalMilestones: milestones.length
            };
        });
        
        return progress;
    }

    // ===== SEASONAL EVENTS =====
    static SEASONS = {
        spring: { name: 'Spring Bloom', theme: 'sakura_theme', startMonth: 2, endMonth: 4 },
        summer: { name: 'Summer Splash', theme: 'ocean_theme', startMonth: 5, endMonth: 7 },
        fall: { name: 'Autumn Harvest', theme: 'sunset_bg', startMonth: 8, endMonth: 10 },
        winter: { name: 'Winter Wonderland', theme: 'winter_theme', startMonth: 11, endMonth: 1 }
    };

    checkSeasonalEvent() {
        const month = new Date().getMonth();
        let currentSeason = null;
        
        Object.entries(ProgressionManager.SEASONS).forEach(([id, season]) => {
            if (season.startMonth <= season.endMonth) {
                if (month >= season.startMonth && month <= season.endMonth) {
                    currentSeason = { id, ...season };
                }
            } else {
                if (month >= season.startMonth || month <= season.endMonth) {
                    currentSeason = { id, ...season };
                }
            }
        });
        
        if (currentSeason && this.data.currentSeason !== currentSeason.id) {
            this.data.currentSeason = currentSeason.id;
            this.data.seasonProgress = 0;
            this.data.seasonRewardsClaimed = [];
            this.save();
        }
        
        return currentSeason;
    }

    // ===== ACHIEVEMENTS =====
    static ACHIEVEMENTS = [
        // Pop milestones
        { id: 'first_pop', name: 'First Pop!', desc: 'Pop your first balloon', icon: '🎈', reward: 10 },
        { id: 'pop_100', name: 'Getting Started', desc: 'Pop 100 balloons', icon: '💯', reward: 25 },
        { id: 'pop_500', name: 'Pop Machine', desc: 'Pop 500 balloons', icon: '🎯', reward: 50 },
        { id: 'pop_1000', name: 'Balloon Destroyer', desc: 'Pop 1000 balloons', icon: '💥', reward: 100 },
        { id: 'pop_5000', name: 'Pop Legend', desc: 'Pop 5000 balloons', icon: '🏆', reward: 250 },
        { id: 'pop_10000', name: 'Pop God', desc: 'Pop 10000 balloons', icon: '👑', reward: 500 },

        // Combo achievements
        { id: 'combo_5', name: 'Combo Starter', desc: 'Get a 5x combo', icon: '🔥', reward: 15 },
        { id: 'combo_10', name: 'Combo Pro', desc: 'Get a 10x combo', icon: '⚡', reward: 35 },
        { id: 'combo_20', name: 'Combo Legend', desc: 'Get a 20x combo', icon: '🌟', reward: 75 },
        { id: 'combo_50', name: 'Combo God', desc: 'Get a 50x combo', icon: '💫', reward: 200 },

        // Score achievements
        { id: 'score_50', name: 'Half Century', desc: 'Score 50 points', icon: '5️⃣', reward: 20 },
        { id: 'score_100', name: 'Century', desc: 'Score 100 points', icon: '💯', reward: 40 },
        { id: 'score_200', name: 'High Scorer', desc: 'Score 200 points', icon: '🏆', reward: 80 },
        { id: 'score_500', name: 'Score Master', desc: 'Score 500 points', icon: '🌟', reward: 150 },
        { id: 'score_1000', name: 'Score Legend', desc: 'Score 1000 points', icon: '👑', reward: 300 },

        // Mode achievements
        { id: 'zen_master', name: 'Zen Master', desc: 'Pop 50 in Zen mode', icon: '🧘', reward: 30 },
        { id: 'survivor', name: 'Survivor', desc: 'Win Survival with 3 lives', icon: '❤️', reward: 50 },
        { id: 'frenzy_king', name: 'Frenzy King', desc: 'Score 75+ in Frenzy', icon: '👑', reward: 60 },
        { id: 'target_ace', name: 'Target Ace', desc: 'Perfect Target mode', icon: '🎯', reward: 75 },
        { id: 'boss_slayer', name: 'Boss Slayer', desc: 'Defeat 10 bosses', icon: '⚔️', reward: 100 },
        { id: 'endless_warrior', name: 'Endless Warrior', desc: 'Survive 5 min in Endless', icon: '♾️', reward: 100 },

        // Special achievements
        { id: 'bomb_dodger', name: 'Bomb Dodger', desc: 'Let 10 bombs pass', icon: '💀', reward: 40 },
        { id: 'coin_collector', name: 'Coin Collector', desc: 'Earn 500 coins', icon: '🪙', reward: 100 },
        { id: 'coin_hoarder', name: 'Coin Hoarder', desc: 'Earn 5000 coins', icon: '💰', reward: 300 },
        { id: 'rare_hunter', name: 'Rare Hunter', desc: 'Find all rare balloons', icon: '🦄', reward: 500 },
        { id: 'prestige_1', name: 'Prestige I', desc: 'Reach Prestige 1', icon: '⭐', reward: 200 },
        { id: 'prestige_3', name: 'Prestige III', desc: 'Reach Prestige 3', icon: '🌟', reward: 500 },
        { id: 'weekly_streak_4', name: 'Dedicated', desc: '4 week challenge streak', icon: '📅', reward: 300 },
        { id: 'daily_streak_30', name: 'Committed', desc: '30 day login streak', icon: '🔥', reward: 400 }
    ];

    hasAchievement(id) {
        return this.data.achievements.includes(id);
    }

    unlockAchievement(id) {
        if (this.hasAchievement(id)) return null;

        const achievement = ProgressionManager.ACHIEVEMENTS.find(a => a.id === id);
        if (!achievement) return null;

        this.data.achievements.push(id);
        this.data.achievementPoints += achievement.reward;
        this.addCoins(achievement.reward);
        this.save();
        return achievement;
    }

    updateStats(stats) {
        const unlocked = [];

        if (stats.pops) {
            this.data.totalPops += stats.pops;
            
            const popMilestones = [
                { count: 1, id: 'first_pop' },
                { count: 100, id: 'pop_100' },
                { count: 500, id: 'pop_500' },
                { count: 1000, id: 'pop_1000' },
                { count: 5000, id: 'pop_5000' },
                { count: 10000, id: 'pop_10000' }
            ];
            
            popMilestones.forEach(m => {
                if (this.data.totalPops >= m.count && !this.hasAchievement(m.id)) {
                    const a = this.unlockAchievement(m.id);
                    if (a) unlocked.push(a);
                }
            });
        }

        if (stats.combo && stats.combo > this.data.maxCombo) {
            this.data.maxCombo = stats.combo;
            this.data.statistics.bestCombo = stats.combo;

            const comboMilestones = [
                { count: 5, id: 'combo_5' },
                { count: 10, id: 'combo_10' },
                { count: 20, id: 'combo_20' },
                { count: 50, id: 'combo_50' }
            ];
            
            comboMilestones.forEach(m => {
                if (stats.combo >= m.count && !this.hasAchievement(m.id)) {
                    const a = this.unlockAchievement(m.id);
                    if (a) unlocked.push(a);
                }
            });
        }

        if (stats.score) {
            const scoreMilestones = [
                { count: 50, id: 'score_50' },
                { count: 100, id: 'score_100' },
                { count: 200, id: 'score_200' },
                { count: 500, id: 'score_500' },
                { count: 1000, id: 'score_1000' }
            ];
            
            scoreMilestones.forEach(m => {
                if (stats.score >= m.count && !this.hasAchievement(m.id)) {
                    const a = this.unlockAchievement(m.id);
                    if (a) unlocked.push(a);
                }
            });
        }

        if (stats.bombsAvoided) {
            this.data.bombsAvoided += stats.bombsAvoided;
            if (this.data.bombsAvoided >= 10 && !this.hasAchievement('bomb_dodger')) {
                const a = this.unlockAchievement('bomb_dodger');
                if (a) unlocked.push(a);
            }
        }

        // Coin achievements
        if (this.data.totalCoinsEarned >= 500 && !this.hasAchievement('coin_collector')) {
            const a = this.unlockAchievement('coin_collector');
            if (a) unlocked.push(a);
        }
        if (this.data.totalCoinsEarned >= 5000 && !this.hasAchievement('coin_hoarder')) {
            const a = this.unlockAchievement('coin_hoarder');
            if (a) unlocked.push(a);
        }

        // Streak achievements
        if (this.data.loginStreak >= 30 && !this.hasAchievement('daily_streak_30')) {
            const a = this.unlockAchievement('daily_streak_30');
            if (a) unlocked.push(a);
        }
        if (this.data.weeklyStreak >= 4 && !this.hasAchievement('weekly_streak_4')) {
            const a = this.unlockAchievement('weekly_streak_4');
            if (a) unlocked.push(a);
        }

        // Prestige achievements
        if (this.data.prestigeLevel >= 1 && !this.hasAchievement('prestige_1')) {
            const a = this.unlockAchievement('prestige_1');
            if (a) unlocked.push(a);
        }
        if (this.data.prestigeLevel >= 3 && !this.hasAchievement('prestige_3')) {
            const a = this.unlockAchievement('prestige_3');
            if (a) unlocked.push(a);
        }

        // Rare hunter
        if (this.data.rareDiscovered.length >= 5 && !this.hasAchievement('rare_hunter')) {
            const a = this.unlockAchievement('rare_hunter');
            if (a) unlocked.push(a);
        }

        this.save();
        return unlocked;
    }

    checkModeAchievement(mode, stats) {
        if (mode === 'zen' && stats.pops >= 50 && !this.hasAchievement('zen_master')) {
            return this.unlockAchievement('zen_master');
        }
        if (mode === 'survival' && stats.lives === 3 && stats.won && !this.hasAchievement('survivor')) {
            return this.unlockAchievement('survivor');
        }
        if (mode === 'frenzy' && stats.score >= 75 && !this.hasAchievement('frenzy_king')) {
            return this.unlockAchievement('frenzy_king');
        }
        if (mode === 'target' && stats.perfect && !this.hasAchievement('target_ace')) {
            return this.unlockAchievement('target_ace');
        }
        if (mode === 'endless' && stats.survivalTime >= 300 && !this.hasAchievement('endless_warrior')) {
            return this.unlockAchievement('endless_warrior');
        }
        return null;
    }

    getAchievements() {
        return ProgressionManager.ACHIEVEMENTS.map(a => ({
            ...a,
            unlocked: this.hasAchievement(a.id)
        }));
    }

    // ===== UNLOCKS & PURCHASES =====
    checkUnlocks() {
        const newUnlocks = [];
        for (const unlock of ProgressionManager.UNLOCKS) {
            if (this.data.totalStars >= unlock.stars && !this.data.unlockedItems.includes(unlock.id)) {
                this.data.unlockedItems.push(unlock.id);
                newUnlocks.push(unlock);
            }
        }
        return newUnlocks;
    }

    isUnlocked(itemId) {
        return this.data.unlockedItems.includes(itemId) || this.data.purchasedItems.includes(itemId);
    }

    isPurchased(itemId) {
        return this.data.purchasedItems.includes(itemId);
    }

    purchaseItem(itemId) {
        const item = ProgressionManager.SHOP_ITEMS.find(i => i.id === itemId);
        if (!item) return false;
        if (this.isPurchased(itemId)) return false;
        if (!this.spendCoins(item.price)) return false;

        this.data.purchasedItems.push(itemId);
        this.save();
        return true;
    }

    equipItem(type, itemId) {
        if (!this.isUnlocked(itemId) && itemId !== 'default') return false;

        switch (type) {
            case 'theme': this.data.equippedTheme = itemId; break;
            case 'cursor': this.data.equippedCursor = itemId; break;
            case 'balloons': this.data.equippedBalloons = itemId; break;
            case 'sound': this.data.equippedSound = itemId; break;
            case 'trail': this.data.equippedTrail = itemId; break;
        }
        this.save();
        return true;
    }

    // ===== POWER-UPS =====
    buyPowerup(powerupId) {
        const powerup = ProgressionManager.POWERUPS[powerupId];
        if (!powerup) return false;
        if (!this.spendCoins(powerup.price)) return false;

        this.data.powerups[powerupId] = (this.data.powerups[powerupId] || 0) + 1;
        this.save();
        return true;
    }

    usePowerup(powerupId) {
        if (!this.data.powerups || !this.data.powerups[powerupId]) return false;
        if (this.data.powerups[powerupId] <= 0) return false;

        this.data.powerups[powerupId]--;
        this.save();
        return true;
    }

    getPowerupCount(powerupId) {
        if (!this.data.powerups) return 0;
        return this.data.powerups[powerupId] || 0;
    }

    // ===== RARE COLLECTION =====
    recordRarePop(rareType) {
        if (!this.data.rareCollection) {
            this.data.rareCollection = { rainbow: 0, star: 0, alien: 0, unicorn: 0, diamond: 0 };
        }
        if (!this.data.rareDiscovered) {
            this.data.rareDiscovered = [];
        }

        const isFirstDiscovery = !this.data.rareDiscovered.includes(rareType);
        this.data.rareCollection[rareType] = (this.data.rareCollection[rareType] || 0) + 1;

        if (isFirstDiscovery) {
            this.data.rareDiscovered.push(rareType);
        }

        this.save();
        return isFirstDiscovery;
    }

    getRareCollection() {
        return this.data.rareCollection || { rainbow: 0, star: 0, alien: 0, unicorn: 0, diamond: 0 };
    }

    getRareDiscovered() {
        return this.data.rareDiscovered || [];
    }

    // ===== SETTINGS =====
    updateSettings(settings) {
        this.data.settings = { ...this.data.settings, ...settings };
        this.save();
    }

    getSettings() {
        return this.data.settings;
    }

    // ===== TUTORIAL =====
    completeTutorialStep(step) {
        if (step > this.data.tutorialStep) {
            this.data.tutorialStep = step;
        }
        this.save();
    }

    completeTutorial() {
        this.data.tutorialCompleted = true;
        this.data.settings.showTutorial = false;
        this.addCoins(50); // Tutorial completion bonus
        this.save();
    }

    shouldShowTutorial() {
        return this.data.settings.showTutorial && !this.data.tutorialCompleted;
    }

    // ===== STATISTICS =====
    getStatistics() {
        return {
            ...this.data.statistics,
            totalPops: this.data.totalPops,
            highScore: this.data.highScore,
            maxCombo: this.data.maxCombo,
            gamesPlayed: this.data.gamesPlayed,
            totalPlayTime: this.data.totalPlayTime,
            currentStreak: this.data.currentStreak,
            loginStreak: this.data.loginStreak,
            prestigeLevel: this.data.prestigeLevel,
            achievementPoints: this.data.achievementPoints,
            achievementsUnlocked: this.data.achievements.length,
            totalAchievements: ProgressionManager.ACHIEVEMENTS.length
        };
    }
}
