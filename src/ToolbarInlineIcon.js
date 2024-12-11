/**
 * WP Core Dependencies
 */
import { useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import {
	registerFormatType,
	removeFormat,
	applyFormat,
	useAnchor,
} from '@wordpress/rich-text';
import { BlockControls } from '@wordpress/block-editor';
import {
	Button,
	ToolbarGroup,
	ToolbarButton,
  __experimentalVStack as VStack, // eslint-disable-line
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

const mosneIconEdit = ({
	isActive,
	activeAttributes,
	value,
	onChange,
	contentRef,
}) => {
	const [mosneIconText, setmosneIconText] = useState('');
	const [iconWidth, setIconWidth] = useState('');
	const [iconHeight, setIconHeight] = useState('');
	const [currentIcon, setCurrentIcon] = useState('');
	const [showPopover, setShowPopover] = useState(false);
	const [typingInProgress, setTypingInProgress] = useState(false);
	const anchorRef = useAnchor({ editableContentElement: contentRef.current });

	const toolbarButtonOnClick = () => {
		if (!isActive) {
			setShowPopover(true);
		} else {
			setShowPopover(false);
			onChange(removeFormat(value, mosneIconFormatName));
		}
	};

	const saveMosneIconText = () => {
		if (currentIcon) {
			onChange(
				applyFormat(value, {
					type: mosneIconFormatName,
					attributes: {
            "data-icon": currentIcon,
            width: iconWidth || "1em",
            height: iconHeight || "1em",
            "aria-hidden": "true",
					},
          content: "="
				})
			);
		} else {
			onChange(removeFormat(value, mosneIconFormatName));
		}

		setShowPopover(false);
	};

	const removeMosneIcon = () => {
		onChange(removeFormat(value, mosneIconFormatName));
		setShowPopover(false);
	};

	if (isActive && !showPopover && !typingInProgress) {
		setTypingInProgress(false);
		setShowPopover(true);
	}

	if (!isActive && !typingInProgress && showPopover && mosneIconText) {
		setShowPopover(false);
	}

	if (mosneIconText !== activeAttributes.mosneIconText && !typingInProgress) {
		setmosneIconText(activeAttributes.mosneIconText);
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
					icon={shapes}
					title={__('Inline Icon', 'mosne-button-icons')}
					isActive={isActive}
					onClick={toolbarButtonOnClick}
				/>
				{showPopover && (
					<Popover
						anchor={anchorRef}
						className="mosne-icon-popover"
						onClose={() => setShowPopover(false)}
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
											isPressed={ () =>
												setCurrentIcon(icon.value)
											}
											className="wp-block-mosne-button-icon__inline"
											onClick={ () => {
                        setmosneIconText('');
												setCurrentIcon(currentIcon ===
                          icon.value
                            ? null
                            : icon.value)
											}}
										>
											{ icon.icon ?? icon.value }
										</Button>
									) ) }
								</Grid>
							</div>
            <div className="mosne-icon-popover__controls">
            <VStack spacing={ 4 }>
            <HStack spacing={ 4 }>
                <NumberControl
                label={ __( 'Width' ) }
                value={ iconWidth }
                min={ 1 }
                onChange={ ( newWidth ) => {
                  setIconWidth( newWidth );
                } }
              />
              <NumberControl
                label={ __( 'Height' ) }
                value={ iconHeight }
                min={ 1 }
                onChange={ ( newWidth ) => {
                  setIconHeight( newWidth );
                } }
              />
              </HStack>
              <HStack spacing={ 4 }>
							<Button
								onClick={removeMosneIcon}
								className="mosne-icon-popover__controls-remove components-button is-secondary is-destructive"
							>
								{__('Remove', 'mosne-button-icons')}
							</Button>
							<Button
								onClick={saveMosneIconText}
								className="mosne-icon-popover__controls-save components-button is-primary"
							>
								{__('Save', 'mosne-button-icons')}
							</Button>
              </HStack>
              </VStack>
						</div>
					</Popover>
				)}
			</ToolbarGroup>
		</BlockControls>
	);
};

registerFormatType(mosneIconFormatName, {
	title: __('Inline Icons', 'mosne-button-icons'),
	tagName: 'span',
	className: 'wp-block-mosne-button-icon__inline',
	ariaHidden: 'true',
	edit: mosneIconEdit,
});