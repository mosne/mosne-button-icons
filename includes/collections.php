<?php
/**
 * Icon collection discovery, cache, and registration.
 *
 * @package MosneButtonIcons
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Option key for disabled collection slugs.
 *
 * @since 0.3.0
 * @var string
 */
const MOSNE_BUTTON_ICONS_DISABLED_COLLECTIONS_OPTION = 'mosne_button_icons_disabled_collections';

/**
 * Transient key for cached icon file lists.
 *
 * @since 0.3.0
 * @var string
 */
const MOSNE_BUTTON_ICONS_ICON_FILES_TRANSIENT = 'mosne_button_icons_icon_files';

/**
 * Returns the absolute path to the icon-collections directory.
 *
 * @since 0.3.0
 * @return string
 */
function mosne_button_icons_get_collections_dir() {
	return MOSNE_BUTTON_ICONS_PLUGIN_DIR . 'icon-collections/';
}

/**
 * Returns known collection metadata keyed by slug.
 *
 * Unknown folders discovered on disk still register with a derived label.
 *
 * @since 0.3.0
 * @return array<string, array{label: string, description: string}>
 */
function mosne_button_icons_get_collections_metadata() {
	$collections = array(
		'phosphor' => array(
			'label'       => __( 'Phosphor Icons', 'mosne-button-icons' ),
			'description' => __( 'A flexible icon family for interfaces, diagrams, and presentations.', 'mosne-button-icons' ),
		),
	);

	/**
	 * Filters the built-in icon collection metadata.
	 *
	 * @since 0.3.0
	 *
	 * @param array<string, array{label: string, description: string}> $collections Collections keyed by slug.
	 */
	return apply_filters( 'mosne_button_icons_collections', $collections );
}

/**
 * Discovers collection slugs from subdirectories under icon-collections/.
 *
 * @since 0.3.0
 * @return list<string>
 */
function mosne_button_icons_discover_collection_slugs() {
	$base = mosne_button_icons_get_collections_dir();

	if ( ! is_dir( $base ) ) {
		return array();
	}

	$entries = scandir( $base );
	if ( false === $entries ) {
		return array();
	}

	$slugs = array();

	foreach ( $entries as $entry ) {
		if ( '.' === $entry || '..' === $entry ) {
			continue;
		}

		$slug = sanitize_key( $entry );
		if ( '' === $slug || $slug !== $entry ) {
			continue;
		}

		$path = $base . $entry;
		if ( is_dir( $path ) ) {
			$slugs[] = $slug;
		}
	}

	sort( $slugs, SORT_STRING );

	return $slugs;
}

/**
 * Returns all available collections with label and description.
 *
 * @since 0.3.0
 * @return array<string, array{label: string, description: string, path: string}>
 */
function mosne_button_icons_get_available_collections() {
	$metadata = mosne_button_icons_get_collections_metadata();
	$slugs    = mosne_button_icons_discover_collection_slugs();
	$result   = array();

	foreach ( $slugs as $slug ) {
		$label       = isset( $metadata[ $slug ]['label'] ) ? $metadata[ $slug ]['label'] : ucwords( str_replace( array( '-', '_' ), ' ', $slug ) );
		$description = isset( $metadata[ $slug ]['description'] ) ? $metadata[ $slug ]['description'] : '';

		$result[ $slug ] = array(
			'label'       => $label,
			'description' => $description,
			'path'        => mosne_button_icons_get_collections_dir() . $slug . '/',
		);
	}

	return $result;
}

/**
 * Returns the list of disabled collection slugs from the option.
 *
 * @since 0.3.0
 * @return list<string>
 */
function mosne_button_icons_get_disabled_collections() {
	$disabled = get_option( MOSNE_BUTTON_ICONS_DISABLED_COLLECTIONS_OPTION, array() );

	if ( ! is_array( $disabled ) ) {
		return array();
	}

	$slugs = array();
	foreach ( $disabled as $slug ) {
		if ( ! is_string( $slug ) ) {
			continue;
		}
		$clean = sanitize_key( $slug );
		if ( '' !== $clean ) {
			$slugs[] = $clean;
		}
	}

	return array_values( array_unique( $slugs ) );
}

/**
 * Returns whether a collection should be registered.
 *
 * @since 0.3.0
 *
 * @param string $slug Collection slug.
 * @return bool
 */
