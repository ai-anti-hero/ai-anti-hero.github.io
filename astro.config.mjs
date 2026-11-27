// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import starlight from '@astrojs/starlight';
import { remarkGlossaryLinks } from './src/plugins/remark-glossary-links.mjs';

// https://astro.build/config
export default defineConfig({
	site: 'https://ai-anti-hero.github.io',
	server: {
		host: true,
	},
	markdown: {
		processor: unified({
			remarkPlugins: [remarkGlossaryLinks],
		}),
	},
	integrations: [
		starlight({
			title: 'AI Anti-Hero',
			description: 'The Field Guide to Practical AI without the Hype',
			favicon: '/ai-anti-hero.png',
			head: [
				{
					tag: 'script',
					attrs: {
						async: true,
						src: 'https://www.googletagmanager.com/gtag/js?id=G-FDK7DY5Y91',
					},
				},
				{
					tag: 'script',
					content: [
						'window.dataLayer = window.dataLayer || [];',
						'function gtag(){dataLayer.push(arguments);}',
						"gtag('js', new Date());",
						"gtag('config', 'G-FDK7DY5Y91');",
					].join('\n'),
				},
			],
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/ai-anti-hero',
				},
			],
			customCss: [
				'./src/styles/custom.css',
			],
			sidebar: [
				{
					label: 'Start Here',
					items: [
						{ label: 'Welcome', slug: 'start-here/welcome' },
					],
				},
				{
					label: 'Field Guide',
					items: [
						{ autogenerate: { directory: 'field-guide' } },
					],
				},
				{
					label: 'Playbooks',
					items: [
						{ autogenerate: { directory: 'playbooks' } },
					],
				},
				{
					label: 'Glossary',
					items: [
						{ autogenerate: { directory: 'glossary' } },
					],
				},
			],
		}),
	],
});
