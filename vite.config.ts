import { resolve } from 'path';

import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [
        react({
            jsxImportSource: '@emotion/react',
            babel: {
                plugins: ['@emotion/babel-plugin'],
            },
        }),
        tsconfigPaths(),
        visualizer({
            open: true,
            gzipSize: true,
        }),
    ],
    resolve: {
        alias: [{ find: '@', replacement: resolve(__dirname, 'src') }],
    },
    optimizeDeps: {
        include: ['@emotion/react'],
    },
    build: {
        target: 'esnext',
        minify: 'esbuild',
        sourcemap: false,
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    },
});
