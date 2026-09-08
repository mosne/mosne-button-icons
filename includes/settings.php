<?php
/**
 * Admin settings for icon collections.
 *
 * @package MosneButtonIcons
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registers the plugin settings and fields.
 *
 * @since 0.3.0
 * @return void
 */
function mosne_button_icons_register_settings() {
	register_setting(
		'mosne_button_icons_settings',
		MOSNE_BUTTON_ICONS_DISABLED_COLLECTIONS_OPTION,
		array(
			'type'              => 'array',
			'description'       => __( 'Disabled icon collection slugs.', 'mosne-button-icons' ),
			'sanitize_callback' => 'mosne_button_icons_sanitize_disabled_collections',
			'default'           => array(),
			'show_in_rest'      => false,
		)
	);

	add_settings_section(
		'mosne_button_icons_collections_section',
		__( 'Icon collections', 'mosne-button-icons' ),
		'mosne_button_icons_render_collections_section',
		'mosne-button-icons'
	);

	add_settings_field(
		'mosne_button_icons_enabled_collections',
		__( 'Enabled collections', 'mosne-button-icons' ),
		'mosne_button_icons_render_collections_field',
		'mosne-button-icons',
		'mosne_button_icons_collections_section'
	);
}
add_action( 'admin_init', 'mosne_button_icons_register_settings', 10, 0 );

/**
 * Adds the settings page under Settings.
 *
 * @since 0.3.0
 * @return void
 */
function mosne_button_icons_add_settings_page() {
	add_options_page(
		__( 'Mosne Button Icons', 'mosne-button-icons' ),
		__( 'Mosne Button Icons', 'mosne-button-icons' ),
		'manage_options',
		'mosne-button-icons',
		'mosne_button_icons_render_settings_page'
	);
}
add_action( 'admin_menu', 'mosne_button_icons_add_settings_page', 10, 0 );

/**
 * Renders the settings page.
 *
 * @since 0.3.0
 * @return void
 */
function mosne_button_icons_render_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	?>
	<div class="wrap">
		<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
		<form action="options.php" method="post">
			<?php
			settings_fields( 'mosne_button_icons_settings' );
			do_settings_sections( 'mosne-button-icons' );
			submit_button();
			?>
		</form>
	</div>
	<?php
}

/**
 * Renders the collections settings section description.
 *
 * @since 0.3.0
 * @return void
 */
function mosne_button_icons_render_collections_section() {
	echo '<p>' . esc_html__( 'Choose which built-in icon collections are available in the editor. All collections are enabled by default.', 'mosne-button-icons' ) . '</p>';
}

/**
 * Renders the enabled-collections checkboxes.
 *
 * Checked means enabled; unchecked slugs are stored in the disabled option.
 *
 * @since 0.3.0
 * @return void
 */
function mosne_button_icons_render_collections_field() {
	$collections = mosne_button_icons_get_available_collections();
	$disabled    = mosne_button_icons_get_disabled_collections();

	if ( array() === $collections ) {
		echo '<p>' . esc_html__( 'No icon collections found. Run npm run copy-icons during development, or reinstall the plugin package.', 'mosne-button-icons' ) . '</p>';
		return;
	}

	echo '<fieldset>';
	echo '<legend class="screen-reader-text">' . esc_html__( 'Enabled collections', 'mosne-button-icons' ) . '</legend>';

	foreach ( $collections as $slug => $collection ) {
		$input_id = 'mosne-button-icons-collection-' . $slug;
		$checked  = ! in_array( $slug, $disabled, true );
		?>
		<label for="<?php echo esc_attr( $input_id ); ?>" style="display:block;margin-bottom:0.75em;">
			<input
				type="checkbox"
				id="<?php echo esc_attr( $input_id ); ?>"
				name="mosne_button_icons_enabled_collections[]"
				value="<?php echo esc_attr( $slug ); ?>"
				<?php checked( $checked ); ?>
			/>
			<strong><?php echo esc_html( $collection['label'] ); ?></strong>
			<?php if ( '' !== $collection['description'] ) : ?>
				<br />
				<span class="description"><?php echo esc_html( $collection['description'] ); ?></span>
			<?php endif; ?>
		</label>
		<?php
	}

	echo '</fieldset>';
}

/**
 * Sanitizes posted enabled collections into a disabled-collections option value.
 *
 * The form posts enabled checkboxes; we store the complementary disabled list so
 * newly added collections stay available by default.
 *
 * @since 0.3.0
 *
 * @param mixed $value Raw option value from Settings API (unused; form uses a different field name).
 * @return list<string>
 */
function mosne_button_icons_sanitize_disabled_collections( $value ) {
	unset( $value );

	$available = array_keys( mosne_button_icons_get_available_collections() );
	$enabled   = array();

	// phpcs:ignore WordPress.Security.NonceVerification.Missing -- Settings API verifies the nonce.
	if ( isset( $_POST['mosne_button_icons_enabled_collections'] ) && is_array( $_POST['mosne_button_icons_enabled_collections'] ) ) {
		// phpcs:ignore WordPress.Security.NonceVerification.Missing -- Settings API verifies the nonce.
		$raw_enabled = wp_unslash( $_POST['mosne_button_icons_enabled_collections'] );

		foreach ( $raw_enabled as $slug ) {
			if ( ! is_string( $slug ) ) {
				continue;
			}
			$clean = sanitize_key( $slug );
			if ( '' !== $clean && in_array( $clean, $available, true ) ) {
				$enabled[] = $clean;
			}
		}
	}

	$disabled = array_values( array_diff( $available, $enabled ) );

	mosne_button_icons_flush_icon_files_cache();

	return $disabled;
}

/**
 * Flushes the icon files cache when the disabled-collections option is updated.
 *
 * @since 0.3.0
 *
 * @param mixed $old_value Previous option value.
 * @param mixed $value     New option value.
 * @return void
 */
function mosne_button_icons_on_disabled_collections_updated( $old_value, $value ) {
	unset( $old_value, $value );
	mosne_button_icons_flush_icon_files_cache();
}
add_action( 'update_option_' . MOSNE_BUTTON_ICONS_DISABLED_COLLECTIONS_OPTION, 'mosne_button_icons_on_disabled_collections_updated', 10, 2 );
add_action( 'add_option_' . MOSNE_BUTTON_ICONS_DISABLED_COLLECTIONS_OPTION, 'mosne_button_icons_flush_icon_files_cache', 10, 0 );

/**
 * Adds a Settings link on the Plugins screen.
 *
 * @since 0.3.0
 *
 * @param array<string, string> $links Plugin action links.
 * @return array<string, string>
 */
function mosne_button_icons_plugin_action_links( $links ) {
	$settings_link = sprintf(
		'<a href="%s">%s</a>',
		esc_url( admin_url( 'options-general.php?page=mosne-button-icons' ) ),
		esc_html__( 'Settings', 'mosne-button-icons' )
	);

	array_unshift( $links, $settings_link );

	return $links;
}
add_filter( 'plugin_action_links_' . plugin_basename( MOSNE_BUTTON_ICONS_PLUGIN_DIR . 'mosne-button-icons.php' ), 'mosne_button_icons_plugin_action_links', 10, 1 );
