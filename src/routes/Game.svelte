<!-- Text in the grid tiles will be removed later, for now it is there for ease of scripting later. -->
<div class="game-grid">
    <div class="grid-row">
        <div class="grid-tile">1</div>
        <div class="grid-tile">2</div>
        <div class="grid-tile">3</div>
        <div class="grid-tile">4</div>
    </div>
    <div class="grid-row">
        <div class="grid-tile">5</div>
        <div class="grid-tile">6</div>
        <div class="grid-tile">7</div>
        <div class="grid-tile">8</div>
    </div>
    <div class="grid-row">
        <div class="grid-tile">9</div>
        <div class="grid-tile">10</div>
        <div class="grid-tile">11</div>
        <div class="grid-tile">12</div>
    </div>
    <div class="grid-row">
        <div class="grid-tile">13</div>
        <div class="grid-tile">14</div>
        <div class="grid-tile">15</div>
        <div class="grid-tile">16</div>
    </div>
</div>
<div class="tile-grid">

</div>

<style>
    div.game-grid {
        max-width: 97.5%;
        box-sizing: border-box;
        aspect-ratio: 1;
        padding-left: 2.5%;
    }
    div.grid-row {
        display: flex;
        background-color: hsl(10, 15%, 70%);
        width: 100%;
        height: 23.5%;
        margin-bottom: 2.5%;
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
</style>