"use strict";

const chalk = require("chalk");

const clearConsole = () => {
  process.stdout.write(
    process.platform === "win32"
      ? "\x1B[2J\x1B[0f"
      : "\x1B[2J\x1B[3J\x1B[H"
  );
};

clearConsole();

/* =========================
   RGB LOADING SAFE MODE
========================= */

const spinner = ["◐", "◓", "◑", "◒"];
const colors = [
  "#ff0000",
  "#ff7f00",
  "#ffff00",
  "#00ff00",
  "#00ffff",
  "#0000ff",
  "#8b00ff",
];

let i = 0;

const loading = setInterval(() => {
  clearConsole();

  const spin = spinner[i % spinner.length];
  const color = colors[i % colors.length];

  console.log(
    chalk.hex(color).bold("        " + spin + "  BAILEYS SARCRAZZY  " + spin) +
    chalk.hex(color).italic("\n            loading system...\n")
  );

  i++;
}, 120);

setTimeout(() => {
  clearInterval(loading);
  clearConsole();

  console.log(chalk.white(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`));

  console.log(
    chalk.hex("#d7a1ff").italic("     T H A N K S   F O R   U S I N G\n") +
    chalk.hex("#a78bfa").italic("           M Y   B A I L E Y S ♡\n\n") +
    chalk.hex("#89CFF0").italic("     last updated • 19 January 2026\n") +
    chalk.hex("#c084fc").italic("     Baileys by @sarcrazzy-dev\n") +
    chalk.hex("#a78bfa").italic("           telegram: @SarDev2\n\n") +
    chalk.hex("#d7a1ff").italic("          ⋆ ˚ ✧ ₊ ˚ ෆ\n")
  );

  console.log(chalk.white(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`));
}, 2500);

// ============================
// FIXED __createBinding
// ============================

var createBinding =
  (this && this.createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || (!("get" in desc) && (desc.writable || desc.configurable))) {
          desc = { enumerable: true, get: function () { return m[k]; } };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });

var exportStar =
  (this && this.exportStar) ||
  function (m, exports) {
    for (var p in m)
      if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p))
        createBinding(exports, m, p);
  };

var importDefault =
  (this && this.importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };

Object.defineProperty(exports, "__esModule", { value: true });

const Socket_1 = importDefault(require("./Socket"));
exports.makeWASocket = Socket_1.default;

exportStar(require("../WAProto"), exports);
exportStar(require("./Utils"), exports);
exportStar(require("./Types"), exports);
exportStar(require("./Store"), exports);
exportStar(require("./Defaults"), exports);
exportStar(require("./WABinary"), exports);
exportStar(require("./WAM"), exports);
exportStar(require("./WAUSync"), exports);

exports.default = Socket_1.default;
