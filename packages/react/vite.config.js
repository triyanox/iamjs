const { resolve } = require("path");
import dts from "vite-plugin-dts";

module.exports = {
  build: {
    lib: {
      entry: resolve(__dirname, "index.tsx"),
      name: "@iamjs/react",
      fileName: "index",
      formats: ["cjs", "es", "umd"],
    },
  },
  plugins: [dts()],
  rollupOptions: {
    external: ["react"],
    output: {
      globals: {
        react: "React",
      },
    },
  },
};
