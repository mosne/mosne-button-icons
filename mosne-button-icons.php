<?php
/**
 * Plugin Name:       Mosne Button Icons
 * Plugin URI:        https://github.com/mosne/mosne-button-icons
 * Description:       Insert WordPress icons inline in Rich Text, the same way as inline images.
 * Requires at least: 7.1
 * Requires PHP:      7.2
 * Version:           0.2.0
 * Author:            Mosne
 * Author URI:        https://mosne.it
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       mosne-button-icons
 * Domain Path:       /languages
 *
 * @package MosneButtonIcons
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'MOSNE_BUTTON_ICONS_VERSION', '0.2.0' );
define( 'MOSNE_BUTTON_ICONS_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'MOSNE_BUTTON_ICONS_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

require_once MOSNE_BUTTON_ICONS_PLUGIN_DIR . 'includes/collections.php';

if ( is_admin() ) {
	require_once MOSNE_BUTTON_ICONS_PLUGIN_DIR . 'includes/settings.php';
}

/**
 * Returns whether the Icons API is available.
 *
 * @since 0.2.0
 * @return bool
 */
function mosne_button_icons_has_icons_api() {
	return function_exists( 'wp_get_icon' ) && class_exists( 'WP_Icons_Registry' );
}

/**
 * Converts a registered icon file path into a public URL.
 *
 * Icons may be registered from a file or from inline markup, and the Icons API
 * only exposes the filesystem path. Paths stored outside the site root cannot be
 * served, so callers need to fall back to inline markup.
 *
 * @since 0.2.0
 *
 * @param string $file_path Absolute path to an icon file.
 * @return string Public URL, or an empty string when the file is not served.
 */
function mosne_button_icons_get_icon_url( $file_path ) {
	$root = wp_normalize_path( untrailingslashit( ABSPATH ) );
	$path = wp_normalize_path( $file_path );

	if ( 0 !== strpos( $path, $root . '/' ) || '.svg' !== substr( $path, -4 ) ) {
		return '';
	}

	return site_url( substr( $path, strlen( $root ) ) );
}

/**
 * Builds the CSS mask rules that preview inline icons in the editor.
 *
 * Icons served from a file are referenced by URL so the browser only downloads
 * the ones actually displayed, instead of parsing every registered icon inlined
 * as a data URI.
 *
 * @since 0.2.0
 * @return string
 */
function mosne_button_icons_get_mask_css() {
	if ( ! mosne_button_icons_has_icons_api() ) {
		return '';
	}

	$icons = WP_Icons_Registry::get_instance()->get_registered_icons();
	$css   = '';

	foreach ( $icons as $icon ) {
		if ( ! isset( $icon['name'] ) || '' === $icon['name'] ) {
			continue;
		}

		$url = ( ! isset( $icon['file_path'] ) || '' === $icon['file_path'] )
			? ''
			: mosne_button_icons_get_icon_url( $icon['file_path'] );

		if ( '' !== $url ) {
			$mask = sprintf( 'url("%s")', esc_url( $url ) );
		} elseif ( isset( $icon['content'] ) && '' !== $icon['content'] ) {
			/*
			 * Inline markup is sanitized by the registry with wp_kses(), which
			 * lowercases attribute names. A data URI is parsed as case-sensitive
			 * XML, so `viewbox` is ignored there: the SVG loses its aspect ratio
			 * and `mask-size` has nothing to scale.
			 */
			$svg  = preg_replace( '/\sviewbox=/i', ' viewBox=', $icon['content'] );
			$mask = 'url("data:image/svg+xml,' . rawurlencode( $svg ) . '")';
		} else {
			continue;
		}

		$css .= sprintf(
			'.wp-inline-icon[data-icon="%s"]{--wp-inline-icon-mask:%s;}',
			esc_attr( $icon['name'] ),
			$mask
		);
	}

	return $css;
}

/**
 * Enqueues editor script and styles.
 *
 * @since 0.2.0
 * @return void
 */
function mosne_button_icons_enqueue_editor_assets() {
	$asset_path = plugin_dir_path( __FILE__ ) . 'build/index.asset.php';
	if ( ! file_exists( $asset_path ) ) {
		return;
	}

	/** @var array{dependencies: list<string>, version: string} $asset_file */
	$asset_file = include $asset_path;

	wp_enqueue_script(
		'mosne-button-icons-editor',
		plugin_dir_url( __FILE__ ) . 'build/index.js',
		$asset_file['dependencies'],
		$asset_file['version'],
		array( 'in_footer' => true )
	);

	wp_set_script_translations(
		'mosne-button-icons-editor',
		'mosne-button-icons',
		plugin_dir_path( __FILE__ ) . 'languages'
	);

	$editor_style = plugin_dir_path( __FILE__ ) . 'build/index.css';
	if ( file_exists( $editor_style ) ) {
		wp_enqueue_style(
			'mosne-button-icons-editor',
			plugin_dir_url( __FILE__ ) . 'build/index.css',
			array(),
			$asset_file['version']
		);
	}
}
add_action( 'enqueue_block_editor_assets', 'mosne_button_icons_enqueue_editor_assets', 10, 0 );

