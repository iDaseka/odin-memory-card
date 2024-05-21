import { useEffect, useState } from "react"

export function PokemonArray() {
    const [pokeArray, setPokeArray] = useState([])
    const [clickedPokemon, setClickedPokemon] = useState([]);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    let count = 1;

    useEffect(() => {
        getPkmID();
    }, []);

    const getPkmID = async () => {
        const promises = [];
        const fetchedPkm = [];

        for (let i = 0; i < 12; i++){
            const pkmID = Math.floor(Math.random() * 1025) + 1;
            promises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${pkmID}`));
        }

        const responses = await Promise.all(promises);

        for (const response of responses){
            const data = await response.json();
            fetchedPkm.push(data);
        }
        setPokeArray(fetchedPkm);
    }

    const clickHandler = (pokemon) => {
        if (clickedPokemon.some(p => p.id === pokemon.id)){
            errorScreen();
        }
        else{
            successScreen(pokemon);
        }

    }

    const errorScreen = () =>{
        const input = document.getElementById("clickType");
        const display = document.getElementById("pkmArray");
        input.style.backgroundColor = "red";
        display.style.display = "none";
        input.style.transition = "0.5s";
        setTimeout(() => {
            display.style.display = "grid";
            input.style.backgroundColor = "white";

        }, 500);
        setScore(0)
        if (score > highScore){
            setHighScore(score)
        }
        getPkmID();
        setClickedPokemon([]);
        count = 1;
    }

    const successScreen = (pokemon) =>{
        const randomize  = [...pokeArray.sort(() => Math.random() - 0.5)]
        const input = document.getElementById("clickType");
        input.style.backgroundColor = "green";
        input.style.transition = "0.5s";
        setTimeout(() => {
            input.style.backgroundColor = "white";

        }, 500);
        setScore(score + 1)
        setPokeArray(randomize)
        setClickedPokemon([...clickedPokemon, pokemon])

        if ((score +1) % 12 === 0){
            count = count + 1;
            alert(`Nice! Lets begin round ${count}!`)
            getPkmID();
            setClickedPokemon([]);
        }
    }

    return(
        <>
            <div>
                <h1 id="title">Pokemon Memory Game</h1>
            </div>
            <div id="userDisplay">
                <h2>Score: {score}</h2>
                <div id="clickType"></div>
                <h2>High Score: {highScore}</h2>
            </div>
            <div id="pkmArray">
            {pokeArray.map((pokemon, index) => (
                <div key={index} id="pkmCard" onClick={() => clickHandler(pokemon)}>
                    {/*<h1>{pokemon.name}</h1>*/}
                    <img src={pokemon.sprites.front_default}/>
                </div>
            ))}
            </div>
        </>
    )
}