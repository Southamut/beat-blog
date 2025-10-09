import { defineConfig } from 'tailwindcss'

export default defineConfig({
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Base Colors
                brown: {
                    100: '#f9f8f6',
                    200: '#efeeeb',
                    300: '#dad6d1',
                    400: '#75716b',
                    500: '#43403b',
                    600: '#26231e',
                },
                white: '#ffffff',

                // Brand Colors
                orange: '#f2b68c',
                green: {
                    DEFAULT: '#12b279',
                    light: '#d7f2e9',
                },
                red: '#eb5164',
            },
            fontFamily: {
                poppins: ['Poppins', 'sans-serif'],
            },
        },
    },
    plugins: [],
})
