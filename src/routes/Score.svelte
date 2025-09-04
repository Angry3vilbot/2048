<script>
    import { UserState } from "../state.svelte"
</script>

<div class="score-container">
    <div class="current-score">Score: {UserState.score}</div>
    <div class="high-score">High Score: {UserState.highScore}</div>
</div>