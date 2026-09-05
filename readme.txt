=== Mosne Button Icons ===
Contributors:      The WordPress Contributors
Tags:              icons, rich-text, button, block-editor
Requires at least: 7.1
Tested up to:      7.1
Requires PHP:      7.2
Stable tag:        0.2.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Insert WordPress icons inline in Rich Text, the same way as inline images.

== Description ==

Adds an **Inline icon** format to the block editor toolbar. It works anywhere Rich Text allows formats (paragraphs, headings, buttons, and more).

Icons come from the WordPress Icons API (the same library as the `core/icon` block), including collections registered by themes and plugins via `wp_register_icon()`.

The format stores an icon name. On the front end, WordPress renders the SVG with `wp_get_icon()` so the icon inherits the surrounding text color.

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/mosne-button-icons` directory, or install the plugin through the WordPress plugins screen.
1. Activate the plugin through the 'Plugins' screen in WordPress.
1. In the block editor, place the cursor in Rich Text and choose Inline icon from the format toolbar.

== Changelog ==

= 0.2.0 =
* Replace custom SVG attributes with a global Rich Text format backed by the Icons API.

= 0.1.0 =
* Initial release.
