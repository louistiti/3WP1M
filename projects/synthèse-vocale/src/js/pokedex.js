import Pokemon from './pokemon';

class Pokedex {
    constructor(json) {
        this.json = json;
        this.pokemons = [];
        this.team = [];
        this.loader = '';
        this.list = '';
        this.allDom = '';
        this.teamDom = '';
    }

    init() {
        this.list = document.querySelector('#pokemon-list');
        this.loader = document.querySelector('#loader');

        this.loader.classList.remove('hidden');

        fetch(this.json)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }

                throw Error(res.statusText);
            })
            .catch(err => console.error(err))
            .then((pokemons) => {
                if (pokemons instanceof Array) {
                    this.loader.classList.add('hidden');

                    this.pokemons = pokemons;

                    this.menu();
                    this.initTeam();
                    this.list.innerHTML = this.load(this.pokemons);
                    Pokedex.talk();
                    this.toggleCatchPokemon();
                }
            });
    }

    menu() {
        const body = document.querySelector('body');
        const choices = document.querySelectorAll('#menu li');

        for (let i = 0; i < choices.length; i += 1) {
            choices[i].addEventListener('click', (e) => {
                e.preventDefault();

                if (e.currentTarget.classList.contains('2')) {
                    body.classList.remove('list');
                    body.classList.add('team');

                    this.teamDom = this.load(
                        this.pokemons.filter(p => this.team.indexOf(p.id) !== -1)
                    );

                    // Reset data
                    this.list.innerHTML = this.teamDom;
                } else {
                    body.classList.remove('team');
                    body.classList.add('list');

                    this.allDom = this.load(this.pokemons);

                    // Reset data
                    this.list.innerHTML = this.allDom;
                }

                this.toggleCatchPokemon();
            });
        }
    }

    initTeam() {
        if (Pokedex.pokemonsFromLocalStorage() === null) {
            localStorage.setItem('pokémons', JSON.stringify([]));
        }

        this.team = Pokedex.pokemonsFromLocalStorage();
    }

    static pokemonsFromLocalStorage() {
        return JSON.parse(localStorage.getItem('pokémons'));
    }

    isInTeam(id) {
        // In case the pokemon is in the local storage
        return !!(this.team.length > 0 && this.team.indexOf(id) !== -1);
    }

    load(pokemons) {
        let pokemon = {};
        let dom = '';

        for (let i = 0; i < pokemons.length; i += 1) {
            pokemon = new Pokemon(
                pokemons[i].id,
                pokemons[i].number,
                pokemons[i].name,
                pokemons[i].image,
                pokemons[i].types,
                pokemons[i].description,
                this.isInTeam(pokemons[i].id),
                i
            );

            dom += pokemon.template();
        }

        return dom;
    }

    static talk() {
        const pokemons = document.querySelectorAll('.pokemon [data-description]');

        speechSynthesis.addEventListener('voiceschanged', () => {
            const voices = speechSynthesis.getVoices();

            const ssu = new SpeechSynthesisUtterance();
            ssu.voice = voices[4]; // Select the Google UK English Male language

            for (let i = 0; i < pokemons.length; i += 1) {
                pokemons[i].addEventListener('click', (e) => {
                    speechSynthesis.cancel(); // Cancel speeches from the queue
                    const name = e.currentTarget.dataset.name;
                    const description = e.currentTarget.dataset.description;

                    ssu.text = `${name}, ${description}`;

                    speechSynthesis.speak(ssu);
                });
            }
        });
    }

    toggleCatchPokemon() {
        const pokeballs = document.querySelectorAll('.is-gotten');

        for (let i = 0; i < pokeballs.length; i += 1) {
            pokeballs[i].addEventListener('click', (e) => {
                e.preventDefault();

                const id = parseInt(e.currentTarget.dataset.id, 10);

                // If already caught (id in localstorage)
                if (this.team.indexOf(id) !== -1) {
                    this.team.splice(this.team.indexOf(id), 1);
                    e.currentTarget.classList.remove('gotten');
                } else if (this.team.length < 6) {
                    this.team.push(id);
                    e.currentTarget.classList.add('gotten');
                } else {
                    alert('Vous avez déjà 6 pokémons dans votre équipe.'); // eslint-disable-line no-alert
                }

                localStorage.setItem('pokémons', JSON.stringify(this.team));
            });
        }
    }
}

export default Pokedex;
