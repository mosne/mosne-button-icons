/**
 * Format type name. Distinct from the core/icon block.
 */
export const FORMAT_NAME = 'mosne/inline-icon';

/**
 * Default inline size, matching typical text-adjacent icons.
 */
export const DEFAULT_ICON_STYLE = 'width: 1em; height: 1em;';

/**
 * Empty square image used as the `src` of the icon placeholder.
 *
 * Rich Text serializes object formats without a closing tag, so the format has
 * to use a void element to produce valid, round-trippable HTML. The visible
 * icon comes from the mask styles in the editor and from server-rendered inline
 * SVG on the front end, so this source only needs to reserve the box without
 * triggering a broken image indicator.
 */
export const PLACEHOLDER_SRC =
	"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%2F%3E";
