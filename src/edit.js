/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { starFilled } from '@wordpress/icons';
import { insertObject, remove } from '@wordpress/rich-text';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { DEFAULT_ICON_STYLE, FORMAT_NAME, PLACEHOLDER_SRC } from './constants';
import IconPicker from './icon-picker';
import InlineUI from './inline-ui';

/**
 * Build format attributes for an icon object.
 *
 * @param {string} iconName   Namespaced icon name.
 * @param {Object} [existing] Existing attributes when replacing.
 * @return {Object} Format attributes.
 */
function getIconAttributes( iconName, existing = {} ) {
	return {
		icon: iconName,
		src: PLACEHOLDER_SRC,
		style: existing.style || DEFAULT_ICON_STYLE,
		// An empty alt marks the icon as decorative.
		label: existing.label || '',
	};
}

/**
 * Rich Text format toolbar and picker.
 *
 * @param {Object}   props                        Component props.
 * @param {Object}   props.value                  Rich Text value.
 * @param {Function} props.onChange               Change handler.
 * @param {Function} props.onFocus                Focus the editable field.
 * @param {boolean}  props.isObjectActive         Whether the icon object is selected.
 * @param {Object}   props.activeObjectAttributes Active object attributes.
 * @param {Object}   props.contentRef             Editable element ref.
 */
export default function Edit( {
	value,
	onChange,
	onFocus,
	isObjectActive,
	activeObjectAttributes,
	contentRef,
} ) {
	const [ isPickerOpen, setPickerOpen ] = useState( false );

	const applyIcon = ( iconName ) => {
		const attributes = getIconAttributes(
			iconName,
			isObjectActive ? activeObjectAttributes : {}
		);

		if ( isObjectActive ) {
			const newReplacements = value.replacements.slice();
			newReplacements[ value.start ] = {
				type: FORMAT_NAME,
				attributes,
			};
			onChange( {
				...value,
				replacements: newReplacements,
			} );
		} else {
			onChange(
				insertObject( value, {
					type: FORMAT_NAME,
					attributes,
				} )
			);
		}

		onFocus();
		setPickerOpen( false );
	};

	const removeIcon = () => {
		onChange( remove( value, value.start, value.start + 1 ) );
		onFocus();
	};

	return (
		<>
			<RichTextToolbarButton
				icon={ starFilled }
				title={
					isObjectActive
						? __( 'Replace icon', 'mosne-button-icons' )
						: __( 'Inline icon', 'mosne-button-icons' )
				}
				onClick={ () => setPickerOpen( true ) }
				isActive={ isObjectActive }
			/>
			{ isPickerOpen && (
				<IconPicker
					onClose={ () => setPickerOpen( false ) }
					value={ activeObjectAttributes?.icon }
					onChange={ applyIcon }
				/>
			) }
			{ isObjectActive && (
				<InlineUI
					value={ value }
					onChange={ onChange }
					activeObjectAttributes={ activeObjectAttributes }
					contentRef={ contentRef }
					onRemove={ removeIcon }
					onReplace={ () => setPickerOpen( true ) }
				/>
			) }
		</>
	);
}
