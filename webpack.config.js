/**
 * External dependencies
 */

const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
	...defaultConfig,

	entry: {
		'index' : path.resolve( process.cwd(), 'src/index.js' ),
		'button-icons' : path.resolve( process.cwd(), 'src/button-icons.js' ),
		'button-icons-style' : path.resolve( process.cwd(), 'src/button-icons-style.scss' ),
		'button-icons-editor' : path.resolve( process.cwd(), 'src/button-icons-editor.scss' ),
},

	plugins: [
		...defaultConfig.plugins.filter( ( { constructor } ) => constructor.name !== 'RtlCssPlugin' ),
	]
};
