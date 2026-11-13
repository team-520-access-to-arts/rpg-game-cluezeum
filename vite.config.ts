import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()], base: '/rpg-game-cluezeum/', test: { include: ['src/**/*.test.ts'] } });
