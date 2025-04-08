var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import fs from 'fs';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
var KEY_PATH = 'certificates/local.triptychetest.shop-key.pem';
var CERT_PATH = 'certificates/local.triptychetest.shop.pem';
var baseConfig = {
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
export default defineConfig(function (_a) {
    var command = _a.command;
    // 개발 서버의 경우 HTTPS 설정 추가
    if (command === 'serve') {
        return __assign(__assign({}, baseConfig), { server: {
                port: 3000,
                host: '0.0.0.0',
                https: {
                    key: fs.readFileSync(KEY_PATH),
                    cert: fs.readFileSync(CERT_PATH),
                },
            } });
    }
    return baseConfig;
});
