/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#f8fafc', // slate-50
                surface: '#ffffff',
                primary: '#3b82f6', // blue-500
                primaryHover: '#2563eb', // blue-600
                text: '#0f172a', // slate-900
                textLight: '#64748b', // slate-500
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
                'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
            }
        },
    },
    plugins: [],
}
