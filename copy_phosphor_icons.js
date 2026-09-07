/* eslint-disable no-console */
const fs = require( 'fs' );
const path = require( 'path' );

const SOURCE_DIR = path.join(
	__dirname,
	'node_modules',
	'@phosphor-icons',
	'core',
	'assets',
	'regular'
);
const DEST_DIR = path.join( __dirname, 'phosphor-icons' );

/**
 * Copies regular-weight SVGs from @phosphor-icons/core into phosphor-icons/,
 * stripping the "-regular" filename suffix so icon slugs stay stable.
 *
 * @return {void}
 */
function copyPhosphorIcons() {
	if ( ! fs.existsSync( SOURCE_DIR ) ) {
		console.error(
			'Error: @phosphor-icons/core is not installed. Run npm install first.'
		);
		process.exit( 1 );
	}

	fs.mkdirSync( DEST_DIR, { recursive: true } );

	for ( const file of fs.readdirSync( DEST_DIR ) ) {
		if ( file.endsWith( '.svg' ) ) {
			fs.unlinkSync( path.join( DEST_DIR, file ) );
		}
	}

	const sourceFiles = fs
		.readdirSync( SOURCE_DIR )
		.filter( ( file ) => file.endsWith( '.svg' ) );

	if ( 0 === sourceFiles.length ) {
		console.error(
			`Error: No SVG files found in ${ SOURCE_DIR }.`
		);
		process.exit( 1 );
	}

	let copied = 0;

	for ( const file of sourceFiles ) {
		const destName = file.replace( /-regular\.svg$/, '.svg' );
		fs.copyFileSync(
			path.join( SOURCE_DIR, file ),
			path.join( DEST_DIR, destName )
		);
		copied += 1;
	}

	console.log(
		`✓ Copied ${ copied } Phosphor regular icons to phosphor-icons/`
	);
}

copyPhosphorIcons();
