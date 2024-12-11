<?php
/**
 * Plugin Name:       Mosne Button Icons
 * Description:       Add SVG icons with ease to your theme's buttons and content.
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       mosne-button-icons
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function mosne_button_icons_block_init() {
	register_block_type( __DIR__ . '/build' );
}

add_action( 'init', 'mosne_button_icons_block_init' );


/**
 * Load SVG icons from the theme and plugin.
 */
function mosne_block_icons_load_svg(): array {

	// Scan our theme and plugin for SVG files.
	$data = [];

	$files    = glob( plugin_dir_path( __FILE__ ) . 'button-icons/*.svg' );
	$base_uri = plugin_dir_url( __FILE__ ) . 'button-icons/';

	foreach ( $files as $file ) {
		if ( empty( $file ) || ! is_readable( $file ) ) {
			continue;
		}
		$icon_name = basename( $file, '.svg' );
		$data[]    = [
			'value' => $icon_name,
			'url'   => $base_uri . $icon_name . '.svg',
			'label' => str_replace( '-', ' ', $icon_name )
		];
	}
	// Load theme SVG files.
	// mosne_button_icons_theme_dir allows developers to customize the theme directory.
	$theme_dir = apply_filters( 'mosne_button_icons_theme_dir', 'button-icons' );
	$files     = glob( get_template_directory() . '/' . $theme_dir . '/*.svg' );
	$base_uri  = get_template_directory_uri() . '/' . $theme_dir . '/';

	foreach ( $files as $file ) {
		if ( empty( $file ) || ! is_readable( $file ) ) {
			continue;
		}
		$icon_name = basename( $file, '.svg' );
		$data[]    = [
			'value' => $icon_name,
			'url'   => $base_uri . $icon_name . '.svg',
			'label' => str_replace( '-', ' ', $icon_name )
		];
	}

	return apply_filters( 'mosne_block_icons_data', $data );
}

/**
 * @return string
 */
function mosne_block_icons_generate_css(): string {
	$icons = mosne_block_icons_load_svg();
	$css   = '';
	foreach ( $icons as $icon ) {
		$css .= ".has-icon__{$icon['value']}, .wp-block-mosne-button-icon__inline[data-icon='{$icon['value']}'] { --button-icon-url: url('{$icon['url']}'); }\n";
	}

	return $css;
}

/**
 * Enqueue Editor scripts and styles.
 */
function mosne_button_icons_block_editor_assets() {
	$asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

	wp_enqueue_script(
		'mosne-button-icons-editor-scripts',
		plugin_dir_url( __FILE__ ) . 'build/button-icons.js',
		$asset_file['dependencies'],
		$asset_file['version']
	);

	wp_set_script_translations(
		'mosne-button-icons-editor-scripts',
		'mosne-button-icons',
		plugin_dir_path( __FILE__ ) . 'languages'
	);

	wp_localize_script(
		'mosne-button-icons-editor-scripts',
		'mosneButtonIcons',
		[
			'data' => mosne_block_icons_load_svg(),
		]
	);

	wp_enqueue_style(
		'mosne-button-icons-editor-styles',
		plugin_dir_url( __FILE__ ) . 'build/button-icons-editor.css'
	);

	wp_add_inline_style(
		'mosne-button-icons-editor-styles',
		mosne_block_icons_generate_css(),
	);
}

add_action( 'enqueue_block_editor_assets', 'mosne_button_icons_block_editor_assets' );

/**
 * Enqueue block styles
 * (Applies to both frontend and Editor)
 */
function mosne_button_icons_block_styles() {

	wp_enqueue_block_style(
		'core/button',
		array(
			'handle' => 'mosne-button-icons-block-button-styles',
			'src'    => plugin_dir_url( __FILE__ ) . 'build/button-icons-style.css',
			'ver'    => wp_get_theme()->get( 'Version' ),
			'path'   => plugin_dir_path( __FILE__ ) . 'build/button-icons-style.css',
		)
	);
}

add_action( 'init', 'mosne_button_icons_block_styles' );


function mosne_button_icons_inline_css() {
	wp_add_inline_style(
		'mosne-button-icons-block-button-styles',
		mosne_block_icons_generate_css(),
	);
}

add_action( 'wp_enqueue_scripts', 'mosne_button_icons_inline_css' );
