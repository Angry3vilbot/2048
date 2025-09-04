export const UserState = $state({
    score: 0,
    highScore: 0,
})

export function incrementScore(points: number) {
    UserState.score += points
}

export function resetScore() {
    UserState.score = 0
}

export function updateHighScore() {
    if(UserState.score > UserState.highScore) {
        UserState.highScore = UserState.score
    }
}