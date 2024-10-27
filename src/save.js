import { useBlockProps } from '@wordpress/block-editor';
export default function save() {
	return (
		<div { ...useBlockProps.save() }>
			<span
				ariaHidden={ true }
				className={ 'wp-block-mosne-button-icon__inline' }
			>
				{ '+' }
			</span>
		</div>
	);
}
