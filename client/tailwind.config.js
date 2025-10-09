/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Base Colors
                'brown': {
                    100: '#F9F8F6',
                    200: '#EFEEEB',
                    300: '#DAD6D1',
                    400: '#75716B',
                    500: '#43403B',
                    600: '#26231E',
                },
                'white': '#FFFFFF',

                // Brand Colors
                'orange': '#F2B68C',
                'green': {
                    DEFAULT: '#12B279',
                    light: '#D7F2E9',
                },
                'red': '#EB5164',
            },
            fontFamily: {
                'poppins': ['Poppins', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
