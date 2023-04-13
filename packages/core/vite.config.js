const { resolve } = require("path");
import dts from "vite-plugin-dts";

module.exports = {
  build: {
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      name: "@iamjs/core",
      fileName: "index",
      formats: ["cjs", "es"],
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      outputDir: "dist/types",
    }),
  ],
};
