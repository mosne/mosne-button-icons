/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { DimensionControl } from '@wordpress/block-editor';
import {
	Button,
	Flex,
	FlexItem,
	Popover,
	TextControl,
} from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useAnchor } from '@wordpress/rich-text';
import { useState } from '@wordpress/element';
import { getCSSValueFromRawStyle } from '@wordpress/style-engine';

/**
 * Internal dependencies
 */
import { FORMAT_NAME } from './constants';

const formatSettings = { name: FORMAT_NAME };

/**
 * Parse a DimensionControl value from an inline style string.
 *
 * @param {string} style Style attribute.
 * @return {string} Size value for DimensionControl.
 */
function parseSizeFromStyle( style ) {
	const match = style?.match( /width:\s*([^;]+)/i );
	if ( ! match ) {
		return '1em';
	}

	const cssValue = match[ 1 ].trim();
	const presetMatch = cssValue.match(
		/^var\(\s*--wp--preset--dimension--([^)]+)\s*\)$/i
	);

	if ( presetMatch ) {
		return `var:preset|dimension|${ presetMatch[ 1 ] }`;
	}

	if ( cssValue === '0' || /^0(px|em|rem)?$/i.test( cssValue ) ) {
		return '0';
	}

	return cssValue;
}

/**
 * Build width/height inline styles from a DimensionControl value.
 *
 * @param {string} size DimensionControl value.
 * @return {string} Inline style string.
 */
function getStyleFromSize( size ) {
	if ( size === undefined || size === null || size === '' ) {
		return '';
	}

	const cssSize = getCSSValueFromRawStyle( String( size ) );
	if ( cssSize === undefined || cssSize === null || cssSize === '' ) {
		return '';
	}

	return `width: ${ cssSize }; height: ${ cssSize };`;
}

/**
 * Popover to edit the icon, size and alternative text of an inline icon.
 *
 * @param {Object}   props
 * @param {Object}   props.value                  Rich Text value.
 * @param {Function} props.onChange               Rich Text change handler.
 * @param {Object}   props.activeObjectAttributes Active object attributes.
 * @param {Object}   props.contentRef             Editable element ref.
 * @param {Function} props.onRemove               Remove the inline icon.
 * @param {Function} props.onReplace              Reopen the icon picker.
 */
export default function InlineUI( {
	value,
	onChange,
	activeObjectAttributes,
	contentRef,
	onRemove,
	onReplace,
} ) {
	const { icon, style, label = '' } = activeObjectAttributes;
	const parsedSize = parseSizeFromStyle( style );
	const [ editedSize, setEditedSize ] = useState( parsedSize );
	const [ editedLabel, setEditedLabel ] = useState( label );
	const hasChanged = editedSize !== parsedSize || editedLabel !== label;

	const popoverAnchor = useAnchor( {
		editableContentElement: contentRef.current,
		settings: formatSettings,
	} );

	// The popover renders outside the editor canvas, so the preview cannot rely
	// on the canvas mask styles and needs the SVG markup itself.
	const selectedIcon = useSelect(
		( select ) =>
			icon
				? select( coreStore ).getEntityRecord( 'root', 'icon', icon )
				: null,
		[ icon ]
	);

	return (
		<Popover
			focusOnMount={ false }
			anchor={ popoverAnchor }
			className="mosne-inline-icon__popover"
		>
			<form
				className="mosne-inline-icon__popover-form"
				onSubmit={ ( event ) => {
					event.preventDefault();
					const attributes = {
						...activeObjectAttributes,
						style: getStyleFromSize( editedSize ),
						// An empty alt marks the icon as decorative.
						label: editedLabel,
					};

					const newReplacements = value.replacements.slice();
					newReplacements[ value.start ] = {
						type: FORMAT_NAME,
						attributes,
					};
					onChange( {
						...value,
						replacements: newReplacements,
					} );
				} }
			>
				<Flex direction="column" gap={ 4 }>
					<Flex gap={ 3 } align="center">
						<FlexItem>
							<span
								className="mosne-inline-icon__popover-preview"
								aria-hidden="true"
								dangerouslySetInnerHTML={ {
									__html: selectedIcon?.content ?? '',
								} }
							/>
						</FlexItem>
						<FlexItem isBlock>
							<Button
								variant="secondary"
								onClick={ onReplace }
								__next40pxDefaultSize
							>
								{ __( 'Replace icon', 'mosne-button-icons' ) }
							</Button>
						</FlexItem>
					</Flex>
					<DimensionControl
						label={ __( 'Size', 'mosne-button-icons' ) }
						value={ editedSize }
						onChange={ setEditedSize }
					/>
					<TextControl
						label={ __( 'Alternative text', 'mosne-button-icons' ) }
						value={ editedLabel }
						onChange={ setEditedLabel }
						help={ __(
							'Leave empty if the icon is decorative.',
							'mosne-button-icons'
						) }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<Flex justify="space-between">
						<Button
							variant="tertiary"
							isDestructive
							onClick={ onRemove }
						>
							{ __( 'Remove', 'mosne-button-icons' ) }
						</Button>
						<Button
							disabled={ ! hasChanged }
							accessibleWhenDisabled
							variant="primary"
							type="submit"
							size="compact"
						>
							{ __( 'Apply', 'mosne-button-icons' ) }
						</Button>
					</Flex>
				</Flex>
			</form>
		</Popover>
	);
}
