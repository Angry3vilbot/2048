interface Tile {
        id: number,
        value: number,
        posX: number,
        posY: number,
        isNew: boolean,
        merged: boolean
}

export const UserState = $state({
    score: 0,
    highScore: 0,
    moves: 0,
})

export function incrementScore(points: number): void {
    UserState.score += points
    // Save the score to a cookie
    document.cookie = `score=${UserState.score}; path=/; max-age=1209600` // 2 weeks
}

export function resetScore(): void {
    UserState.score = 0
}

export function updateHighScore(): void {
    if(UserState.score > UserState.highScore) {
        UserState.highScore = UserState.score
        // Save the high score to a cookie
        document.cookie = `highScore=${UserState.highScore}; path=/; max-age=1209600` // 2 weeks
    }
}

export function incrementMoves(): void {
    UserState.moves += 1
    // Save the moves to a cookie
    document.cookie = `moves=${UserState.moves}; path=/; max-age=1209600` // 2 weeks
}

export function resetMoves(): void {
    UserState.moves = 0
    // Remove the moves cookie
    document.cookie = `moves=; path=/; max-age=0`
}

export function loadHighScoreFromCookie(): void {
    const highScore = getCookie("highScore")
    if(highScore) {
        UserState.highScore = parseInt(highScore)
    }
}

export function loadScoreFromCookie(): void {
    const score = getCookie("score")
    if(score) {
        UserState.score = parseInt(score)
    }
}

export function loadBoardFromCookie(): Array<Tile> | null {
    const board = getCookie("board")
    if(board) {
        return JSON.parse(board)
    }
    return null
}

export function loadMovesFromCookie(): void {
    const moves = getCookie("moves")
    if(moves) {
        UserState.moves = parseInt(moves)
    }
}

function getCookie(name: string): string | null {
    let searchStr = name + "="
    let cookieArr = document.cookie.split(';')
    // Find the cookie with the given name
    for (let c of cookieArr) {
        c = c.trim()
        if (c.indexOf(searchStr) == 0) {
            console.log("Found cookie:", c)
            console.log("Returning value:", c.substring(searchStr.length))
            return c.substring(searchStr.length)
        }
    }
    return null
}