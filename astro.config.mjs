// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://ai-anti-hero.github.io',
	integrations: [
		starlight({
			title: 'AI Anti-Hero',
			description: 'The Field Guide to Practical AI without the Hype',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/ai-anti-hero' },
			],
			customCss: [
				'./src/styles/custom.css',
			],
			sidebar: [
				{
					label: 'Start Here',
					items: [
						{ label: 'Welcome & Manifesto', slug: 'start-here/welcome' },
					],
				},
				{
					label: 'Field Guide Dispatches',
					items: [
						{ autogenerate: { directory: 'dispatches' } },
					],
				},
				{
					label: 'Playbooks',
					items: [
						{ autogenerate: { directory: 'playbooks' } },
					],
				},
			],
		}),
	],
});
