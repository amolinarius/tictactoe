import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
	corePlugins: {
		preflight: false
	},
	plugins: [daisyui],
	content: ["client/*.html"]
}