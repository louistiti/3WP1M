const autoscale = () => {
    /**
     * Auto scale projects
     */

    const projects = document.querySelectorAll('.project');
    let project = '';

    setInterval(() => {
        if (project !== '' && project.classList.contains('scale')) {
            project.classList.remove('scale');
        }
        project = projects[Math.floor(Math.random() * projects.length)];

        project.classList.add('scale');
    }, 6000);
};

export default autoscale;
