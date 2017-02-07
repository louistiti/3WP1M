import gulp from 'gulp';
import browsersync from 'browser-sync';
import devip from 'dev-ip';
import autoprefixer from 'gulp-autoprefixer';
import sass from 'gulp-sass';
import prompt from 'gulp-prompt';
import runsequence from 'run-sequence';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import chalk from 'chalk';
import htmlreplace from 'gulp-html-replace';
import htmlmin from 'gulp-htmlmin';
import buffer from 'vinyl-buffer';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import del from 'del';
import rename from 'gulp-rename';
import imagemin from 'gulp-imagemin';
import eslint from 'gulp-eslint';

function errorHandler(err) {
    console.error(chalk.red(`\n[${err.name}] ${err.message}\n`));
    this.emit('end');
}

const config = {
    port: 3000,
    projectsDir: 'projects',
    hashLength: 21,
    salt: 'Louistiti',
    eslintrc: '.eslintrc.json'
};
const list = (dir, files = [], opts = {}) => {
    const entities = fs.readdirSync(dir);

    let entityWithDir = '';

    for (let i = 0; i < entities.length; i += 1) {
        entityWithDir = path.join(dir, entities[i]);

        if (opts.dirInPath && !fs.statSync(entityWithDir).isDirectory()) {
            files.push(entityWithDir);
        } else if (!opts.dirInPath) {
            files.push(entities[i]);
        }

        if (opts.recursive && fs.statSync(entityWithDir).isDirectory()) {
            list(entityWithDir, files, { dirInPath: true, recursive: true });
        }
    }

    return files;
};
const generateHash = (files) => {
    const dates = [];

    for (let i = 0; i < files.length; i += 1) {
        dates.push(Math.round((fs.statSync(files[i]).mtime.getTime() / 1000)));
    }

    return (crypto.createHash('md5').update(Math.max.apply(null, dates).toString()).digest('hex') + config.salt).substr(0, config.hashLength);
};

let projectDir = '';
let distJsFile = 'main';
let distCssFile = 'main';

gulp.task('init', () =>
    gulp.src('')
        .pipe(prompt.prompt({
            type: 'list',
            name: 'project',
            message: 'Quel projet voulez-vous lancer ?',
            choices: list(config.projectsDir)
        }, (res) => {
            projectDir = `${config.projectsDir}/${res.project}`;

            runsequence('serve');
        }))
);

gulp.task('serve', ['styles', 'scripts'], () => {
    browsersync.init({
        host: devip(),
        port: config.port,
        notify: false,
        open: true,
        server: {
            baseDir: projectDir,
            index: 'src/index.html'
        }
    });

    gulp.watch(`${projectDir}/src/scss/**/*.scss`, ['styles']);
    gulp.watch(`${projectDir}/src/js/**/*.js`, ['scripts']);
    gulp.watch(`${projectDir}/src/*.html`).on('change', browsersync.reload);
});

gulp.task('styles', () =>
    gulp.src(`${projectDir}/src/scss/**/*.scss`)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({ browsers: ['last 2 version'] }))
        .pipe(gulp.dest(`${projectDir}/dist/css`))
        .pipe(browsersync.stream())
);

gulp.task('scripts', () => {
    browserify(`${projectDir}/src/js/main.js`)
        .transform('babelify')
        .bundle()
        .on('error', errorHandler)
        .pipe(source('main.js'))
        .pipe(gulp.dest(`${projectDir}/dist/js`))
        .pipe(browsersync.stream());
});

gulp.task('build', () => {
    gulp.src('')
        .pipe(prompt.prompt({
            type: 'list',
            name: 'project',
            message: 'Quel projet voulez-vous compiler ?',
            choices: list(config.projectsDir)
        }, (res) => {
            projectDir = `${config.projectsDir}/${res.project}`;

            const jsFiles = list(`${projectDir}/src/js`, [], { dirInPath: true, recursive: true });
            const cssFiles = list(`${projectDir}/src/scss`, [], { dirInPath: true, recursive: true });

            distJsFile = `${distJsFile}-${generateHash(jsFiles)}.min.js`;
            distCssFile = `${distCssFile}-${generateHash(cssFiles)}.min.css`;

            runsequence('lint', 'clean', ['build-scripts', 'build-styles', 'build-images'], 'build-html');
        }));
});

gulp.task('lint', () =>
    gulp.src(`${projectDir}/src/**/*.js`)
        .pipe(eslint({ configFile: config.eslintrc }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
);

gulp.task('clean', () => del(`${projectDir}/dist`));

gulp.task('build-scripts', () => {
    browserify(`${projectDir}/src/js/main.js`)
        .transform('babelify')
        .bundle()
        .pipe(source(distJsFile))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .on('error', errorHandler)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(`${projectDir}/dist/js`));
});

gulp.task('build-styles', () => {
    gulp.src(`${projectDir}/src/scss/**/*.scss`)
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(autoprefixer({ browsers: ['last 2 version'] }))
        .pipe(rename(distCssFile))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(`${projectDir}/dist/css`));
});

gulp.task('build-images', () =>
    gulp.src(`${projectDir}/src/images/**/*.*`)
        .pipe(imagemin())
        .pipe(gulp.dest(`${projectDir}/dist/images`))
);

gulp.task('build-html', () =>
    gulp.src(`${projectDir}/src/index.html`)
    .pipe(htmlreplace({ js: `js/${distJsFile}`, css: `css/${distCssFile}` }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(`${projectDir}/dist`))
);

gulp.task('default', ['init']);
