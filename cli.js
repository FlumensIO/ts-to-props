#!/usr/bin/env node

const generate = require("typescript-proptypes-generator").default;

const [, , ...args] = process.argv;

const [dir] = args;

if (!dir) {
  throw new Error("Please provide the directory");
}

const inputPattern = `${dir}/*.ts`;
console.log(inputPattern);

generate({
  tsConfig: "./tsconfig.json",
  prettierConfig: "package.json",
  inputPattern,
});
