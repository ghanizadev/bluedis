const { RedisMemoryServer } = require("redis-memory-server");
const { spawn } = require("node:child_process");
const { mkdirSync, existsSync } = require("node:fs");
const path = require("node:path");

var redis;
var redisHost;
var redisPort;

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
  });

  function spawnTask(cmd, args, env_variables, cb) {
    const handler = spawn(cmd, args, {
      env: {
        ...process.env,
        ...(env_variables ?? {}),
      },
    });

    const logData = (data) => {
      if (process.env.LOG_LEVEL?.includes("info"))
        grunt.log.write(`stdout: ${data}`);
    };

    handler.stdout.on("data", logData);

    handler.stderr.on("data", logData);

    handler.on("close", (code) => {
      if (process.env.LOG_LEVEL?.includes("info"))
        grunt.log.error(`Child process exited with code ${code}`);
      cb(!code);
    });
  }

  grunt.registerTask("setup-test", function () {
    redis = new RedisMemoryServer();

    const done = this.async();

    Promise.all([redis.getHost(), redis.getPort()]).then(([host, port]) => {
      grunt.log.write("host: " + host + "... ").ok();
      grunt.log.write("port: " + port + "... ").ok();

      redisHost = host;
      redisPort = port;

      done();
    });
  });

  grunt.registerTask("teardown-test", function () {
    const done = this.async();

    redis.stop().then(() => {
      done();
    });
  });

  grunt.registerTask("check-dist", function () {
    const dir = path.resolve(process.cwd(), "dist");

    if (!existsSync(dir)) {
      mkdirSync(dir);
    }
  });

  grunt.registerTask("test-cargo", function () {
    const done = this.async();

    spawnTask(
      "cargo",
      [
        "test",
        "--jobs",
        "1",
        "--manifest-path",
        "./src-tauri/Cargo.toml",
        "--verbose",
      ],
      {
        REDIS_HOST: redisHost,
        REDIS_PORT: redisPort,
      },
      done
    );
  });

  grunt.registerTask("test-cargo-cov", function () {
    const done = this.async();

    spawnTask(
      "cargo",
      [
        "tarpaulin",
        "--out",
        "lcov",
        "--output-dir",
        "../coverage/app",
        "--manifest-path",
        "./src-tauri/Cargo.toml",
        "--verbose",
      ],
      {
        REDIS_HOST: redisHost,
        REDIS_PORT: redisPort,
      },
      done
    );
  });

  grunt.registerTask("build-cargo", function () {
    const done = this.async();

    spawnTask(
      "cargo",
      ["build", "--manifest-path", "./src-tauri/Cargo.toml", "--verbose"],
      {},
      done
    );
  });

  grunt.registerTask("build-tauri", function () {
    const done = this.async();

    spawnTask("npx", ["tauri", "build"], {}, done);
  });

  grunt.registerTask("test", [
    "check-dist",
    "setup-test",
    "test-cargo",
    "teardown-test",
  ]);

  grunt.registerTask("coverage", [
    "check-dist",
    "setup-test",
    "test-cargo-cov",
    "teardown-test",
  ]);
  grunt.registerTask("build", ["check-dist", "build-tauri"]);
};
