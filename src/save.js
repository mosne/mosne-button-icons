
import classnames from 'classnames';
import { useBlockProps } from '@wordpress/block-editor';
export default function save({className, attributes}) {
	const classes = classnames( className, {
		[ `has-icon has-icon__${ attributes?.icon }` ]: attributes?.icon,
	} );
	return (
		<div {...useBlockProps.save({className:classes })}>
			<span
				ariaHidden={true}
				className={'wp-block-mosne-button-icon__inline'}
			>{'+'}
			</span>
		</div>
	);
}
