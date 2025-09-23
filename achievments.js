export class Achievements {
    constructor() {
        this.achieved = [];
    }

    check(score, rendering) {
        const milestones = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072];

        for (const value of milestones) {
            if (score >= value && !this.achieved.includes(value)) {
                this.achieved.push(value);

                rendering.showSparklesFromTile(value);

                if (value === 2048) {
                    rendering.showSparkles(); 
                }

                rendering.showAchievementMessage(
                    `Achievement: You reached ${value} points for the first time!`,
                    score
                );

                break; 
            }
        }
    }

}
