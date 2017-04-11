class Pokemon {
    constructor(id, number, name, image, types, description, caught, order) {
        this.id = id;
        this.number = number;
        this.name = name;
        this.image = image;
        this.types = types;
        this.description = description;
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
            <!-- Switch "a" to "div" cause of the scrolltop when it's a link -->
            <div data-name="${this.name}" data-description="${this.description}">
                <div class="pokemon-id">
                    <img src="${this.image}" alt="${this.name}">
                    #${this.number}
                </div>
                <div class="pokemon-info">
                    <div class="pokemon-info-name">${this.name}</div>
                    ${types}
                </div>
            </div>
            <button class="is-gotten ${gotten}" data-id="${this.id}">
                <i class="pokeball">
                    <i class="pokeball-button"></i>
                </i>
            </button>
        </li>`;
    }
}

export default Pokemon;
