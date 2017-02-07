const autoscale = () => {
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
};

export default autoscale;
