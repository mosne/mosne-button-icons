/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerFormatType } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import './style.scss';
import './editor.scss';
import { FORMAT_NAME } from './constants';
import Edit from './edit';

registerFormatType( FORMAT_NAME, {
	title: __( 'Inline icon', 'mosne-button-icons' ),
	// A void element is required: Rich Text never closes object format tags.
	tagName: 'img',
	className: 'wp-inline-icon',
	object: true,
	attributes: {
		icon: 'data-icon',
		src: 'src',
		style: 'style',
		label: 'alt',
	},
	edit: Edit,
} );
