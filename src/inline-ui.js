/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Button,
	Flex,
	FlexItem,
	Popover,
	SelectControl,
	TextControl,
	TextareaControl,
} from '@wordpress/components';
import { useAnchor } from '@wordpress/rich-text';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { FORMAT_NAME } from './constants';

const formatSettings = { name: FORMAT_NAME };

/**
 * Parse width and unit from an inline style string.
 *
 * @param {string} style Style attribute.
 * @return {{ width: string, unit: string }} Parsed size.
 */
function parseStyle( style ) {
	const match = style?.match( /width:\s*([\d.]+)(px|em|rem)/i );
	if ( ! match ) {
		return { width: '1', unit: 'em' };
	}
	return { width: match[ 1 ], unit: match[ 2 ].toLowerCase() };
}

/**
 * Popover to edit size and alternative text of an inline icon.
 *
 * @param {Object}   props
 * @param {Object}   props.value                  Rich Text value.
 * @param {Function} props.onChange               Rich Text change handler.
 * @param {Object}   props.activeObjectAttributes Active object attributes.
 * @param {Object}   props.contentRef             Editable element ref.
 * @param {Function} props.onRemove               Remove the inline icon.
 */
export default function InlineUI( {
	value,
	onChange,
	activeObjectAttributes,
	contentRef,
	onRemove,
} ) {
	const { style, label = '' } = activeObjectAttributes;
	const parsed = parseStyle( style );
	const [ editedWidth, setEditedWidth ] = useState( parsed.width );
	const [ editedUnit, setEditedUnit ] = useState( parsed.unit );
	const [ editedLabel, setEditedLabel ] = useState( label );
	const hasChanged =
		editedWidth !== parsed.width ||
		editedUnit !== parsed.unit ||
		editedLabel !== label;

	const popoverAnchor = useAnchor( {
		editableContentElement: contentRef.current,
		settings: formatSettings,
	} );

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
					const widthValue = editedWidth
						? `width: ${ editedWidth }${ editedUnit }; height: ${ editedWidth }${ editedUnit };`
						: '';
					const attributes = {
						...activeObjectAttributes,
						style: widthValue,
					};

					// A decorative icon is hidden from assistive technology.
					delete attributes.label;
					delete attributes.ariaHidden;
					if ( editedLabel ) {
						attributes.label = editedLabel;
					} else {
						attributes.ariaHidden = 'true';
					}

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
					<Flex gap={ 3 } align="flex-end">
						<FlexItem isBlock>
							<TextControl
								label={ __( 'Size', 'mosne-button-icons' ) }
								type="number"
								value={ editedWidth }
								min={ 0.25 }
								step={ editedUnit === 'px' ? 1 : 0.25 }
								onChange={ setEditedWidth }
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>
						</FlexItem>
						<FlexItem>
							<SelectControl
								label={ __( 'Unit', 'mosne-button-icons' ) }
								value={ editedUnit }
								options={ [
									{ label: 'em', value: 'em' },
									{ label: 'px', value: 'px' },
									{ label: 'rem', value: 'rem' },
								] }
								onChange={ setEditedUnit }
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>
						</FlexItem>
					</Flex>
					<TextareaControl
						label={ __( 'Alternative text', 'mosne-button-icons' ) }
						value={ editedLabel }
						onChange={ setEditedLabel }
						help={ __(
							'Leave empty if the icon is decorative.',
							'mosne-button-icons'
						) }
						__nextHasNoMarginBottom
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