/**
 * Enqueues shared inline-icon styles (editor canvas and frontend).
 *
 * @since 0.2.0
 * @return void
 */
function mosne_button_icons_enqueue_block_assets() {
	$asset_path = plugin_dir_path( __FILE__ ) . 'build/index.asset.php';
	if ( ! file_exists( $asset_path ) ) {
		return;
	}

	/** @var array{dependencies: list<string>, version: string} $asset_file */
	$asset_file = include $asset_path;
	$style_path = plugin_dir_path( __FILE__ ) . 'build/style-index.css';

	if ( ! file_exists( $style_path ) ) {
		$style_path = plugin_dir_path( __FILE__ ) . 'build/index.css';
	}

	if ( ! file_exists( $style_path ) ) {
		return;
	}

	$style_url = plugin_dir_url( __FILE__ ) . ( false !== strpos( $style_path, 'style-index.css' ) ? 'build/style-index.css' : 'build/index.css' );

	wp_enqueue_style(
		'mosne-button-icons',
		$style_url,
		array(),
		$asset_file['version']
	);

	if ( is_admin() ) {
		wp_add_inline_style( 'mosne-button-icons', mosne_button_icons_get_mask_css() );
	}
}
add_action( 'enqueue_block_assets', 'mosne_button_icons_enqueue_block_assets', 10, 0 );

/**
 * Allows inline icon attributes in post content.
 *
 * @since 0.2.0
 *
 * @param array  $tags    Allowed HTML tags.
 * @param string $context KSES context.
 * @return array
 */
function mosne_button_icons_kses_allowed_html( $tags, $context ) {
	if ( 'post' !== $context ) {
		return $tags;
	}

	if ( isset( $tags['img'] ) && is_array( $tags['img'] ) ) {
		$tags['img']['data-icon'] = true;
	}

	// Kept for icons saved before the format moved to a void element.
	if ( isset( $tags['span'] ) && is_array( $tags['span'] ) ) {
		$tags['span']['data-icon']   = true;
		$tags['span']['aria-hidden'] = true;
		$tags['span']['aria-label']  = true;
	}

	return $tags;
}
add_filter( 'wp_kses_allowed_html', 'mosne_button_icons_kses_allowed_html', 10, 2 );

/**
 * Wraps a registered icon in the inline span rendered on the front end.
 *
 * @since 0.2.0
 *
 * @param string $tag Opening tag of the icon placeholder.
 * @return string Span wrapping the SVG, or an empty string when unavailable.
 */
function mosne_button_icons_render_placeholder( $tag ) {
	$processor = new WP_HTML_Tag_Processor( $tag );
	if ( ! $processor->next_tag() ) {
		return '';
	}

	$name = $processor->get_attribute( 'data-icon' );
	if ( ! is_string( $name ) || ! preg_match( '/^[a-z0-9](?:[a-z0-9_-]*[a-z0-9])?\/[a-z0-9](?:[a-z0-9_-]*[a-z0-9])?$/', $name ) ) {
		return '';
	}

	// The alt text doubles as the accessible label; empty means decorative.
	$label = $processor->get_attribute( 'alt' );
	if ( ! is_string( $label ) ) {
		$label = $processor->get_attribute( 'aria-label' );
	}

	$svg = wp_get_icon(
		$name,
		array(
			'size'  => null,
			'label' => is_string( $label ) ? $label : '',
		)
	);

	if ( '' === $svg ) {
		return '';
	}

	$style      = $processor->get_attribute( 'style' );
	$style_attr = is_string( $style ) && '' !== $style
		? sprintf( ' style="%s"', esc_attr( $style ) )
		: '';

	return sprintf( '<span class="wp-inline-icon"%s>%s</span>', $style_attr, $svg );
}

/**
 * Replaces inline icon placeholders with SVG from the Icons API.
 *
 * @since 0.2.0
 *
 * @param string $block_content Rendered block HTML.
 * @return string
 */
function mosne_button_icons_render_inline_icons( $block_content ) {
	if ( ! mosne_button_icons_has_icons_api() || false === strpos( $block_content, 'wp-inline-icon' ) ) {
		return $block_content;
	}

	$patterns = array(
		// Current markup: a void image placeholder.
		'/<img\b(?=[^>]*\bwp-inline-icon\b)(?=[^>]*\bdata-icon=)[^>]*>/i',
		// Icons saved before the format moved to a void element. The closing tag
		// is optional because Rich Text never wrote one.
		'/<span\b(?=[^>]*\bwp-inline-icon\b)(?=[^>]*\bdata-icon=)[^>]*>(?!\s*<svg)\s*(?:<\/span>)?/i',
	);

	foreach ( $patterns as $pattern ) {
		$replaced = preg_replace_callback(
			$pattern,
			static function ( $matches ) {
				$rendered = mosne_button_icons_render_placeholder( $matches[0] );

				return '' === $rendered ? $matches[0] : $rendered;
			},
			$block_content
		);

		if ( is_string( $replaced ) ) {
			$block_content = $replaced;
		}
	}

	return $block_content;
}
add_filter( 'render_block', 'mosne_button_icons_render_inline_icons', 10, 1 );
