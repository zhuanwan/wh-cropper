import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/cropper.ts',
      name: 'cropper',
      // formats: ['es'],
      fileName: (format) => `cropper.${format}.js`,
    },
    outDir: 'lib',
  },
})
