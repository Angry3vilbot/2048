<script>
  import Game from "./Game.svelte";

</script>
<section>
    <h1>2048</h1>
    <div class="game-container">
        <Game></Game>
    </div>
</section>

<style>
    div.game-container {
        max-width: 40rem;
        padding-top: 1%;
        padding-bottom: 1%;
        background-color: hsl(10, 15%, 70%);
    }
</style>