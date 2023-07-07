<!-- Text in the grid tiles will be removed later, for now it is there for ease of scripting later. -->
<div class="game-grid">
    <div class="grid-row">
        <div class="grid-tile">0,0</div>
        <div class="grid-tile">1,0</div>
        <div class="grid-tile">2,0</div>
        <div class="grid-tile">3,0</div>
    </div>
    <div class="grid-row">
        <div class="grid-tile">0,1</div>
        <div class="grid-tile">1,1</div>
        <div class="grid-tile">2,1</div>
        <div class="grid-tile">3,1</div>
    </div>
    <div class="grid-row">
        <div class="grid-tile">0,2</div>
        <div class="grid-tile">1,2</div>
        <div class="grid-tile">2,2</div>
        <div class="grid-tile">3,2</div>
    </div>
    <div class="grid-row">
        <div class="grid-tile">0,3</div>
        <div class="grid-tile">1,3</div>
        <div class="grid-tile">2,3</div>
        <div class="grid-tile">3,3</div>
    </div>
</div>
<div class="tile-grid">
    <!-- number-tile tile-* position-X-Y -->
    {#each tileArray as tile}
        <div class={`number-tile tile-${tile.value} position-${tile.posX}-${tile.posY}`}>{tile.value}</div>
    {/each}
</div>
<script lang="ts">
  import { onMount } from "svelte";

    interface Tile {
        value: number,
        posX: number,
        posY: number
    }

    let tileArray: Array<Tile>
    $: tileArray = []

    function generateTile() {
        let tile: Tile = {
            value: (Math.floor(Math.random() * 2) + 1) * 2,
            posX: Math.floor(Math.random() * 4),
            posY: Math.floor(Math.random() * 4)
        }
        
        for (let i = 0; i < tileArray.length; i++) {
            // Check if the generated tile overlaps with an existing one
            if(tileArray[i].posX === tile.posX && tileArray[i].posY === tile.posY) {
                // Return false to allow the code to re-run the function
                return false
            }
        }
        return tile
    }

    function checkLoss() {
        //TODO The check method is incomplete, implementation of a possible moves check (even during a filled board) is required
        // Check if the board is full
        if(tileArray.length === 16) {
            return true
        }
        return false
    }

    function startGame() {
        // Remove all tiles
        tileArray = []
        // Generate the starting two tiles
        for (let i = 1; i <= 2; i++) {
            let tile = generateTile()
            // re-generate the tile if it overlaps with another
            while (tile === false) {
                tile = generateTile()
            }
            tileArray = [...tileArray, tile,]    
        }
    }

    function moveTiles(ev: KeyboardEvent) {
        let newTile: Tile|false
        // Check for specific directional keys
        switch(ev.key) {
            case "ArrowUp":
            case "w":
                tileArray.forEach((tile) => {
                    if(tile.posY !== 0) {
                        let collision = false
                        while (tile.posY !== 0 && collision === false) {
                            tileArray.forEach((otherTile) => {
                            if(otherTile.posX === tile.posX && otherTile.posY === tile.posY - 1) {
                                collision = true
                                // Check if the tiles need to be merged
                                if(tile.value === otherTile.value) {
                                    tileArray = tileArray.filter((check) => check !== tile)
                                    otherTile.value = otherTile.value * 2
                                }
                            }
                            })
                            collision ? null : tile.posY--
                        }
                    }
                })
                newTile = generateTile()
                while (newTile === false) {
                    newTile = generateTile()
                }
                tileArray = [...tileArray, newTile]
                break

            case "ArrowDown":
            case "s":
                tileArray.forEach((tile) => {
                    if(tile.posY !== 3) {
                        let collision = false
                        while (tile.posY !== 3 && collision === false) {
                            tileArray.forEach((otherTile) => {
                            if(otherTile.posX === tile.posX && otherTile.posY === tile.posY + 1) {
                                collision = true
                                // Check if the tiles need to be merged
                                if(tile.value === otherTile.value) {
                                    tileArray = tileArray.filter((check) => check !== tile)
                                    otherTile.value = otherTile.value * 2
                                }
                            }
                            })
                            collision ? null : tile.posY++
                        }
                    }
                })
                newTile = generateTile()
                while (newTile === false) {
                    newTile = generateTile()
                }
                tileArray = [...tileArray, newTile]
                break
            
            case "ArrowLeft":
            case "a":
                tileArray.forEach((tile) => {
                    if(tile.posX !== 0) {
                        let collision = false
                        while (tile.posX !== 0 && collision === false) {
                            tileArray.forEach((otherTile) => {
                            if(otherTile.posY === tile.posY && otherTile.posX === tile.posX - 1) {
                                collision = true
                                // Check if the tiles need to be merged
                                if(tile.value === otherTile.value) {
                                    tileArray = tileArray.filter((check) => check !== tile)
                                    otherTile.value = otherTile.value * 2
                                }
                            }
                            })
                            collision ? null : tile.posX--
                        }
                    }
                })
                newTile = generateTile()
                while (newTile === false) {
                    newTile = generateTile()
                }
                tileArray = [...tileArray, newTile]
                break
            
            case "ArrowRight":
            case "d":
                tileArray.forEach((tile) => {
                    if(tile.posX !== 3) {
                        let collision = false
                        while (tile.posX !== 3 && collision === false) {
                            tileArray.forEach((otherTile) => {
                            if(otherTile.posY === tile.posY && otherTile.posX === tile.posX + 1) {
                                collision = true
                                // Check if the tiles need to be merged
                                if(tile.value === otherTile.value) {
                                    tileArray = tileArray.filter((check) => check !== tile)
                                    otherTile.value = otherTile.value * 2
                                }
                            }
                            })
                            collision ? null : tile.posX++
                        }
                    }
                })
                newTile = generateTile()
                while (newTile === false) {
                    newTile = generateTile()
                }
                tileArray = [...tileArray, newTile]
                break
        }
        // Check if the game is lost after the move
        if (checkLoss()) {
            startGame()
        }
    }
    onMount(() => document.addEventListener("keydown", moveTiles))
    $: startGame()

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

        transition: all 100ms ease-in-out;

        font-weight: bold;
        font-size: 55px;
    }

    /* Number tile styles */
    div.tile-2 {
        background-color: hsl(30, 37%, 89%);
        color: hsl(30, 8%, 43%);
    }
    div.tile-4 {
        background-color: hsl(39, 51%, 86%);
        color: hsl(30, 8%, 43%);
    }
    div.tile-8 {
        background-color: hsl(28, 82%, 71%);
        color: hsl(34, 37%, 96%);
    }
    div.tile-16 {
        background-color: hsl(21, 88%, 67%);
        color: hsl(34, 37%, 96%);
    }
    div.tile-32 {
        background-color: hsl(12, 89%, 67%);
        color: hsl(34, 37%, 96%);
    }
    div.tile-64 {
        background-color: hsl(11, 91%, 60%);
        color: hsl(34, 37%, 96%);
    }
    div.tile-128 {
        background-color: hsl(45, 77%, 69%);
        color: hsl(34, 37%, 96%);
        font-size: 45px;
    }
    div.tile-256 {
        background-color: hsl(46, 80%, 65%);
        color: hsl(34, 37%, 96%);
        font-size: 45px;
    }
    div.tile-512 {
        background-color: hsl(46, 81%, 62%);
        color: hsl(34, 37%, 96%);
        font-size: 45px;
    }
    div.tile-1024 {
        background-color: hsl(46, 83%, 59%);
        box-shadow: 0 0 30px 10px hsla(47, 84%, 70%, 0.633), inset 0 0 0 1px hsla(0, 0%, 100%, 0.2);
        color: hsl(34, 37%, 96%);
        font-size: 35px;
    }
    div.tile-2048 {
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
</style>