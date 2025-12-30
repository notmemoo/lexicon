/**
 * Manages Firebase Realtime Database interactions for the Global Leaderboard.
 */
class FirebaseManager {
    constructor(config) {
        this.config = config;
        this.db = null;
        this.scoresRef = null;
        this.isInitialized = false;
    }

    init() {
        try {
            // Initialize Firebase App
            if (!firebase.apps.length) {
                firebase.initializeApp(this.config);
            }
            this.db = firebase.database();
            this.scoresRef = this.db.ref('leaderboard');
            this.isInitialized = true;
            console.log("Firebase Leaderboard Initialized!");
        } catch (error) {
            console.error("Firebase Initialization Failed:", error);
            this.isInitialized = false;
        }
    }

    /**
     * Submit a score to the global leaderboard
     */
    async submitScore(initials, score) {
        if (!this.isInitialized) return;

        try {
            await this.scoresRef.push({
                name: initials.toUpperCase(),
                score: score,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });
            return true;
        } catch (error) {
            console.error("Error submitting score:", error);
            return false;
        }
    }

    /**
     * Listen for real-time updates to the top 10 scores
     */
    getTopScores(limit = 10, callback) {
        if (!this.isInitialized) return;

        // Query top scores (ordered by score ascending)
        const topQuery = this.scoresRef.orderByChild('score').limitToLast(limit);

        topQuery.on('value', (snapshot) => {
            const scores = [];
            snapshot.forEach((childSnapshot) => {
                scores.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });

            // Since limitToLast gets the highest scores but in ascending order,
            // we reverse it to get descending (highest first).
            scores.reverse();
            callback(scores);
        });
    }
}

// Exported via window for main.js access
window.FirebaseManager = FirebaseManager;
