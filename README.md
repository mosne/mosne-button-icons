# Mosne Button Icons

Insert WordPress icons inline in Rich Text, the same way as inline images.

## Description

This plugin adds an **Inline icon** format to the block editor toolbar. It works anywhere Rich Text allows formats (paragraphs, headings, buttons, and more).

Icons come from the WordPress Icons API (the same library as the `core/icon` block), including collections registered by themes and plugins via `wp_register_icon()`.

The format stores an icon name. On the front end, WordPress renders the SVG with `wp_get_icon()` so the icon inherits the surrounding text color.

## Features

* Inline icon Rich Text format in the block editor toolbar
* Works in paragraphs, headings, buttons, and other Rich Text fields
* Uses the WordPress Icons API (`wp_get_icon`, `wp_register_icon`)
* Ships with a Phosphor icon collection under `icon-collections/`
* Toggle built-in collections via Settings or the `mosne_button_icons_collection_enabled` filter
* Front-end SVG rendering that inherits text color
* Accessible labels via alt / aria-label (empty means decorative)

## Requirements

* WordPress 7.1 or later (Icons API)
* PHP 7.2 or later

## Installation

1. Go to Plugins → Add New and search for "Mosne Button Icons", or upload the plugin zip.
2. Activate the plugin through the Plugins screen in WordPress.
3. In the block editor, place the cursor in Rich Text and choose **Inline icon** from the format toolbar.

## Development

```bash
npm install
npm start          # watch mode
npm run build      # production build
npm run lint:js
npm run check      # version consistency
composer install
composer cs        # PHPCS / WPCS
```

`npm install` copies the Phosphor **regular** SVGs from `@phosphor-icons/core` into `icon-collections/phosphor/` (gitignored, included in releases). Additional collections can be added as sibling folders under `icon-collections/`. To refresh Phosphor icons after bumping the package:

```bash
npm update @phosphor-icons/core
npm run copy-icons
```

Disable a collection from PHP:

```php
add_filter(
	'mosne_button_icons_collection_enabled',
	static function ( $enabled, $slug ) {
		if ( 'phosphor' === $slug ) {
			return false;
		}
		return $enabled;
	},
	10,
	2
);
```

Or use **Settings → Mosne Button Icons** to toggle collections with checkboxes (all enabled by default).

Version bump (keeps `.plugin-data`, `readme.txt`, PHP header/constant, and `package.json` in sync):

```bash
npm run version:patch
npm run version:minor
npm run version:major
```

## WordPress.org assets

Place marketing assets in [`.wordpress-org/`](.wordpress-org/). See [`.wordpress-org/ASSETS.md`](.wordpress-org/ASSETS.md) for required filenames and sizes.

### Stay Connected

* [View on GitHub](https://github.com/mosne/mosne-button-icons)
* [Visit my website](https://mosne.it/)
* [Follow on Twitter](https://twitter.com/mosne)

## Credits

SVG icons are from [Phosphor Icons](https://phosphoricons.com), via [`@phosphor-icons/core`](https://www.npmjs.com/package/@phosphor-icons/core) (MIT License). Copyright (c) 2023 Phosphor Icons.

## License

GPL-2.0-or-later
