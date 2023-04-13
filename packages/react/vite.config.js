const { resolve } = require("path");
import dts from "vite-plugin-dts";

module.exports = {
  build: {
    lib: {
      entry: resolve(__dirname, "lib/index.tsx"),
      name: "@iamjs/react",
      fileName: "index",
      formats: ["cjs", "es", "umd"],
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      outputDir: "dist/types",
    }),
  ],
  rollupOptions: {
    external: ["react"],
    output: {
      globals: {
        react: "React",
      },
    },
  },
};
