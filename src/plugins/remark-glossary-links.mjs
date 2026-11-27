// @ts-check
import { SKIP, visit } from 'unist-util-visit';
import { glossaryTerms } from './glossary-map.mjs';

const IGNORED_NODE_TYPES = new Set([
	'link',
	'linkReference',
	'heading',
	'code',
	'inlineCode',
	'html',
	'yaml',
	'toml',
	'mdxjsEsm',
	'mdxFlowExpression',
	'mdxTextExpression',
]);

const IGNORED_JSX_NAMES = new Set(['a', 'LinkCard']);
const EXCLUDED_PAGES = new Set(['/', '/glossary/overview/']);

/**
 * Escape special regex characters in a literal phrase.
 *
 * @param {string} value
 * @returns {string}
 */
function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Build compiled regex matchers sorted longest-phrase-first.
 *
 * @param {import('./glossary-map.mjs').GlossaryEntry[]} entries
 */
function compileMatchers(entries) {
	/** @type {{ href: string, term: string, regex: RegExp }[]} */
	const matchers = [];

	for (const entry of entries) {
		for (const term of entry.terms ?? []) {
			const pattern = `(?<![A-Za-z0-9_-])${escapeRegExp(term)}(?![A-Za-z0-9_-])`;
			matchers.push({
				href: entry.href,
				term,
				regex: new RegExp(pattern, 'gi'),
			});
		}

		for (const term of entry.caseSensitiveTerms ?? []) {
			const pattern = `(?<![A-Za-z0-9_-])${escapeRegExp(term)}(?![A-Za-z0-9_-])`;
			matchers.push({
				href: entry.href,
				term,
				regex: new RegExp(pattern, 'g'),
			});
		}
	}

	matchers.sort((a, b) => b.term.length - a.term.length);
	return matchers;
}

/**
 * Resolve a content file path to its public Starlight route
 * (e.g. `/glossary/llm/`).
 *
 * @param {string | undefined} filePath
 * @returns {string | null}
 */
function resolvePageHref(filePath) {
	if (!filePath) return null;

	const normalized = filePath.replace(/\\/g, '/');
	const marker = '/src/content/docs/';
	const idx = normalized.indexOf(marker);
	if (idx === -1) return null;

	let slug = normalized
		.slice(idx + marker.length)
		.replace(/\.(mdx|md)$/i, '');

	if (slug === 'index') return '/';
	if (slug.endsWith('/index')) {
		slug = slug.slice(0, -'/index'.length);
	}

	return `/${slug}/`;
}

/**
 * Remark plugin that auto-links glossary terms in document prose.
 *
 * @param {{ firstOccurrenceOnly?: boolean }} [options]
 */
export function remarkGlossaryLinks(options = {}) {
	const { firstOccurrenceOnly = true } = options;
	const matchers = compileMatchers(glossaryTerms);

	/**
	 * @param {any} tree
	 * @param {any} file
	 */
	return (tree, file) => {
		const filePath = file?.history?.[0] ?? file?.path;
		const pageHref = resolvePageHref(filePath);

		if (pageHref && EXCLUDED_PAGES.has(pageHref)) {
			return;
		}

		/** @type {Set<string>} */
		const linkedHrefs = new Set();

		visit(tree, (node, index, parent) => {
			if (IGNORED_NODE_TYPES.has(node.type)) {
				return SKIP;
			}

			if (
				(node.type === 'mdxJsxFlowElement' ||
					node.type === 'mdxJsxTextElement') &&
				IGNORED_JSX_NAMES.has(node.name)
			) {
				return SKIP;
			}

			if (node.type !== 'text' || !parent || typeof index !== 'number') {
				return;
			}

			const text = /** @type {string} */ (node.value);
			if (!text || !text.trim()) return;

			/** @type {any[]} */
			const nextNodes = [];
			let cursor = 0;

			while (cursor < text.length) {
				/** @type {{ index: number, text: string, href: string } | null} */
				let earliest = null;

				for (const matcher of matchers) {
					if (matcher.href === pageHref) continue;
					if (firstOccurrenceOnly && linkedHrefs.has(matcher.href)) {
						continue;
					}

					matcher.regex.lastIndex = cursor;
					const match = matcher.regex.exec(text);
					if (!match) continue;

					const isEarlier =
						!earliest ||
						match.index < earliest.index ||
						(match.index === earliest.index &&
							match[0].length > earliest.text.length);

					if (isEarlier) {
						earliest = {
							index: match.index,
							text: match[0],
							href: matcher.href,
						};
					}
				}

				if (!earliest) break;

				if (earliest.index > cursor) {
					nextNodes.push({
						type: 'text',
						value: text.slice(cursor, earliest.index),
					});
				}

				nextNodes.push({
					type: 'link',
					url: earliest.href,
					data: { hProperties: { class: 'glossary-link' } },
					children: [{ type: 'text', value: earliest.text }],
				});

				if (firstOccurrenceOnly) {
					linkedHrefs.add(earliest.href);
				}

				cursor = earliest.index + earliest.text.length;
			}

			if (nextNodes.length === 0) return;

			if (cursor < text.length) {
				nextNodes.push({
					type: 'text',
					value: text.slice(cursor),
				});
			}

			parent.children.splice(index, 1, ...nextNodes);
			return [SKIP, index + nextNodes.length];
		});
	};
}
