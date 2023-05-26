import { execSync } from "node:child_process";
import { mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import gulp from "gulp";
import { RedisMemoryServer } from 'redis-memory-server';

let redis;
let redis_host = "";
let redis_port = 0;

async function setupTests(cb) {
  redis = new RedisMemoryServer();
  
  redis_host = await redis.getHost();
  redis_port = await redis.getPort();
  
  cb();
}

function checkDistFolder(cb) {
  const dir = path.resolve(process.cwd(), 'dist');
  
  if(!existsSync(dir)){
    mkdirSync(dir)
  }
  
  cb();
}

function testCargo(cb) {
  execSync(`REDIS_HOST="${redis_host}" REDIS_PORT="${redis_port}" $HOME/.cargo/bin/cargo test --jobs 1 --manifest-path ./src-tauri/Cargo.toml`);
  cb();
}

function coverageCargo(cb) {
  execSync(`REDIS_HOST="${redis_host}" REDIS_PORT="${redis_port}" $HOME/.cargo/bin/cargo tarpaulin --out lcov --output-dir ../coverage/app --manifest-path ./src-tauri/Cargo.toml`);
  cb();
}

async function teardownTests(cb) {
  await redis.stop();
  cb();
}

export const test = gulp.series([setupTests, checkDistFolder, testCargo, teardownTests]);
export const coverage = gulp.series([setupTests, checkDistFolder, coverageCargo, teardownTests]);
