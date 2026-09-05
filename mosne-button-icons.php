<?php
/**
 * Plugin Name:       Mosne Button Icons
 * Description:       Insert WordPress icons inline in Rich Text, the same way as inline images.
 * Requires at least: 7.1
 * Requires PHP:      7.2
 * Version:           0.2.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       mosne-button-icons
 *
 * @package MosneButtonIcons
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Loads the plugin text domain.
 *
 * @since 0.2.0
 * @return void
 */
function mosne_button_icons_load_textdomain() {
	load_plugin_textdomain(
		'mosne-button-icons',
		false,
		dirname( plugin_basename( __FILE__ ) ) . '/languages'
	);
}
add_action( 'init', 'mosne_button_icons_load_textdomain', 0 );

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
 * Builds CSS mask rules so empty inline icon spans preview in the editor.
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
		if ( empty( $icon['name'] ) || empty( $icon['content'] ) ) {
			continue;
		}

		/*
		 * The registry sanitizes icons with wp_kses(), which lowercases
		 * attribute names. A data URI is parsed as case-sensitive XML, so
		 * `viewbox` is ignored there: the SVG loses its aspect ratio and
		 * `mask-size` has nothing to scale. Inline SVG is unaffected because
		 * the HTML parser adjusts SVG attribute case on its own.
		 */
		$svg = preg_replace( '/\sviewbox=/i', ' viewBox=', $icon['content'] );

		$mask = 'url("data:image/svg+xml,' . rawurlencode( $svg ) . '")';
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
add_action( 'enqueue_block_editor_assets', 'mosne_button_icons_enqueue_editor_assets' );

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

	$asset_file = include $asset_path;
	$style_path = plugin_dir_path( __FILE__ ) . 'build/style-index.css';

	if ( ! file_exists( $style_path ) ) {
		$style_path = plugin_dir_path( __FILE__ ) . 'build/index.css';
	}

	if ( ! file_exists( $style_path ) ) {
		return;
	}

	$style_url = plugin_dir_url( __FILE__ ) . ( str_contains( $style_path, 'style-index.css' ) ? 'build/style-index.css' : 'build/index.css' );

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
add_action( 'enqueue_block_assets', 'mosne_button_icons_enqueue_block_assets' );

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
	if ( 'post' !== $context || empty( $tags['span'] ) || ! is_array( $tags['span'] ) ) {
		return $tags;
	}

	$tags['span']['data-icon']    = true;
	$tags['span']['aria-hidden']  = true;
	$tags['span']['aria-label']   = true;

	return $tags;
}
add_filter( 'wp_kses_allowed_html', 'mosne_button_icons_kses_allowed_html', 10, 2 );

/**
 * Replaces empty inline icon spans with SVG from the Icons API.
 *
 * @since 0.2.0
 *
 * @param string $block_content Rendered block HTML.
 * @return string
 */
function mosne_button_icons_render_inline_icons( $block_content ) {
	if ( ! mosne_button_icons_has_icons_api() || ! str_contains( $block_content, 'wp-inline-icon' ) ) {
		return $block_content;
	}

	/*
	 * Rich Text serializes object formats as void elements, so the saved markup
	 * has an opening `<span>` with no closing tag. Match the opening tag only,
	 * absorbing a closing tag when one happens to be present.
	 */
	$replaced = preg_replace_callback(
		'/(<span\b(?=[^>]*\bwp-inline-icon\b)(?=[^>]*\bdata-icon=)[^>]*>)(?!\s*<svg)\s*(?:<\/span>)?/i',
		static function ( $matches ) {
			$open_tag = $matches[1];

			$processor = new WP_HTML_Tag_Processor( $open_tag );
			if ( ! $processor->next_tag( 'SPAN' ) ) {
				return $matches[0];
			}

			$name = $processor->get_attribute( 'data-icon' );
			if ( ! is_string( $name ) || ! preg_match( '/^[a-z0-9](?:[a-z0-9_-]*[a-z0-9])?\/[a-z0-9](?:[a-z0-9_-]*[a-z0-9])?$/', $name ) ) {
				return $matches[0];
			}

			$label = $processor->get_attribute( 'aria-label' );
			$svg   = wp_get_icon(
				$name,
				array(
					'size'  => null,
					'label' => is_string( $label ) ? $label : '',
				)
			);

			if ( '' === $svg ) {
				return $matches[0];
			}

			return $open_tag . $svg . '</span>';
		},
		$block_content
	);

	return is_string( $replaced ) ? $replaced : $block_content;
}
add_filter( 'render_block', 'mosne_button_icons_render_inline_icons', 10, 1 );
