'use strict';

import gulp from 'gulp';
import browsersync from 'browser-sync';
import devip from 'dev-ip';
import autoprefixer from 'gulp-autoprefixer';
import sass from 'gulp-sass';
import prompt from 'gulp-prompt';
import runsequence from 'run-sequence';

const projects = [
    'portfolio',
    'project2',
    'project3',
    'project4'
];
let project = './projects';

gulp.task('init', () =>
    gulp.src('')
        .pipe(prompt.prompt({
            type: 'list',
            name: 'project',
            message: 'Quel projet voulez-vous lancer ?',
            choices: projects
        }, (res) => {
            project = `${project}/${res.project}`;

            runsequence('serve');
        }))
);

gulp.task('serve', ['style', 'script', 'image'], () => {
    browsersync.init({
        host: devip(),
        server: project,
        notify: false
    });

    gulp.watch(`${project}/src/scss/**/*.scss`, ['style']);
    gulp.watch(`${project}/src/js/**/*.js`, ['script']);
    gulp.watch(`${project}/*.html`).on('change', browsersync.reload);
});

gulp.task('style', () =>
    gulp.src(`${project}/src/scss/**/*.scss`)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({ browsers: ['last 2 version'] }))
        .pipe(gulp.dest(`${project}/dist/css`))
        .pipe(browsersync.stream())
);

gulp.task('script', () =>
    gulp.src(`${project}/src/js/**/*.js`)
        .pipe(gulp.dest(`${project}/dist/js`))
        .pipe(browsersync.stream())
);

gulp.task('image', () =>
    gulp.src(`${project}/src/images/**/*`)
        .pipe(gulp.dest(`${project}/dist/images`))
        .pipe(browsersync.stream())
);

gulp.task('default', ['init']);
