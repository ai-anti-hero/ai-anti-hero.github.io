// @ts-check

/**
 * @typedef {Object} GlossaryEntry
 * @property {string} href - Target glossary URL path (with trailing slash).
 * @property {string[]} [terms] - Case-insensitive terms to auto-link.
 * @property {string[]} [caseSensitiveTerms] - Case-sensitive acronyms/terms.
 */

/**
 * Mapping of glossary pages to terms matched in document prose.
 * Longer phrases are automatically prioritized over shorter substrings.
 *
 * @type {GlossaryEntry[]}
 */
export const glossaryTerms = [
	{
		href: '/glossary/llm/',
		terms: [
			'Large Language Models (LLMs)',
			'Large Language Model (LLM)',
			'large language models',
			'large language model',
		],
		caseSensitiveTerms: ['LLMs', 'LLM'],
	},
	{
		href: '/glossary/parameters/',
		terms: ['parameters', 'parameter'],
	},
];
