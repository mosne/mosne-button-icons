/**
 * WP Core Dependencies
 */
import { useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import {
	registerFormatType,
	remove,
	insertObject,
  applyFormat,
  removeFormat,
	useAnchor,
} from '@wordpress/rich-text';
import { BlockControls } from '@wordpress/block-editor';
import {
	Button,
	ToolbarGroup,
	ToolbarButton,
	__experimentalHStack as HStack, // eslint-disable-line
	__experimentalNumberControl as NumberControl, // eslint-disable-line
	__experimentalGrid as Grid, // eslint-disable-line
	Popover,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Project Dependencies
 */
import { default as shapes } from './shapes.js';

const mosneIconFormatName = 'mosne/inline-icon';

const mosneIconEdit = ( {
	isActive,
	activeAttributes,
	value,
	onChange,
	contentRef,
} ) => {
	const [ iconSize, setIconSize ] = useState( 20 );
	const [ currentIcon, setCurrentIcon ] = useState( '' );
	const [ showPopover, setShowPopover ] = useState( false );
	const anchorRef = useAnchor( {
		editableContentElement: contentRef.current,
	} );

	const toolbarButtonOnClick = () => {
		if ( ! isActive ) {
			setShowPopover( true );
		} else {
			setShowPopover( false );
			onChange( removeFormat( value, mosneIconFormatName ) );
		}
	};

	const saveMosneIcon= () => {
		if ( currentIcon ) {
			onChange(
				applyFormat( value, {
					type: mosneIconFormatName,
					attributes: {
						'data-icon': currentIcon,
						style: `width:${ iconSize }px;height:${ iconSize }px;`,
						'aria-hidden': 'true',
					},
				} )
			);
		} else {
			onChange( removeFormat( value, mosneIconFormatName ) );
		}
		setShowPopover( false );
		};

	const removeMosneIcon = () => {
		onChange( removeFormat( value, mosneIconFormatName ) );
		setShowPopover( false );
	};

	if ( isActive && ! showPopover) {
		setShowPopover( true );
	}

	if ( ! isActive && showPopover ) {
		setShowPopover( false );
	}


	const ICONS = applyFilters(
		'mosne-button-icons.icons',
		window.mosneButtonIcons.data ?? [],
		mosneIconFormatName
	);

	return (
		<BlockControls>
			<ToolbarGroup>
				<ToolbarButton
					icon={ shapes }
					title={ __( 'Inline Icon', 'mosne-button-icons' ) }
					isActive={ isActive }
					onClick={ toolbarButtonOnClick }
				/>
				{ showPopover && (
					<Popover
						anchor={ anchorRef }
						className="mosne-icon-popover"
						onClose={ () => setShowPopover( false ) }
					>
						<div className="mosne-button-icons__picker">
							<Grid
								className="block-editor-block-styles__variants"
								columns="6"
								gap="4"
							>
								{ ICONS.map( ( icon, index ) => (
									<Button
										key={ index }
										label={ icon?.label }
										title={ icon?.label }
										style={ {
											'--button-icon-url': `url(${ icon.url })`,
										} }
										isPressed={ currentIcon === icon.value }
										className="wp-block-mosne-button-icon__inline"
										onClick={ () => {
											setCurrentIcon(
												currentIcon === icon.value
													? null
													: icon.value
											);
										} }
									>
										{ icon.icon ?? icon.value }
									</Button>
								) ) }
							</Grid>
						</div>
						<div className="mosne-icon-popover__controls">
							<HStack spacing={ 4 }>
								<NumberControl
									label={ __( 'Size' ) }
									value={ iconSize }
									min={ 1 }
									onChange={ ( newSize ) => {
										setIconSize( newSize );
									} }
								/>
								<Button
									onClick={ removeMosneIcon }
									className="mosne-icon-popover__controls-remove components-button is-secondary is-destructive"
								>
									{ __( 'remove', 'mosne-button-icons' ) }
								</Button>
								<Button
									onClick={ saveMosneIcon }
									className="mosne-icon-popover__controls-save components-button is-primary"
								>
									{ __( 'Save', 'mosne-button-icons' ) }
								</Button>
							</HStack>
						</div>
					</Popover>
				) }
			</ToolbarGroup>
		</BlockControls>
	);
};

registerFormatType( mosneIconFormatName, {
	title: __( 'Inline Icons', 'mosne-button-icons' ),
	tagName: 'span',
	className: 'wp-block-mosne-button-icon__inline',
	ariaHidden: 'true',
	edit: mosneIconEdit,
} );