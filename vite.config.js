// import * as path from 'path';
// import react from '@vitejs/plugin-react';
// import { defineConfig } from 'vite';
// import tsconfigPaths from 'vite-tsconfig-paths';
// export default defineConfig({
//     server: {
//         port: 3000,
//     },
//     plugins: [
//         react({
//             jsxImportSource: '@emotion/react',
//             babel: {
//                 plugins: ['@emotion/babel-plugin'],
//             },
//         }),
//         tsconfigPaths(),
//     ],
//     resolve: {
//         alias: {
//             '@': path.resolve(__dirname, './src'),
//             'scheduler/tracing': 'scheduler/tracing-profiling',
//             'rollup/parseAst': 'rollup/dist/es/parseAst.js',
//         },
//     },
//     optimizeDeps: {
//         include: ['@emotion/react', '@emotion/styled'],
//     },
//     // build: {
//     //     commonjsOptions: {
//     //         transformMixedEsModules: true,
//     //     },
//     // },
// });
// import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
export default defineConfig({
    server: {
        port: 3000,
    },
    plugins: [
        react({
            jsxImportSource: '@emotion/react',
            babel: {
                plugins: ['@emotion/babel-plugin'],
            },
        }),
        tsconfigPaths(),
    ],
    resolve: {
        alias: {
            '@': 'src',
        },
    },
    optimizeDeps: {
        include: ['@emotion/react', '@emotion/styled'],
    },
    build: {
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    },
});
