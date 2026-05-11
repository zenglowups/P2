import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const assets = [
  { source: "style.css", target: "style.min.css", type: "css" },
  { source: "seo-pages.css", target: "seo-pages.min.css", type: "css" },
  { source: "site.js", target: "site.min.js", type: "js" },
];

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function minifyCss(input) {
  return input
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>+~])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

function stripJsComments(input) {
  let output = "";
  let state = "code";
  let quote = "";
  let escaped = false;

  for (let index = 0; index < input.length; index += 1) {
    const current = input[index];
    const next = input[index + 1];

    if (state === "string") {
      output += current;
      if (escaped) {
        escaped = false;
      } else if (current === "\\") {
        escaped = true;
      } else if (current === quote) {
        state = "code";
      }
      continue;
    }

    if (state === "line-comment") {
      if (current === "\n") {
        output += current;
        state = "code";
      }
      continue;
    }

    if (state === "block-comment") {
      if (current === "*" && next === "/") {
        index += 1;
        state = "code";
      }
      continue;
    }

    if (current === "\"" || current === "'" || current === "`") {
      state = "string";
      quote = current;
      escaped = false;
      output += current;
      continue;
    }

    if (current === "/" && next === "/") {
      state = "line-comment";
      index += 1;
      continue;
    }

    if (current === "/" && next === "*") {
      state = "block-comment";
      index += 1;
      continue;
    }

    output += current;
  }

  return output;
}

function minifyJs(input) {
  return stripJsComments(input)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

for (const asset of assets) {
  const sourcePath = path.join(root, asset.source);
  const targetPath = path.join(root, asset.target);
  const source = fs.readFileSync(sourcePath, "utf8");
  const minified = asset.type === "css" ? minifyCss(source) : minifyJs(source);
  fs.writeFileSync(targetPath, `${minified}\n`, "utf8");

  const sourceSize = fs.statSync(sourcePath).size;
  const targetSize = fs.statSync(targetPath).size;
  const saved = Math.max(0, 1 - targetSize / sourceSize) * 100;

  console.log(
    `${asset.target}: ${formatBytes(sourceSize)} -> ${formatBytes(targetSize)} (${saved.toFixed(1)}% mai mic)`,
  );
}
