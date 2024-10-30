
import classnames from 'classnames';
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { applyFilters } from '@wordpress/hooks';
import {
	Button,
	PanelRow,
	PanelBody,
	__experimentalGrid as Grid, // eslint-disable-line
} from '@wordpress/components';
import './editor.scss';
export default function Edit({ attributes, setAttributes, className }) {

	const { icon: currentIcon } = attributes;
	// Get the icons from the filter and set a default
	// icon can be filtered by block name
	const ICONS = applyFilters(
		'mosne-button-icons.icons',
		window.mosneButtonIcons.data ?? [],
		'mosne/button-icons'
	);

	const classes = classnames( className, {
		[ `has-icon has-icon__${ attributes?.icon }` ]: attributes?.icon,
	} );


	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Button Icons', 'mosne-button-icons')}
				>
					<PanelRow>
						<div className="mosne-button-icons__picker">
							<Grid
								className="block-editor-block-styles__variants"
								columns="4"
								gap="4"
							>
								{ICONS.map((icon, index) => (
									<Button
										key={index}
										label={icon?.label}
										title={icon?.label}
										style={{
											'--button-icon-url': `url(${icon.url})`,
										}}
										isPressed={
											currentIcon === icon.value
										}
										className="wp-block-mosne-button-icon__inline"
										onClick={() =>
											setAttributes({
												// Allow user to disable icons.
												icon:
													currentIcon ===
													icon.value
														? null
														: icon.value,
											})
										}
									>
										{icon.icon ?? icon.value}
									</Button>
								))}
							</Grid>
						</div>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<div {...useBlockProps({className: classes})}>
			<span
				aria-hidden={'true'}
				className={'wp-block-mosne-button-icon__inline'}
			>{'+'}
			</span>
			</div>
		</>

	);
}
