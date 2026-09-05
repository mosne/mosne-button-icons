/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Modal, SearchControl, Spinner, TabPanel } from '@wordpress/components';
import { useDebounce } from '@wordpress/compose';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useMemo, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import IconGrid from './icon-grid';

/**
 * Normalize a string for icon search.
 *
 * @param {string} input Raw search input.
 * @return {string} Normalized value.
 */
function normalizeSearchInput( input = '' ) {
	return input.trim().toLowerCase();
}

/**
 * Modal picker for the WordPress Icons API.
 *
 * @param {Object}   props
 * @param {Function} props.onClose  Close the modal.
 * @param {string}   props.value    Currently selected icon name.
 * @param {Function} props.onChange Called with the chosen icon name.
 */
export default function IconPicker( { onClose, value, onChange } ) {
	const [ searchInput, setSearchInput ] = useState( '' );
	const [ currentCollection, setCurrentCollection ] = useState( null );
	const debouncedSetSearchInput = useDebounce( setSearchInput, 300 );

	const collections = useSelect(
		( select ) =>
			select( coreStore ).getEntityRecords( 'root', 'iconCollection' ),
		[]
	);

	const selectedCollection = value?.split( '/' )[ 0 ];
	const collectionSlug =
		currentCollection ??
		( collections?.some( ( { slug } ) => slug === selectedCollection )
			? selectedCollection
			: collections?.[ 0 ]?.slug ) ??
		null;

	const { icons, hasResolvedIcons } = useSelect(
		( select ) => {
			if ( collectionSlug === null ) {
				return { icons: null, hasResolvedIcons: false };
			}

			const query =
				collectionSlug === '' ? {} : { collection: collectionSlug };
			const { getEntityRecords, hasFinishedResolution } =
				select( coreStore );

			return {
				icons: getEntityRecords( 'root', 'icon', query ),
				hasResolvedIcons: hasFinishedResolution( 'getEntityRecords', [
					'root',
					'icon',
					query,
				] ),
			};
		},
		[ collectionSlug ]
	);

	const filteredIcons = useMemo( () => {
		if ( ! icons ) {
			return [];
		}

		if ( ! searchInput ) {
			return icons;
		}

		const input = normalizeSearchInput( searchInput );
		return icons.filter( ( icon ) => {
			return (
				normalizeSearchInput( icon.name ).includes( input ) ||
				normalizeSearchInput( icon.label ).includes( input )
			);
		} );
	}, [ searchInput, icons ] );

	const tabs = [
		{
			name: '',
			title: __( 'All', 'mosne-button-icons' ),
		},
		...( collections ?? [] ).map( ( collection ) => ( {
			name: collection.slug,
			title: collection.label,
		} ) ),
	];

	return (
		<Modal
			className="mosne-inline-icon__inserter-modal"
			title={ __( 'Icon library', 'mosne-button-icons' ) }
			onRequestClose={ onClose }
			isFullScreen
		>
			<div className="mosne-inline-icon__inserter">
				<SearchControl
					value={ searchInput }
					onChange={ debouncedSetSearchInput }
					__nextHasNoMarginBottom
				/>
				<TabPanel
					className="mosne-inline-icon__inserter-tabs"
					activeClass="is-active"
					initialTabName={ collectionSlug || '' }
					onSelect={ ( tabName ) => setCurrentCollection( tabName ) }
					tabs={ tabs }
				>
					{ () =>
						! hasResolvedIcons ? (
							<div
								className="wp-block-icon__inserter-loading"
								role="status"
								aria-label={ __(
									'Loading…',
									'mosne-button-icons'
								) }
							>
								<Spinner />
							</div>
						) : (
							<IconGrid
								icons={ filteredIcons }
								onChange={ onChange }
								value={ value }
							/>
						)
					}
				</TabPanel>
			</div>
		</Modal>
	);
}
