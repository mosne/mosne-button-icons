/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useAsyncList } from '@wordpress/compose';
import { useLayoutEffect, useRef } from '@wordpress/element';

const BATCH_SIZE = 20;

/**
 * Scrollable icon library grid.
 *
 * @param {Object}   props
 * @param {Array}    props.icons    Icon entity records.
 * @param {Function} props.onChange Callback receiving the selected icon name.
 * @param {string}   props.value    Currently selected icon name.
 */
export default function IconGrid( { icons, onChange, value } ) {
	const shownIcons = useAsyncList( icons, { step: BATCH_SIZE } );
	const selectedIconRef = useRef();
	const selectedIndex =
		icons?.findIndex( ( icon ) => icon.name === value ) ?? -1;
	const isReadyToScroll =
		selectedIndex >= 0 &&
		( shownIcons.length >= selectedIndex + BATCH_SIZE ||
			shownIcons.length === icons.length );

	useLayoutEffect( () => {
		const node = selectedIconRef.current;
		if ( ! isReadyToScroll || ! node ) {
			return;
		}
		node.scrollIntoView( { block: 'center' } );
	}, [ isReadyToScroll ] );

	if ( ! icons?.length ) {
		return (
			<div className="mosne-inline-icon__inserter-no-results">
				<p>{ __( 'No results found.', 'mosne-button-icons' ) }</p>
			</div>
		);
	}

	return (
		<div
			className="mosne-inline-icon__inserter-grid"
			aria-label={ __( 'Icon library', 'mosne-button-icons' ) }
		>
			{ shownIcons.map( ( icon ) => (
				<Button
					key={ icon.name }
					ref={ icon.name === value ? selectedIconRef : undefined }
					className="mosne-inline-icon__inserter-item"
					onClick={ () => onChange( icon.name ) }
					variant={ icon.name === value ? 'primary' : undefined }
					label={ icon.label }
					__next40pxDefaultSize
				>
					<span
						className="mosne-inline-icon__inserter-item-icon"
						dangerouslySetInnerHTML={ { __html: icon.content } }
					/>
					<span className="mosne-inline-icon__inserter-item-title">
						{ icon.label }
					</span>
				</Button>
			) ) }
		</div>
	);
}
