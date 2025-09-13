<script>
    import { UserState } from "../state.svelte"
</script>

<div class="score-container">
    <div class="current-score">
        <p>SCORE</p>
        <p>{UserState.score}</p>
    </div>
    <div class="high-score">
        <p>BEST</p>
        <p>{UserState.highScore}</p>
    </div>
</div>

<style>
    div.score-container {
        display: flex;
        justify-content: space-around;
        margin-bottom: 5%;
    }
    div.current-score, div.high-score {
        background-color: hsl(10, 15%, 90%);
        padding: 1%;
        width: 20%;
        text-align: center;
        border-radius: 5px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    }
    div.current-score p, div.high-score p {
        margin: 10%;
    }
    div.current-score p:first-child, div.high-score p:first-child {
        margin-bottom: 3%;
        color: hsl(30, 8%, 43%);
        font-weight: 600;
    }
    div.current-score p:last-child, div.high-score p:last-child {
        font-size: 1.5em;
        font-weight: bold;
        color: hsl(30, 8%, 43%);
        margin-top: 0;
    }

    @media screen and (max-width: 520px) {
        div.score-container {
            margin-bottom: 10%;
            width: 100%;
        }
        div.current-score, div.high-score {
            display: flex;
            justify-content: space-between;
            padding: 3%;
            width: 40%;
            align-items: center;
        }
        div.current-score p:first-child, div.high-score p:first-child {
            margin: 0;
            font-size: 0.9em;
        }
        div.current-score p:last-child, div.high-score p:last-child {
            margin: 0;
            font-size: 0.9em;
        }
    }
</style>