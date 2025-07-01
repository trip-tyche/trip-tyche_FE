import fs from 'fs';
import { resolve } from 'path';

import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, UserConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const KEY_PATH = 'certificates/local.triptychetest.shop-key.pem';
const CERT_PATH = 'certificates/local.triptychetest.shop.pem';

const baseConfig: UserConfig = {
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
    define: {
        global: 'window',
    },
};

export default defineConfig(({ command }) => {
    // 개발 서버의 경우 HTTPS 설정 추가
    if (command === 'serve') {
        return {
            ...baseConfig,
            server: {
                port: 3000,
                host: '0.0.0.0',
                https: getHttpsConfig(),
            },
        } as UserConfig;
    }
});

function getHttpsConfig() {
    try {
        if (fs.existsSync(KEY_PATH) && fs.existsSync(CERT_PATH)) {
            return {
                key: fs.readFileSync(KEY_PATH),
                cert: fs.readFileSync(CERT_PATH),
            };
        }
    } catch (error) {
        console.log('certificates not found');
    }
    return false;
}
