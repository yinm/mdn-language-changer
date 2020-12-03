const pkg = require("./package.json");

const banner = `
// ==UserScript==
// @name         ${pkg.name}
// @namespace    https://yinm.info/
// @version      ${pkg.version}
// @description  ${pkg.description}
// @author       ${pkg.author}
// @match        https://developer.mozilla.org/*
// @grant        none
// ==/UserScript==
`;

require("esbuild")
  .build({
    entryPoints: ["src/main.ts"],
    bundle: true,
    outfile: "tampermonkey/main.user.js",
    format: "iife",
    banner,
  })
  .catch(() => process.exit(1));
