import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: false,
  clean: true,
  minify: true,
  splitting: false,
  treeshake: true,
})
