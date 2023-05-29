/* eslint-disable */
import { execSync, spawn } from 'node:child_process'
import { mkdirSync, existsSync } from 'node:fs'
import path from 'node:path'
import gulp from 'gulp'
import { RedisMemoryServer } from 'redis-memory-server'

let redis
let redisHost = ''
let redisPort = 0

async function setupTests(cb) {
  redis = new RedisMemoryServer();

  redisHost = await redis.getHost();
  redisPort = await redis.getPort();

  cb();
}

function checkDistFolder(cb) {
  const dir = path.resolve(process.cwd(), 'dist');

  if (!existsSync(dir)) {
    mkdirSync(dir);
  }

  cb();
}

function testCargo(cb) {
  const env = {
    ...process.env,
    PATH: process.env.PATH + `:${process.env.HOME}/.cargo/bin/`,
    REDIS_HOST: redisHost,
    REDIS_PORT: redisPort,
  };

  const handler = spawn(
    'cargo',
    ['test', '--jobs', '1', '--manifest-path', './src-tauri/Cargo.toml', '--verbose'],
    { env }
  )

  handler.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  handler.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  handler.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    cb(code);
  });
}

function buildCargo(cb) {
  const env = {
    ...process.env,
    PATH: process.env.PATH + `:${process.env.HOME}/.cargo/bin/`,
  };

  const handler = spawn(
    'cargo',
    ['build', '--manifest-path', './src-tauri/Cargo.toml', '--verbose'],
    { env }
  )

  handler.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  handler.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  handler.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    cb(code);
  });
}

function buildCargoTauri(cb) {
  const env = {
    ...process.env,
    PATH: process.env.PATH + `:${process.env.HOME}/.cargo/bin/`,
  };

  const handler = spawn(
    'cargo',
    ['tauri', 'build'],
    { env }
  )

  handler.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  handler.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  handler.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    cb(code);
  });
}

function coverageCargo(cb) {
  execSync(
    `REDIS_HOST="${redisHost}" REDIS_PORT="${redisPort}" cargo tarpaulin --out html --output-dir ../coverage/app --manifest-path ./src-tauri/Cargo.toml`
  )
  cb();
}

async function teardownTests(cb) {
  await redis.stop();
  cb();
}

export const test = gulp.series([
  setupTests,
  checkDistFolder,
  testCargo,
  teardownTests
]);
export const buildApp = gulp.series([checkDistFolder, buildCargo]);
export const buildAll = gulp.series([checkDistFolder, buildCargoTauri]);
export const coverage = gulp.series([
  setupTests,
  checkDistFolder,
  coverageCargo,
  teardownTests
]);
