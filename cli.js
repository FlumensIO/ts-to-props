#!/usr/bin/env node

const generate = require("typescript-proptypes-generator").default;
const replace = require("replace-in-file");

const [, , ...args] = process.argv;

const [dir] = args;
if (!dir) {
  throw new Error("Please provide the directory");
}

const inputPattern = `${dir}/*.d.ts`;

generate({
  tsConfig: `${__dirname}/tsconfig.json`,
  prettierConfig: "package.json",
  inputPattern,
})
  .then(() =>
    replace.sync({
      files: [`${dir}/*.d.js`],

      from: "import PropTypes from 'prop-types';",
      to:
        "import PropTypes from 'prop-types';\nimport exact from 'prop-types-exact';",
    })
  )
  .then(() =>
    replace.sync({
      files: [`${dir}/*.d.js`],

      from: "export const propTypes = {",
      to: "export default exact({",
    })
  )
  .then(() =>
    replace.sync({
      files: [`${dir}/*.d.js`],

      from: "};",
      to: "});",
    })
  )
  .then(() => {
    console.log("Done 🚀 ");
  })
  .catch(console.log);
