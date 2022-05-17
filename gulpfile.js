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

const setEnv = (env = 'development') => {
  const setEnvironment = cb => {
    process.env.BUILD_ENV = env;
    cb();
  }
  
  return setEnvironment;
}

const copy = async () => {
  await execAsync('mv build dist/app');
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

const compileReact = async() => {
  return execAsync(`npx cross-env NODE_ENV=${process.env.BUILD_ENV} BUILD_PATH=./build react-scripts build`)
}

const compileElectron = async () => {
    return execAsync('npx tsc --project tsconfig.app.json')
}

const devReact = async () => {
    return execAsync(`npx cross-env NODE_ENV=${process.env.BUILD_ENV} BROWSER=none PORT=3000 react-scripts start`)
}

const devElectron = async () => {
  if(process.env.BUILD_ENV === 'production') return execAsync(`npx cross-env NODE_ENV=${process.env.BUILD_ENV} electron-forge start`)
  
    process.stdout.write('Awaiting for dev-server...');

    while(!(await checkDevServerStatus())) {
        await new Promise(res => setTimeout(res, 1000));
        process.stdout.write('.');
    }

    process.stdout.write(' Done\n');
    return execAsync(`npx cross-env NODE_ENV=${process.env.BUILD_ENV} electron-forge start`)
}

const startElectron = async () => {
  return execAsync(`npx cross-env NODE_ENV=${process.env.BUILD_ENV} electron-forge start --app-path ./dist/main.js`)
}

const pack = async () => {
  let arg = "";
  
  switch(process.env.SNAP_ARCH)  {
    case "amd64":
      arg = " --x64"
      break;
    case "i386":
      arg = " --ia32";
      break;
    case "arm64":
      arg = " --arm64";
      break;
    case "armhf":
      arg = " --armv7l";
      break;
  }
  
  return execAsync('npx electron-forge package' + arg)
}

const make = async() => {
  let arg = "";
  const platform = process.env.BUILD_PLATFORM ? ` --platform ${process.env.BUILD_PLATFORM}` : "";

  switch(process.env.SNAP_ARCH)  {
    case "amd64":
      arg = " --x64"
      break;
    case "i386":
      arg = " --ia32";
      break;
    case "arm64":
      arg = " --arm64";
      break;
    case "armhf":
      arg = " --armv7l";
      break;
  }
  
  return execAsync('npx electron-forge make' + arg + platform)
}

const cleanup = async () => {
  return execAsync('rm -rf build dist out');
}

module.exports = {
  'start-dev': gulp.series(setEnv('development'), compileElectron, gulp.parallel(devReact, devElectron)),
  'start-prod': gulp.series(setEnv('production'), compileReact, compileElectron, copy, startElectron),
  build: gulp.series(setEnv('production'), cleanup, compileReact, compileElectron, copy, make),
  pack: gulp.series(setEnv('production'), cleanup, compileReact, compileElectron, copy, pack),
}