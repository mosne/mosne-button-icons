/**
 * WordPress dependencies
 */
import { Path, SVG, TextControl, Popover, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';
import { useState } from '@wordpress/element';
import { 	registerFormatType, insertObject, useAnchorRef } from '@wordpress/rich-text';
import {
	RichTextToolbarButton,
	__experimentalVStack as VStack, // eslint-disable-line
	__experimentalHStack as HStack, // eslint-disable-line
	__experimentalNumberControl as NumberControl, // eslint-disable-line
	__experimentalGrid as Grid, // eslint-disable-line
} from '@wordpress/block-editor';
import { keyboardReturn } from '@wordpress/icons';



const name = 'mosne/inline-icon';
const title = __( 'Inline icon' );

export const icon = {
	name,
	title,
	keywords: [ __( 'icon' ) ],
	object: true,
	tagName: 'span',
	className: 'wp-block-mosne-button-icon__inline',
	attributes: {
		style: 'width:24px;height:24px;',
		'data-icon': 'default',
		'aria-hidden': true,
	},
	edit: Edit,
};

function InlineUI( { value, onChange, activeObjectAttributes, contentRef } ) {
	const { style } = activeObjectAttributes;
	const [ size, setSize ] = useState( style.replace( /\D/g, '' ) );
	const [ currentIcon, setCurrentIcon ] = useState( '' );
	const anchorRef = useAnchorRef( {
		ref: contentRef,
		value,
		settings: icon,
	} );

	return (
		<Popover
			position="bottom center"
			focusOnMount={ false }
			anchorRef={ anchorRef }
		>
			<form
				className="block-editor-format-toolbar__image-container-content"
				onSubmit={ ( event ) => {
					const newReplacements = value.replacements.slice();

					newReplacements[ value.start ] = {
						type: name,
						attributes: {
							...activeObjectAttributes,
							style: `width: ${ size }px; height: ${ size }px;`,
							"aria-hidden": "true",
							"data-icon": currentIcon,
						},
					};

					onChange( {
						...value,
						replacements: newReplacements,
					} );

					event.preventDefault();
				} }
			>
				<TextControl
					className="block-editor-format-toolbar__image-container-value"
					type="number"
					label={ __( 'Size' ) }
					value={ size }
					min={ 1 }
					onChange={ ( newSize ) => setSize( newSize ) }
				/>
				<Button
					icon={ keyboardReturn }
					label={ __( 'Apply' ) }
					type="submit"
				/>
			</form>
		</Popover>
	);
}

function Edit( {
	value,
	onChange,
	onFocus,
	isObjectActive,
	activeObjectAttributes,
	contentRef,
} ) {
	const [ isModalOpen, setIsModalOpen ] = useState( false );
	const style = 'width:24px;height:24px;';
	const [ size, setSize ] = useState( style.replace( /\D/g, '' ) );
	const [ currentIcon, setCurrentIcon ] = useState( '' );


	function openModal() {
		setIsModalOpen( true );
	}

	function closeModal() {
		setIsModalOpen( false );
	}

	const ICONS = applyFilters(
		'mosne-button-icons.icons',
		window.mosneButtonIcons.data ?? [],
		name
	);

	return (
		<>
			<RichTextToolbarButton
				icon={
					<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<Path d="M4 18.5h16V17H4v1.5zM16 13v1.5h4V13h-4zM5.1 15h7.8c.6 0 1.1-.5 1.1-1.1V6.1c0-.6-.5-1.1-1.1-1.1H5.1C4.5 5 4 5.5 4 6.1v7.8c0 .6.5 1.1 1.1 1.1zm.4-8.5h7V10l-1-1c-.3-.3-.8-.3-1 0l-1.6 1.5-1.2-.7c-.3-.2-.6-.2-.9 0l-1.3 1V6.5zm0 6.1l1.8-1.3 1.3.8c.3.2.7.2.9-.1l1.5-1.4 1.5 1.4v1.5h-7v-.9z" />
					</SVG>
				}
				title={ title }
				onClick={ openModal }
				isActive={ isObjectActive }
			/>
			{ isModalOpen && (
				<div className="mosne-button-icons__picker">
				<Grid
					className="block-editor-block-styles__variants"
					columns="6"
					gap="4"
				>
					{ ICONS.map( ( item, index ) => (
						<Button
							key={ index }
							label={ item?.label }
							title={ item?.label }
							style={ {
								'--button-icon-url': `url(${ item.url })`,
							} }
							isPressed={ currentIcon === item.value }
							className="wp-block-mosne-button-icon__inline"
							onClick={ () => {
								setmosneIconText( '' );
								closeModal();
								setCurrentIcon(
									currentIcon === item.value
										? null
										: item.value
								);
								closeModal();
						onChange(
							insertObject( value, {
								type: name,
								attributes: {
									className: `wp-block-mosne-button-icon__inline`,
									style: `width:24px;height:24px;`,
									url,
									alt,
								},
							} )
						);
						onFocus();
							} }
						>
							{ item.icon ?? item.value }
						</Button>
					) ) }
				</Grid>
			</div>
			) }
			{ isObjectActive && (
				<InlineUI
					value={ value }
					onChange={ onChange }
					activeObjectAttributes={ activeObjectAttributes }
					contentRef={ contentRef }
				/>
			) }
		</>
	);
}

registerFormatType( name, icon );
