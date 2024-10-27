import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import './editor.scss';
export default function Edit() {
	return (
		<div { ...useBlockProps() }>
			<span className={ 'wp-block-mosne-button-icon__inline' }>
				{ '+' }
			</span>
		</div>
	);
}
