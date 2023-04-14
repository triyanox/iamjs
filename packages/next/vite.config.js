const { resolve } = require("path");
import dts from "vite-plugin-dts";

module.exports = {
  build: {
    lib: {
      entry: resolve(__dirname, "index.ts"),
      name: "@iamjs/next",
      fileName: "index",
      formats: ["cjs", "es"],
    },
  },
  plugins: [
    dts({
      outputDir: "dist",
    }),
  ],
};
