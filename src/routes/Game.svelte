<div class="victory-overlay hidden">
    <p>You Win!</p>
    <p>You scored {UserState.score} points in {UserState.moves} moves.</p>
    <button on:click={() => startGame()}>New Game</button>
</div>
<div class="loss-overlay hidden">
    <p>Game Over!</p>
    <p>You scored {UserState.score} points in {UserState.moves} moves.</p>
    <button on:click={() => startGame()}>New Game</button>
</div>
<div class="game-grid">
    <div class="grid-row">
        <div class="grid-tile"></div>
        <div class="grid-tile"></div>
        <div class="grid-tile"></div>
        <div class="grid-tile"></div>
    </div>
    <div class="grid-row">
        <div class="grid-tile"></div>
        <div class="grid-tile"></div>
        <div class="grid-tile"></div>
        <div class="grid-tile"></div>
    </div>
    <div class="grid-row">
        <div class="grid-tile"></div>
        <div class="grid-tile"></div>
        <div class="grid-tile"></div>
        <div class="grid-tile"></div>
    </div>
    <div class="grid-row">
        <div class="grid-tile"></div>
        <div class="grid-tile"></div>
        <div class="grid-tile"></div>
        <div class="grid-tile"></div>
    </div>
</div>
<div class="tile-grid">
    <!-- number-tile tile-* position-X-Y -->
    {#each tileArray as tile (tile.id)}
        <div class={`number-tile tile-${tile.value} position-${tile.posX}-${tile.posY} ${tile.isNew ? "new" : ""} ${tile.merged ? "merged" : ""}`}>
            <div class="inner-tile">{tile.value}</div>
        </div>
    {/each}
</div>
<script lang="ts">
  import { onMount, onDestroy } from "svelte"
  import { incrementScore, loadHighScoreFromCookie, loadScoreFromCookie, updateHighScore, loadBoardFromCookie, UserState, incrementMoves, resetScore, resetMoves } from "../state.svelte"
  import pkg from "@squadette/hammerjs"
  const Hammer = pkg

    interface Tile {
        id: number,
        value: number,
        posX: number,
        posY: number,
        isNew: boolean,
        merged: boolean
    }

    let tileArray: Array<Tile> = []
    let hammer: any;

    function generateTile(): Tile | false {
        // compute free cells from current tileArray
        const occupied = new Set(tileArray.map(t => `${t.posX},${t.posY}`))
        const free: { x: number; y: number }[] = [];
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                if (!occupied.has(`${x},${y}`)){
                     free.push({ x, y })
                }
            }
        }
        if (free.length === 0) return false;
        const pick = free[Math.floor(Math.random() * free.length)]
        return {
            id: Date.now() + Math.floor(Math.random() * 10000),
            value: (Math.random() < 0.9 ? 2 : 4), // common 90% 2 / 10% 4
            posX: pick.x,
            posY: pick.y,
            isNew: true,
            merged: false
        }
    }

    function checkLoss() {
        let canMove: boolean = false
        // Check if the board is full
        if(tileArray.length === 16) {
            // Check for possible merges
            tileArray.forEach(tile => {
                // Look for tiles adjacent to the currently selected tile that have the same value
                if(tileArray.find(t => (t.posX === tile.posX && t.posY === tile.posY - 1 && t.value === tile.value) || // above
                                (t.posX === tile.posX && t.posY === tile.posY + 1 && t.value === tile.value) || // below
                                (t.posX === tile.posX - 1 && t.posY === tile.posY && t.value === tile.value) || // left
                                (t.posX === tile.posX + 1 && t.posY === tile.posY && t.value === tile.value)) // right
                != undefined)
                {
                    canMove = true // There are available merges
                }
            })
        }
        else {
            canMove = true
        }
        return canMove
    }

    function startGame(): void {
        // Reset the score and moves
        resetScore()
        resetMoves()
        // Hide any overlays
        document.querySelector(".victory-overlay")?.classList.add("hidden")
        document.querySelector(".loss-overlay")?.classList.add("hidden")
        // Remove all tiles
        tileArray = []
        // Generate the starting two tiles
        for (let i = 1; i <= 2; i++) {
            let tile = generateTile()
            // re-generate the tile if it overlaps with another
            while (tile === false) {
                tile = generateTile()
            }
            tileArray = [...tileArray, tile as Tile,]    
        }
    }

    function moveTiles(ev: KeyboardEvent): void {
    let movementCheck: boolean = false
    let hasWon: boolean = false
    let newTiles: Tile[] = []
    const removedIds = new Set<number>() // track tiles removed by merges

    // Check the movement direction
    switch(ev.key) {
        case "ArrowUp":
        case "w":
            // operate on a copy and reset flags, then sort by Y ascending
            newTiles = [...tileArray].map(t => ({ ...t, merged: false, isNew: false })).sort((a, b) => a.posY - b.posY)
            // Move every tile
            for(let i = 0; i < newTiles.length; i++) {
                let tile: Tile = newTiles[i]
                let isMoved: boolean = false
                tile.isNew = false
                // Move the tile up
                while(tile.posY > 0 && !isMoved) {
                    // find a tile above that has NOT been removed
                    const above = newTiles.find(t => t.posX === tile.posX && t.posY === tile.posY - 1 && !removedIds.has(t.id))
                    if(!above) {
                        tile.posY--
                        movementCheck = true
                    }
                    else{
                        // Check if the tiles can be merged
                        if(!tile.merged && above.value === tile.value && !above.merged) {
                            // mark the tile above as removed
                            removedIds.add(above.id)
                            // Update the remaining tile's position, merge status and value
                            tile.posY--
                            tile.value *= 2
                            tile.merged = true
                            movementCheck = true
                            // Increment the score by the value of the merged tile
                            incrementScore(tile.value)
                            // Check for win condition
                            if(tile.value === 2048) {
                                alert("win")
                                hasWon = true
                            }
                            // Update high score if needed
                            updateHighScore()
                        }
                        else{
                            isMoved = true
                        }
                    }
                }
            }
            break
        case "ArrowDown":
        case "s":
            // operate on a copy and reset flags, then sort by Y descending
            newTiles = [...tileArray].map(t => ({ ...t, merged: false, isNew: false })).sort((a, b) => b.posY - a.posY)
            // Move every tile
            for(let i = 0; i < newTiles.length; i++) {
                let tile: Tile = newTiles[i]
                let isMoved: boolean = false
                tile.isNew = false
                // Move the tile down
                while(tile.posY < 3 && !isMoved) {
                    const below = newTiles.find(t => t.posX === tile.posX && t.posY === tile.posY + 1 && !removedIds.has(t.id))
                    if(!below) {
                        tile.posY++
                        movementCheck = true
                    }
                    else{
                        if(!tile.merged && below.value === tile.value && !below.merged) {
                            removedIds.add(below.id)
                            tile.posY++
                            tile.value *= 2
                            tile.merged = true
                            movementCheck = true
                            incrementScore(tile.value)
                            if(tile.value === 2048) {
                                alert("win")
                                hasWon = true
                            }
                            // Update high score if needed
                            updateHighScore()
                        }
                        else{
                            isMoved = true
                        }
                    }
                }
            }
            break
        case "ArrowLeft":
        case "a":
            // operate on a copy and reset flags, then sort by X ascending
            newTiles = [...tileArray].map(t => ({ ...t, merged: false, isNew: false })).sort((a, b) => a.posX - b.posX)
            // Move every tile
            for(let i = 0; i < newTiles.length; i++) {
                let tile: Tile = newTiles[i]
                let isMoved: boolean = false
                tile.isNew = false
                // Move the tile left
                while(tile.posX > 0 && !isMoved) {
                    const left = newTiles.find(t => t.posX === tile.posX - 1 && t.posY === tile.posY && !removedIds.has(t.id))
                    if(!left) {
                        tile.posX--
                        movementCheck = true
                    }
                    else{
                        if(!tile.merged && left.value === tile.value && !left.merged) {
                            removedIds.add(left.id)
                            tile.posX--
                            tile.value *= 2
                            tile.merged = true
                            movementCheck = true
                            incrementScore(tile.value)
                            if(tile.value === 2048) {
                                alert("win")
                                hasWon = true
                            }
                            // Update high score if needed
                            updateHighScore()
                        }
                        else{
                            isMoved = true
                        }
                    }
                }
            }
            break
        case "ArrowRight":
        case "d":
            // operate on a copy and reset flags, then sort by X descending
            newTiles = [...tileArray].map(t => ({ ...t, merged: false, isNew: false })).sort((a, b) => b.posX - a.posX)
            // Move every tile
            for(let i = 0; i < newTiles.length; i++) {
                let tile: Tile = newTiles[i]
                let isMoved: boolean = false
                tile.isNew = false
                // Move the tile right
                while(tile.posX < 3 && !isMoved) {
                    const right = newTiles.find(t => t.posX === tile.posX + 1 && t.posY === tile.posY && !removedIds.has(t.id))
                    if(!right) {
                        tile.posX++
                        movementCheck = true
                    }
                    else{
                        if(!tile.merged && right.value === tile.value && !right.merged) {
                            removedIds.add(right.id)
                            tile.posX++
                            tile.value *= 2
                            tile.merged = true
                            movementCheck = true
                            incrementScore(tile.value)
                            if(tile.value === 2048) {
                                alert("win")
                                hasWon = true
                            }
                            // Update high score if needed
                            updateHighScore()
                        }
                        else{
                            isMoved = true
                        }
                    }
                }
            }
            break
        default:
            return
    }

    // filter out removed tiles now that all moves/merges are done
    const resultTiles = newTiles.filter(t => !removedIds.has(t.id))
    tileArray = resultTiles

    // Generate a new tile, increment move counter and save the board to a cookie if movement occurred
    if(movementCheck) {
        incrementMoves();
        if (tileArray.length < 16) {
            let newtile: Tile | false = generateTile()
            while (newtile === false) {
                newtile = generateTile()
            }
            tileArray = [...tileArray, newtile as Tile]
            document.cookie = `board=${JSON.stringify(tileArray)}; path=/; max-age=1209600` // 2 weeks
        }
    }

    // Check for a loss
    if(!checkLoss() && !hasWon) {
        // Remove the event listener to prevent further moves
        document.removeEventListener("keydown", moveTiles)
        hammer.destroy()
        // Remove the board and score cookies
        document.cookie = "board=; path=/; max-age=0"
        document.cookie = "score=; path=/; max-age=0"
        // Reveal the loss overlay
        document.querySelector(".loss-overlay")?.classList.remove("hidden")
        return
    }

    // Check for a win
    if(hasWon) {
        // Remove the event listener to prevent further moves
        document.removeEventListener("keydown", moveTiles)
        hammer.destroy()
        // Remove the board and score cookies
        document.cookie = "board=; path=/; max-age=0"
        document.cookie = "score=; path=/; max-age=0"
        // Reveal the victory overlay
        document.querySelector(".victory-overlay")?.classList.remove("hidden")
        return
    }

    // Temporarily remove the listener to prevent accidental multiple key presses
    document.removeEventListener("keydown", moveTiles)
    setTimeout(() => {
        document.addEventListener("keydown", moveTiles)
    }, 100)
}
    onMount(() => {
        if(typeof document !== "undefined") {
            loadHighScoreFromCookie()
            let savedBoard: Array<Tile> | null = loadBoardFromCookie()
            if(savedBoard !== null) {
                // Load the saved board
                tileArray = savedBoard
                // Load the score
                loadScoreFromCookie()
            }
            else {
                // Start a new game
                startGame()
            }

            document.addEventListener("keydown", moveTiles)
            hammer = new Hammer(document.body)

            hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
            hammer.on("swipeup", () => moveTiles(new KeyboardEvent("keydown", { key: "ArrowUp" })))
            hammer.on("swipedown", () => moveTiles(new KeyboardEvent("keydown", { key: "ArrowDown" })))
            hammer.on("swipeleft", () => moveTiles(new KeyboardEvent("keydown", { key: "ArrowLeft" })))
            hammer.on("swiperight", () => moveTiles(new KeyboardEvent("keydown", { key: "ArrowRight" })))

            document.querySelector(".main>header>h1")?.addEventListener("click", () => startGame())
        }
    })
    onDestroy(() => {
        if (typeof document !== "undefined") {
            document.removeEventListener("keydown", moveTiles)
        }
    })

