/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useAsyncList } from '@wordpress/compose';
import { getScrollContainer, safeHTML } from '@wordpress/dom';
import { useLayoutEffect, useRef } from '@wordpress/element';

const BATCH_SIZE = 20;

/**
 * Scrollable icon library grid.
 *
 * Mirrors the `core/icon` inserter grid, including its class names, so the
 * `wp-block-icon-editor` stylesheet shipped by WordPress styles it.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/block-library/src/icon/components/custom-inserter/icon-grid.jsx
 *
 * @param {Object}   props
 * @param {Array}    props.icons    Icon entity records.
 * @param {Function} props.onChange Callback receiving the selected icon name.
 * @param {string}   props.value    Currently selected icon name.
 */
export default function IconGrid( { icons, onChange, value } ) {
	const shownIcons = useAsyncList( icons, {
		step: BATCH_SIZE,
	} );

	// Scroll the selected icon into view, but wait until enough icons render
	// below it so it can be centered rather than stuck at the bottom. Skip it
	// if the user has already scrolled the list.
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
		if ( getScrollContainer( node )?.scrollTop ) {
			return;
		}
		node.scrollIntoView( { block: 'center' } );
	}, [ isReadyToScroll ] );

	return (
		<div className="wp-block-icon__inserter-grid">
			{ ! icons?.length ? (
				<div className="wp-block-icon__inserter-grid-no-results">
					<p>{ __( 'No results found.', 'mosne-button-icons' ) }</p>
				</div>
			) : (
				<div
					className="wp-block-icon__inserter-grid-icons-list"
					aria-label={ __( 'Icon library', 'mosne-button-icons' ) }
				>
					{ shownIcons.map( ( icon ) => {
						return (
							<Button
								key={ icon.name }
								ref={
									icon.name === value
										? selectedIconRef
										: undefined
								}
								className="wp-block-icon__inserter-grid-icons-list-item"
								onClick={ () => onChange( icon.name ) }
								variant={
									icon.name === value ? 'primary' : undefined
								}
								__next40pxDefaultSize
							>
								<span
									className="wp-block-icon__inserter-grid-icons-list-item-icon"
									dangerouslySetInnerHTML={ {
										__html: safeHTML( icon.content ),
									} }
								/>
								<span className="wp-block-icon__inserter-grid-icons-list-item-title">
									{ icon.label }
								</span>
							</Button>
						);
					} ) }
				</div>
			) }
		</div>
	);
}
