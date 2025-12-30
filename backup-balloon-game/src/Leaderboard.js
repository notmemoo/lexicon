/**
 * Leaderboard - Local high score management
 */
class Leaderboard {
    constructor() {
        this.storageKey = 'balloonPop_leaderboard';
        this.maxEntries = 10;
        this.scores = this.load();
    }

    load() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Failed to load leaderboard:', e);
        }
        return [];
    }

    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.scores));
        } catch (e) {
            console.warn('Failed to save leaderboard:', e);
        }
    }

    isHighScore(score) {
        if (this.scores.length < this.maxEntries) return true;
        return score > this.scores[this.scores.length - 1].score;
    }

    addScore(initials, score) {
        const entry = {
            initials: initials.toUpperCase().slice(0, 3),
            score: score,
            date: new Date().toISOString().split('T')[0]
        };

        this.scores.push(entry);
        this.scores.sort((a, b) => b.score - a.score);
        this.scores = this.scores.slice(0, this.maxEntries);
        this.save();

        return this.scores.indexOf(entry) + 1; // Return rank (1-indexed)
    }

    getScores() {
        return this.scores;
    }

    getRank(score) {
        for (let i = 0; i < this.scores.length; i++) {
            if (score > this.scores[i].score) {
                return i + 1;
            }
        }
        return this.scores.length + 1;
    }
}
