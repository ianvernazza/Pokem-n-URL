const container = document.getElementById('pokemon-container');

document.getElementById('fetch-pokemons').addEventListener('click', async () => {
    container.innerHTML = '';

    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=50');
    const data = await response.json();

    for (const pokemon of data.results) {
        const pokemonData = await fetch(pokemon.url);
        const pokemonDetails = await pokemonData.json();
        displayPokemon(pokemonDetails);
    }
});


document.getElementById('search-pokemon').addEventListener('click', async () => {
    const name = document.getElementById('pokemon-name').value.toLowerCase();
    container.innerHTML = '';

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!response.ok) throw new Error('Pokémon no encontrado');
        const pokemonDetails = await response.json();
        
        
        const speciesResponse = await fetch(pokemonDetails.species.url);
        const speciesDetails = await speciesResponse.json();
        const description = getDescription(speciesDetails.flavor_text_entries);

        displayPokemon(pokemonDetails, description);
    } catch (error) {
        container.innerHTML = `<p>${error.message}</p>`;
    }
});


document.getElementById('search-letter').addEventListener('click', async () => {
    const letter = document.getElementById('pokemon-letter').value.toLowerCase();
    container.innerHTML = '';

    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=50');
    const data = await response.json();

    for (const pokemon of data.results) {
        if (pokemon.name.startsWith(letter)) {
            const pokemonData = await fetch(pokemon.url);
            const pokemonDetails = await pokemonData.json();
            displayPokemon(pokemonDetails);
        }
    }
});

function displayPokemon(pokemon, description) {
    const card = document.createElement('div');
    card.className = 'pokemon-card';

    
    const types = pokemon.types.map(typeInfo => translateType(typeInfo.type.name)).join(', ');

    card.innerHTML = `
        <h2>${pokemon.name}</h2>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p>Altura: ${pokemon.height}</p>
        <p>Peso: ${pokemon.weight}</p>
        <p>Tipos: ${types}</p>
        <p>Descripción: ${description}</p>
    `;
    container.appendChild(card);
}

function getDescription(flavorTextEntries) {
    
    const entry = flavorTextEntries.find(entry => entry.language.name === 'es');
    return entry ? entry.flavor_text.replace(/\n/g, ' ') : 'Descripción no disponible.';
}

function translateType(type) {
    const translations = {
        "normal": "Normal",
        "fire": "Fuego",
        "water": "Agua",
        "electric": "Eléctrico",
        "grass": "Planta",
        "ice": "Hielo",
        "fighting": "Lucha",
        "poison": "Veneno",
        "ground": "Tierra",
        "flying": "Volador",
        "psychic": "Psíquico",
        "bug": "Bicho",
        "rock": "Roca",
        "ghost": "Fantasma",
        "dragon": "Dragón",
        "dark": "Siniestro",
        "steel": "Acero",
        "fairy": "Hada"
    };
    return translations[type] || type;
}
