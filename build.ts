// const { mkdir } = require("fs").promises;
import { existsSync } from "fs";
import { copy } from "fs-extra";
import { mkdir } from "fs/promises";
import { buildPages } from "./src/builder";

async function createBuildDir() {
  const path = "./build";
  if (!existsSync(path)) {
    await mkdir(path);
  }
}

async function copyPublic() {
  const startPath = "./public";
  const targetPath = "./build";
  await copy(startPath, targetPath);
}

export async function build() {
  console.log("Building website...");
  await createBuildDir();
  await copyPublic();
  await buildPages();
}

build();
