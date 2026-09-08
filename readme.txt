=== Mosne Button Icons ===
Contributors:      mosne
Tags:              icons, rich-text, button, block-editor, phosphor
Requires at least: 7.1
Tested up to:      7.1
Requires PHP:      7.2
Stable tag:        0.2.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Insert WordPress icons inline in Rich Text, the same way as inline images.

== Description ==

Adds an **Inline icon** format to the block editor toolbar. It works anywhere Rich Text allows formats (paragraphs, headings, buttons, lists, and more).

Icons come from the WordPress Icons API (the same library as the `core/icon` block), including collections registered by themes and plugins via `wp_register_icon()`.

The format stores an icon name. On the front end, WordPress renders the SVG with `wp_get_icon()` so the icon inherits the surrounding text color.

= Features =

* Inline icon Rich Text format in the block editor toolbar
* Works in paragraphs, headings, buttons, and other Rich Text fields
* Uses the WordPress Icons API (`wp_get_icon`, `wp_register_icon`)
* Ships with a Phosphor icon collection under icon-collections/
* Toggle built-in collections via Settings or a filter
* Front-end SVG rendering that inherits text color
* Accessible labels via alt / aria-label (empty means decorative)

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/mosne-button-icons` directory, or install the plugin through the WordPress plugins screen.
1. Activate the plugin through the 'Plugins' screen in WordPress.
1. In the block editor, place the cursor in Rich Text and choose Inline icon from the format toolbar.

== Frequently Asked Questions ==

= Which WordPress version do I need? =

WordPress 7.1 or later is required because the plugin relies on the Icons API.

= Can I use icons from other collections? =

Yes. Any collection registered with `wp_register_icon()` / `wp_register_icon_collection()` is available in the picker.

= How do I disable a built-in collection? =

Go to Settings → Mosne Button Icons and uncheck the collection, or use the `mosne_button_icons_collection_enabled` filter in code. Collections are enabled by default.

= How do icons look on the front end? =

Placeholders are replaced with SVG markup from `wp_get_icon()`, so icons inherit the surrounding text color.

== Screenshots ==

1. Inline icon format in the Rich Text toolbar (add screenshot-1.png to .wordpress-org/)
2. Icon picker with Phosphor collection (add screenshot-2.png to .wordpress-org/)
3. Inline icons rendered in a button on the front end (add screenshot-3.png to .wordpress-org/)

== Credits ==

This plugin ships SVG icons from [Phosphor Icons](https://phosphoricons.com), distributed via the [`@phosphor-icons/core`](https://www.npmjs.com/package/@phosphor-icons/core) package.

Phosphor Icons is licensed under the [MIT License](https://opensource.org/licenses/MIT). Copyright (c) 2023 Phosphor Icons.

== Changelog ==

= 0.2.0 =
* Replace custom SVG attributes with a global Rich Text format backed by the Icons API.

= 0.1.0 =
* Initial release.