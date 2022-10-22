#! /usr/bin/env node

import { exec } from "child_process";
import { Command } from "commander";
import { Controller } from "../src/container/Controller.mjs";
import { Model } from "../src/container/Model.mjs";

const program = cmd();

function cmd() {
  return new Command();
}

program
  .name("Frame Js CLI")
  .description(
    "CLI to Frame Js to create or config some setting in the application."
  )
  .version("1.0.0");

//* create
program.addCommand(
  cmd()
    .command("create")
    .argument("<name>", "File Name (don't use space in name, use {_,-})")
    .description("Create a brand new express app in the directory.")
    .action(function (name, option) {
      try {
        var res = exec(`git clone ksoftm/utile.git ${name}`);
        console.log(res);
      } catch (error) {
        console.log("error: Framework app clone failed.\n");
        console.log(error.stderr);
      }
    })
);

//* install
program.addCommand(
  cmd()
    .command("install")
    .description("Install the packages for the directory (default:npm).")
    .option("-y --yarn", "Install the packages using yarn.")
    .option("-n --npm", "Install the packages using npm.")
    .action(function (option) {
      console.log(option);
      if (option.npm || option.npm == null || option.yarn == null) {
        c = "npm install";
      } else if (option.yarn) {
        c = "yarn install";
      }
      exec(c, (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
    })
);

//* make:model
program.addCommand(
  cmd()
    .command("make:model")
    .argument("<name>", "file name (don't use space in name, use {_,-})")
    .description("Create a Model class in the app directory")
    .option("-c, --controller", "Make controller in this name.")
    .action(async (n, o) => await Model(n, o))
);

//* make:controller
program.addCommand(
  cmd()
    .command("make:controller")
    .argument("<name>", "file name (don't use space in name, use {_,-})")
    .description("Create a Controller class in the app directory")
    .option("-m, --model", "Make controller in this name.")
    .action(async (n, o) => await Controller(n, o))
);

program.parse();
