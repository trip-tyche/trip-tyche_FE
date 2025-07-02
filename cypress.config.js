import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: process.env.CI ? 'http://localhost:4173' : 'https://local.triptychetest.shop:3000',
    },
});
