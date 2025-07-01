import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'https://local.triptychetest.shop:3000',
        setupNodeEvents(on, config) {},
    },
});
