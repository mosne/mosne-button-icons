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
	tagName: 'span',
	className: 'wp-inline-icon',
	object: true,
	attributes: {
		icon: 'data-icon',
		style: 'style',
		label: 'aria-label',
		ariaHidden: 'aria-hidden',
	},
	edit: Edit,
} );
