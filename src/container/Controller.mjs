import { pascalCase } from "pascal-case";
import { existsSync, realpathSync, mkdir } from "fs";
import { readFile, writeFile } from "fs/promises";
import { resolve, dirname } from "path";
import { Model } from "./Model.mjs";

const __dirname = new URL(".", import.meta.url).pathname.replace("/", "");

export async function Controller(name, option) {
  // console.log(JSON.stringify({ name, option }));
  const pname = pascalCase(name + "-controller");
  const path = resolve(`${process.cwd()}/app/controllers/${pname}.mjs`);

  const pathTemplate = realpathSync(
    `${__dirname}/../template/controller.template`
  );

  if (!existsSync(path)) {
    mkdir(dirname(path), { recursive: true }, (err) => {});
  }

  if (!existsSync(pathTemplate)) {
    console.error("error: Controller Template is not Contain.");
    return;
  }

  const tmp = await readFile(pathTemplate);

  const data = tmp
    .toString("utf-8")
    .replace("{{{className}}}", pname)
    .replace("{{{className}}}", pname);

  if (existsSync(path)) {
    console.error(`error: Controller ${pname} is already exist.`);
  } else {
    writeFile(path, data).then(() =>
      console.log(`Controller ${pname} is created.`)
    );
  }

  if (option.model) {
    await Model(name, []);
  }
}
