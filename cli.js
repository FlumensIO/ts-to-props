#!/usr/bin/env node

const fs = require("fs");
const generate = require("typescript-proptypes-generator").default;
const replace = require("replace-in-file");

const [, , ...args] = process.argv;

let [source, dest] = args;
if (!source || !source.includes(".d.ts")) {
  throw new Error("Please provide the source index.d.ts");
}

if (!dest) {
  dest = source.split("/");
  dest.pop();
  dest = dest.join("/") + "/propTypes.js";
}

const tsConfig = `${__dirname}/tsconfig.json`;

const config = require(tsConfig);
config.include = [process.env.PWD];
require("fs").writeFileSync(tsConfig, JSON.stringify(config));

generate({
  tsConfig,
  prettierConfig: "package.json",
  inputPattern: source,
})
  .then(() => {
    const tempFileName = source.replace(".ts", ".js");
    fs.renameSync(tempFileName, dest);
  })
  .then(() =>
    replace.sync({
      files: [dest],

      from: "import PropTypes from 'prop-types';",
      to:
        "import PropTypes from 'prop-types';\nimport exact from 'prop-types-exact';",
    })
  )
  .then(() =>
    replace.sync({
      files: [dest],

      from: "export const propTypes = {",
      to: "export default exact({",
    })
  )
  .then(() =>
    replace.sync({
      files: [dest],

      from: "};",
      to: "});",
    })
  )
  .then(() => {
    console.log(`⚙️ ${dest}`);
    console.log(`🚀 Done!`);
  })
  .catch(console.error);
