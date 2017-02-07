class Pokemon {
    constructor(id, number, name, image, types, caught, order) {
        this.id = id;
        this.number = number;
        this.name = name;
        this.image = image;
        this.types = types;
        this.caught = caught;
        this.order = order;
    }

    template() {
        let types = '';
        let gotten = '';

        for (let i = 0; i < this.types.length; i += 1) {
            types += ` <div class="pokemon-info-type ${this.types[i]}"></div>`;
        }

        if (this.caught) {
            gotten = 'gotten';
        }

        return `
        <li class="pokemon for-${this.order}">
            <a href="#">
                <div class="pokemon-id">
                    <img src="${this.image}" alt="${this.name}">
                    #${this.number}
                </div>
                <div class="pokemon-info">
                    <div class="pokemon-info-name">${this.name}</div>
                    ${types}
                </div>
            </a>
            <button class="is-gotten ${gotten}" data-id="${this.id}">
                <i class="pokeball">
                    <i class="pokeball-button"></i>
                </i>
            </button>
        </li>`;
    }
}

export default Pokemon;