function mosne_button_icons_is_collection_enabled( $slug ) {
	$disabled = mosne_button_icons_get_disabled_collections();
	$enabled  = ! in_array( $slug, $disabled, true );

	/**
	 * Filters whether a plugin icon collection should be registered.
	 *
	 * @since 0.3.0
	 *
	 * @param bool   $enabled Whether the collection is enabled.
	 * @param string $slug    Collection slug.
	 */
	return (bool) apply_filters( 'mosne_button_icons_collection_enabled', $enabled, $slug );
}

/**
 * Builds a freshness fingerprint for collection directories.
 *
 * @since 0.3.0
 *
 * @param array<string, array{path: string}> $collections Available collections.
 * @return array{version: string, mtimes: array<string, int>}
 */
function mosne_button_icons_get_collections_fingerprint( $collections ) {
	$mtimes = array();

	foreach ( $collections as $slug => $collection ) {
		$path            = isset( $collection['path'] ) ? $collection['path'] : '';
		$mtimes[ $slug ] = ( '' !== $path && is_dir( $path ) ) ? (int) filemtime( $path ) : 0;
	}

	ksort( $mtimes );

	return array(
		'version' => MOSNE_BUTTON_ICONS_VERSION,
		'mtimes'  => $mtimes,
	);
}

/**
 * Returns cached SVG file paths keyed by collection slug.
 *
 * Revalidates when the plugin version or a collection directory mtime changes.
 *
 * @since 0.3.0
 *
 * @param array<string, array{path: string}> $collections Available collections.
 * @return array<string, list<string>>
 */
function mosne_button_icons_get_cached_icon_files( $collections ) {
	$fingerprint = mosne_button_icons_get_collections_fingerprint( $collections );
	$cached      = get_transient( MOSNE_BUTTON_ICONS_ICON_FILES_TRANSIENT );

	if (
		is_array( $cached )
		&& isset( $cached['fingerprint'], $cached['files'] )
		&& is_array( $cached['fingerprint'] )
		&& is_array( $cached['files'] )
		&& $cached['fingerprint'] === $fingerprint
	) {
		/** @var array<string, list<string>> $files */
		$files = $cached['files'];
		return $files;
	}

	$files = array();

	foreach ( $collections as $slug => $collection ) {
		$directory  = $collection['path'];
		$icon_files = glob( $directory . '*.svg' );

		if ( false === $icon_files ) {
			$files[ $slug ] = array();
			continue;
		}

		sort( $icon_files, SORT_STRING );
		$files[ $slug ] = $icon_files;
	}

	set_transient(
		MOSNE_BUTTON_ICONS_ICON_FILES_TRANSIENT,
		array(
			'fingerprint' => $fingerprint,
			'files'       => $files,
		),
		WEEK_IN_SECONDS
	);

	return $files;
}

/**
 * Deletes the cached icon file list transient.
 *
 * @since 0.3.0
 * @return void
 */
function mosne_button_icons_flush_icon_files_cache() {
	delete_transient( MOSNE_BUTTON_ICONS_ICON_FILES_TRANSIENT );
}

/**
 * Registers enabled icon collections and their SVG files.
 *
 * @since 0.3.0
 * @return void
 */
function mosne_button_icons_register_icon_collections() {
	if (
		! function_exists( 'wp_register_icon_collection' )
		|| ! function_exists( 'wp_register_icon' )
	) {
		return;
	}

	$collections = mosne_button_icons_get_available_collections();
	if ( array() === $collections ) {
		return;
	}

	$files_by_collection = mosne_button_icons_get_cached_icon_files( $collections );

	foreach ( $collections as $slug => $collection ) {
		if ( ! mosne_button_icons_is_collection_enabled( $slug ) ) {
			continue;
		}

		$icon_files = isset( $files_by_collection[ $slug ] ) ? $files_by_collection[ $slug ] : array();
		if ( array() === $icon_files ) {
			continue;
		}

		wp_register_icon_collection(
			$slug,
			array(
				'label'       => $collection['label'],
				'description' => $collection['description'],
			)
		);

		foreach ( $icon_files as $icon_file ) {
			$icon_slug  = basename( $icon_file, '.svg' );
			$icon_label = ucwords( str_replace( array( '-', '_' ), ' ', $icon_slug ) );

			wp_register_icon(
				$slug . '/' . $icon_slug,
				array(
					'label'     => $icon_label,
					'file_path' => $icon_file,
				)
			);
		}
	}
}
add_action( 'init', 'mosne_button_icons_register_icon_collections', 1, 0 );
