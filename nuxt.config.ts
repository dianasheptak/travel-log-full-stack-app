// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

import "./lib/env";

export default defineNuxtConfig({
    compatibilityDate: "2025-05-15",
    devtools: { enabled: true },
    vite: {
        plugins: [
            tailwindcss(),
        ],
    },
    css: ["~/assets/css/main.css"],
    modules: [
        "@nuxt/image",
        "@nuxt/icon",
        "@nuxt/fonts",
        "@nuxt/eslint",
        "@nuxtjs/color-mode",
        "@pinia/nuxt",
        "@vee-validate/nuxt",
        "nuxt-csurf",
    ],
    eslint: {
        config: {
            standalone: false,
        },
    },
    colorMode: {
        dataValue: "theme",
    },
});
