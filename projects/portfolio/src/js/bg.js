const bg = () => {
    /**
     * Change background
     */

    const backgrounds = document.querySelectorAll('.background');
    const background = document.querySelector('#background');
    const setBackground = (value) => {
        for (let i = 0; i < backgrounds.length; i += 1) {
            backgrounds[i].classList.remove('selected-background');
            if (backgrounds[i].classList.contains(value)) {
                backgrounds[i].classList.add('selected-background');
            }
        }

        background.className = '';
        background.classList.add(value);
    };

    if (localStorage.getItem('background') !== null) {
        setBackground(localStorage.getItem('background'));
    } else {
        setBackground('background-1');
    }

    for (let i = 0; i < backgrounds.length; i += 1) {
        backgrounds[i].addEventListener('click', (e) => {
            e.preventDefault();

            const selectedB = e.currentTarget.classList[1];

            if (!background.classList.contains(selectedB)) {
                localStorage.setItem('background', selectedB);
                setBackground(selectedB);
            }
        });
    }
};

export default bg;
