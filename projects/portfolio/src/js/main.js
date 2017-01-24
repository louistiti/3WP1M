{
    /**
     * Auto scale projects
     */

    const projects = document.querySelectorAll('.project');
    let project = '';
    let tmp = '';

    setInterval(() => {
        if (tmp !== '' && tmp.classList.contains('scale')) {
            tmp.classList.remove('scale');
        }
        tmp = projects[Math.floor(Math.random() * projects.length)];
        project = tmp;

        project.classList.add('scale');
    }, 6000);

    /**
     * Change background
     */

    const backgrounds = Array.from(document.querySelectorAll('.background'));
    const background = document.querySelector('#background');
    const setBackground = (value) => {
        backgrounds.forEach((b) => {
            b.classList.remove('selected-background');
            if (b.classList.contains(value)) {
                b.classList.add('selected-background');
            }
        });
        background.classList = [];
        background.classList.add(value);
    };

    if (localStorage.getItem('background') !== null) {
        setBackground(localStorage.getItem('background'));
    } else {
        setBackground('background-1');
    }

    backgrounds.forEach((b) => {
        b.addEventListener('click', (e) => {
            e.preventDefault();

            const selectedB = e.currentTarget.classList[1];

            if (!background.classList.contains(selectedB)) {
                localStorage.setItem('background', selectedB);
                setBackground(selectedB);
            }
        });
    });
}
