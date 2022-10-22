import { pascalCase } from "pascal-case";
import { existsSync, realpathSync, mkdir } from "fs";
import { readFile, writeFile } from "fs/promises";
import { resolve, dirname } from "path";
import { Controller } from "./Controller.mjs";

const __dirname = new URL(".", import.meta.url).pathname.replace("/", "");

export async function Model(name, option) {
  const pname = pascalCase(name + "-model");
  const path = resolve(`${process.cwd()}/app/models/${pname}.mjs`);
  const pathTemplate = realpathSync(__dirname + "../template/model.template");

  if (!existsSync(path)) {
    mkdir(dirname(path), { recursive: true }, (err) => {});
  }
  if (!existsSync(pathTemplate)) {
    console.error("error: Model Template is not Contain.");
    return;
  }

  const tmp = await readFile(pathTemplate);

  const data = tmp
    .toString("utf-8")
    .replace("{{{className}}}", pname)
    .replace("{{{tableName}}}", name)
    .replace("{{{className}}}", pname);

  if (existsSync(path)) {
    console.error(`error: Model ${pname} is already exist.`);
  } else {
    writeFile(path, data).then(() => console.log(`Model ${pname} is created.`));
  }

  if (option.controller) {
    await Controller(name, []);
  }
}
