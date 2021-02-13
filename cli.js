#!/usr/bin/env node

const fs = require("fs");
const generate = require("typescript-proptypes-generator").default;
const replace = require("replace-in-file");

const [, , ...args] = process.argv;

const [source, dest] = args;
if (!source) {
  throw new Error("Please provide the source");
}

if (!dest) {
  throw new Error("Please provide the destination");
}

generate({
  tsConfig: `${__dirname}/tsconfig.json`,
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
    console.log("Done 🚀 ");
  })
  .catch(console.log);
