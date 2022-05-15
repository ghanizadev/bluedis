const gulp = require('gulp');
const { exec } = require('child_process');

const execAsync = async (command, displayError = true) => {
    return new Promise((res, rej) => {
        exec(command, (err, stdout, stderr) => {
            if(displayError) console.log(stderr);

            if(err) return rej(err);
            res(stdout);
        })
    })
}

const checkDevServerStatus = async () => {
    try {
        const headers = await execAsync('curl -I http://localhost:3000', false);
        if(headers.split('\n')[0].search('200')) return 1;
        return 0;
    } catch(e) {
        return 0
    }
}

const compileElectron = async () => {
    return execAsync('npx tsc --project tsconfig.app.json')
}

const devReact = async () => {
    return execAsync('npx cross-env NODE_ENV=development BROWSER=none PORT=3000 react-scripts start')
}

const devElectron = async () => {
    process.stdout.write('Awaiting for dev-server');

    while(!(await checkDevServerStatus())) {
        await new Promise(res => setTimeout(res, 1000));
        process.stdout.write('.');
    }

    process.stdout.write(' Done\n');
    return execAsync('npx cross-env NODE_ENV=development electron-forge start')
}

module.exports = {
    'start-dev': gulp.series(compileElectron, gulp.parallel(devReact, devElectron)),
}