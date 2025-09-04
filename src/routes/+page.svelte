<script>
  import Game from "./Game.svelte";
  import Score from "./Score.svelte";
</script>
<section class="main">
    <h1>2048</h1>
    <Score></Score>
    <div class="game-container">
        <Game></Game>
    </div>
</section>

<style>
    * {
        font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    }

    section.main {
        width: 500px;
        height: 500px;
        position: absolute;
        margin-left: auto;
        margin-right: auto;
        left: 0;
        right: 0;
    }

    div.game-container {
        position: relative;
        width: 500px;
        height: 500px;
        padding-top: 1%;
        padding-bottom: 1%;
        padding-left: 2%;
        background-color: hsl(10, 15%, 70%);
        outline: hsl(10, 15%, 70%) solid 10px;
        border-radius: 1px;
        box-sizing: border-box;
    }

    @media screen and (max-width: 520px) {
        div.game-container, section.main {
            width: 250px;
            height: 250px;
        }
    }
</style>