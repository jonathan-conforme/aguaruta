import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
        VitePWA({
            registerType: 'autoUpdate', // Actualiza la app automáticamente cuando subas cambios
            injectRegister: 'auto',
            strategies: 'generateSW',
            manifest: false,
                name: 'AquaRuta Logística',
                short_name: 'AquaRuta',
                description: 'Sistema de Gestión y Rutas para Purificadoras de Agua',
                theme_color: '#4f46e5', // Color índigo de tu botón principal
                background_color: '#f9fafb', // Gris claro de tu fondo (bg-gray-50)
                display: 'standalone', // Hace que se abra en pantalla completa sin barra de navegador
                orientation: 'portrait',
                icons: [
                    {
                        src: '/icons/icon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/icons/icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            }
        )
    ],
});
