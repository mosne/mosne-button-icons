<?php
/**
 * Plugin Name:       Mosne Button Icons
 * Description:       Example block scaffolded with Create Block tool.
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
 * Enqueue Editor scripts and styles.
 */
function mosne_button_icons_block_editor_assets() {
	$asset_file  = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

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

	wp_enqueue_style(
		'mosne-button-icons-editor-styles',
		plugin_dir_url( __FILE__ ) . 'build/button-icons-editor.css'
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
			'handle' => 'mosne-button-icons-block-styles',
			'src'    => plugin_dir_url( __FILE__ ) . 'build/button-icons-style.css',
			'ver'    => wp_get_theme()->get( 'Version' ),
			'path'   => plugin_dir_path( __FILE__ ) . 'build/button-icons-style.css',
		)
	);
}
add_action( 'init', 'mosne_button_icons_block_styles' );
