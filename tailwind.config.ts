import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	  ],
	  theme: {
		extend: {
		  animation: {
			'loading-bar': 'loading 2s linear infinite',
		  },
		  keyframes: {
			loading: {
			  '0%': { left: '-50%' },
			  '100%': { left: '100%' },
			},
		  },
		},
	  },
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography'),
		require('@tailwindcss/container-queries'),
	],
}
export default config