</script>

<style>
    /* General styles */
    div.game-grid {
        width: 480px;
        height: 480px;
        position: absolute;
        z-index: 1;
    }
    div.grid-row {
        display: flex;
        background-color: hsl(10, 15%, 70%);
        width: 100%;
        height: 23.5%;
        margin-bottom: 2.5%;
    }
    div.tile-grid {
        position: absolute;
        z-index: 2;
    }

    div.grid-tile {
        margin-right: 2.5%;
        width: 25%;
        background-color: hsl(10, 15%, 85%);
        border-radius: 2.5%;
    }
    div.grid-tile:last-child {
        margin-right: 0%;
    }
    div.number-tile {
        position: absolute;

        display: flex;
        align-items: center;
        justify-content: center;

        width: 111px;
        height: 115px;
        border-radius: 2.5%;

        transition: transform 100ms ease-in-out;

        font-weight: bold;
        font-size: 55px;
    }
    div.inner-tile {
        width: 111px;
        height: 115px;
        border-radius: 2.5%;

        display: flex;
        align-items: center;
        justify-content: center;
    }
    div.number-tile.new .inner-tile {
        animation: 200ms ease-in-out 100ms newtile;
        animation-fill-mode: backwards;
    }
    div.number-tile.merged .inner-tile {
        animation: 200ms ease-in-out merge;
        animation-fill-mode: forwards;
    }

    /* Number tile styles */
    div.tile-2 .inner-tile {
        background-color: hsl(30, 37%, 89%);
        color: hsl(30, 8%, 43%);
    }
    div.tile-4 .inner-tile {
        background-color: hsl(39, 51%, 86%);
        color: hsl(30, 8%, 43%);
    }
    div.tile-8 .inner-tile {
        background-color: hsl(28, 82%, 71%);
        color: hsl(34, 37%, 96%);
    }
    div.tile-16 .inner-tile {
        background-color: hsl(21, 88%, 67%);
        color: hsl(34, 37%, 96%);
    }
    div.tile-32 .inner-tile {
        background-color: hsl(12, 89%, 67%);
        color: hsl(34, 37%, 96%);
    }
    div.tile-64 .inner-tile {
        background-color: hsl(11, 91%, 60%);
        color: hsl(34, 37%, 96%);
    }
    div.tile-128 .inner-tile {
        background-color: hsl(45, 77%, 69%);
        color: hsl(34, 37%, 96%);
        font-size: 45px;
    }
    div.tile-256 .inner-tile {
        background-color: hsl(46, 80%, 65%);
        color: hsl(34, 37%, 96%);
        font-size: 45px;
    }
    div.tile-512 .inner-tile {
        background-color: hsl(46, 81%, 62%);
        color: hsl(34, 37%, 96%);
        font-size: 45px;
    }
    div.tile-1024 .inner-tile {
        background-color: hsl(46, 83%, 59%);
        box-shadow: 0 0 30px 10px hsla(47, 84%, 70%, 0.633), inset 0 0 0 1px hsla(0, 0%, 100%, 0.2);
        color: hsl(34, 37%, 96%);
        font-size: 35px;
    }
    div.tile-2048 .inner-tile {
        background: linear-gradient(
        30deg,
            hsl(0, 100%, 50%) 0%,
            hsl(36, 100%, 50%) 10%,
            hsl(64, 74%, 50%) 20%,
            hsl(118, 68%, 58%) 30%,
            hsl(179, 68%, 55%) 40%,
            hsl(188, 76%, 54%) 50%,
            hsl(212, 86%, 52%) 60%,
            hsl(260, 89%, 52%) 70%,
            hsl(284, 94%, 51%) 80%,
            hsl(308, 97%, 51%) 90%,
            hsl(0, 100%, 50%) 100%
        );
        color: #f9f6f2;
        font-size: 35px;
    }

    /* Overlay Styles */
    .hidden {
        display: none !important;
    }
    .victory-overlay, .loss-overlay {
        position: absolute;
        top:0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: hsla(30, 37%, 89%, 0.7);
        z-index: 10;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        font-size: 24px;
        font-weight: bold;
        color: hsl(30, 8%, 43%);
    }
    .victory-overlay p, .loss-overlay p {
        margin: 2%;
    }
    .victory-overlay p:first-child, .loss-overlay p:first-child {
        font-size: 2em;
    }
    .victory-overlay button, .loss-overlay button {
        margin-top: 5%;
        padding: 1% 3%;
        background-color: hsl(10, 15%, 90%);
        border: none;
        border-radius: 5px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        outline: 2px solid hsl(30, 8%, 43%);
        color: hsl(30, 8%, 43%);
        font-size: 1em;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.2s ease-in-out;
    }
    .victory-overlay button:hover, .loss-overlay button:hover {
        background-color: hsl(10, 15%, 80%);
    }


    /* Position styles */
    .position-0-0 {
        transform: translate(0px, 0px);
    }
    .position-0-1 {
        transform: translate(0px, 124.8px);
    }
    .position-0-2 {
        transform: translate(0px, 249.6px);
    }
    .position-0-3 {
        transform: translate(0px, 374.4px);
    }

    .position-1-0 {
        transform: translate(123px, 0px);
    }
    .position-1-1 {
        transform: translate(123px, 124.8px);
    }
    .position-1-2 {
        transform: translate(123px, 249.6px);
    }
    .position-1-3 {
        transform: translate(123px, 374.4px);
    }

    .position-2-0 {
        transform: translate(246px, 0px);
    }
    .position-2-1 {
        transform: translate(246px, 124.8px);
    }
    .position-2-2 {
        transform: translate(246px, 249.6px);
    }
    .position-2-3 {
        transform: translate(246px, 374.4px);
    }

    .position-3-0 {
        transform: translate(369px, 0px);
    }
    .position-3-1 {
        transform: translate(369px, 124.8px);
    }
    .position-3-2 {
        transform: translate(369px, 249.6px);
    }
    .position-3-3 {
        transform: translate(369px, 374.4px);
    }
    
    /* Animations */
    @keyframes newtile {
        0% {
            transform: scale(0);
        }

        100% {
            transform: scale(1);
        }
    }

    @keyframes merge {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.2);
        }
        100% {
            transform: scale(1);
        }
    }
    /* Mobile */
    @media screen and (max-width: 520px) {
        div.game-grid {
            width: 240px;
            height: 240px;
        }
        div.grid-row {
            height: 23.5%;
            margin-bottom: 2.5%;
        }
        div.number-tile {
            width: 55.5px;
            height: 56.4px;
            border-radius: 2.5%;
        }
        div.inner-tile {
            width: 55.6px;
            height: 56.5px;
            border-radius: 2.5%;
            font-size: 25px !important
        }

        /* Overlay Styles */
        .victory-overlay, .loss-overlay {
            font-size: 18px;
            text-align: center;
        }
        .victory-overlay p:first-child, .loss-overlay p:first-child {
            font-size: 1.5em;
        }
        .victory-overlay button, .loss-overlay button {
            font-size: 0.9em;
        }

        /* Position styles */
        .position-0-0 {
            transform: translate(-0.2px, 0px);
        }
        .position-0-1 {
            transform: translate(-0.3px, 62.1px);
        }
        .position-0-2 {
            transform: translate(-0.2px, 124.71px);
        }
        .position-0-3 {
            transform: translate(-0.1px, 186.9px);
        }

        .position-1-0 {
            transform: translate(61.2px, 0px);
        }
        .position-1-1 {
            transform: translate(61.2px, 62.1px);
        }
        .position-1-2 {
            transform: translate(61.1px, 124.71px);
        }
        .position-1-3 {
            transform: translate(61.2px, 186.9px);
        }

        .position-2-0 {
            transform: translate(122.7px, 0px);
        }
        .position-2-1 {
            transform: translate(122.7px, 62.1px);
        }
        .position-2-2 {
            transform: translate(122.6px, 124.71px);
        }
        .position-2-3 {
            transform: translate(122.7px, 186.9px);
        }

        .position-3-0 {
            transform: translate(184.3px, 0px);
        }
        .position-3-1 {
            transform: translate(184.3px, 62.1px);
        }
        .position-3-2 {
            transform: translate(184.3px, 124.71px);
        }
        .position-3-3 {
            transform: translate(184.3px, 186.9px);
        }
    }
</style>