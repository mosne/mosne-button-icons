/* eslint-disable no-console */
const fs = require( 'fs' );
const { execSync } = require( 'child_process' );

/**
 * Validates version format (semver).
 *
 * @param {string} version Version string to validate.
 * @return {boolean} True if valid, false otherwise.
 */
function isValidVersion( version ) {
	const semverPattern = /^\d+\.\d+\.\d+(-[a-zA-Z0-9-]+)?(\+[a-zA-Z0-9-]+)?$/;
	return semverPattern.test( version );
}

/**
 * Gets current version from package.json.
 *
 * @return {string} Current version.
 */
function getCurrentVersion() {
	const packageJson = JSON.parse( fs.readFileSync( 'package.json', 'utf8' ) );
	return packageJson.version;
}

/**
 * Updates version in .plugin-data file.
 *
 * @param {string} newVersion New version to set.
 * @return {void}
 */
function updatePluginData( newVersion ) {
	const filePath = '.plugin-data';
	const content = JSON.parse( fs.readFileSync( filePath, 'utf8' ) );
	content.version = newVersion;
	fs.writeFileSync(
		filePath,
		JSON.stringify( content, null, '\t' ) + '\n',
		'utf8'
	);
	console.log( `✓ Updated .plugin-data: ${ newVersion }` );
}

/**
 * Updates version in readme.txt file.
 *
 * @param {string} newVersion New version to set.
 * @return {void}
 */
function updateReadme( newVersion ) {
	const filePath = 'readme.txt';
	let content = fs.readFileSync( filePath, 'utf8' );
	content = content.replace(
		/^Stable tag:\s*\S+/m,
		`Stable tag:        ${ newVersion }`
	);
	fs.writeFileSync( filePath, content, 'utf8' );
	console.log( `✓ Updated readme.txt: ${ newVersion }` );
}

/**
 * Updates version in mosne-button-icons.php file.
 *
 * @param {string} newVersion New version to set.
 * @return {void}
 */
function updatePhpFile( newVersion ) {
	const filePath = 'mosne-button-icons.php';
	let content = fs.readFileSync( filePath, 'utf8' );

	// Update Version: line
	content = content.replace(
		/Version:\s*\S+/,
		`Version:           ${ newVersion }`
	);

	// Update constant
	content = content.replace(
		/define\(\s*'MOSNE_BUTTON_ICONS_VERSION',\s*'[^']+'\s*\);/,
		`define( 'MOSNE_BUTTON_ICONS_VERSION', '${ newVersion }' );`
	);

	fs.writeFileSync( filePath, content, 'utf8' );
	console.log( `✓ Updated mosne-button-icons.php: ${ newVersion }` );
}

/**
 * Updates version in package.json file.
 *
 * @param {string} newVersion New version to set.
 * @return {void}
 */
function updatePackageJson( newVersion ) {
	const filePath = 'package.json';
	const content = JSON.parse( fs.readFileSync( filePath, 'utf8' ) );
	content.version = newVersion;
	fs.writeFileSync(
		filePath,
		JSON.stringify( content, null, '\t' ) + '\n',
		'utf8'
	);
	console.log( `✓ Updated package.json: ${ newVersion }` );
}

/**
 * Increments version number.
 *
 * @param {string} currentVersion Current version string.
 * @param {string} type           Type of increment: 'major', 'minor', or 'patch'.
 * @return {string} New version string.
 */
function incrementVersion( currentVersion, type = 'patch' ) {
	const parts = currentVersion.split( '.' ).map( Number );
	const [ major, minor, patch ] = parts;

	switch ( type ) {
		case 'major':
			return `${ major + 1 }.0.0`;
		case 'minor':
			return `${ major }.${ minor + 1 }.0`;
		case 'patch':
		default:
			return `${ major }.${ minor }.${ patch + 1 }`;
	}
}

/**
 * Main function to bump version.
 *
 * @return {void}
 */
function bumpVersion() {
	const args = process.argv.slice( 2 );
	let newVersion;

	if ( args.length === 0 ) {
		// No arguments: increment patch version
		const currentVersion = getCurrentVersion();
		newVersion = incrementVersion( currentVersion, 'patch' );
		console.log(
			`No version specified. Incrementing patch version from ${ currentVersion } to ${ newVersion }`
		);
	} else if (
		args[ 0 ] === 'major' ||
		args[ 0 ] === 'minor' ||
		args[ 0 ] === 'patch'
	) {
		// Increment type specified
		const currentVersion = getCurrentVersion();
		newVersion = incrementVersion( currentVersion, args[ 0 ] );
		console.log(
			`Incrementing ${ args[ 0 ] } version from ${ currentVersion } to ${ newVersion }`
		);
	} else {
		// Specific version provided
		newVersion = args[ 0 ];
		if ( ! isValidVersion( newVersion ) ) {
			console.error( `Error: Invalid version format: ${ newVersion }` );
			console.error(
				'Version must follow semver format: X.Y.Z (e.g., 1.2.3)'
			);
			process.exit( 1 );
		}
		console.log( `Setting version to: ${ newVersion }` );
	}

	console.log( '\nUpdating version in all files...\n' );

	try {
		updatePluginData( newVersion );
		updateReadme( newVersion );
		updatePhpFile( newVersion );
		updatePackageJson( newVersion );

		console.log( `\n✓ Successfully bumped version to ${ newVersion }` );
		console.log( '\nVerifying version consistency...\n' );

		// Run check script to verify
		try {
			execSync( 'node check_versions.js', { stdio: 'inherit' } );
			console.log( '\n✓ All version numbers are consistent!' );
		} catch ( error ) {
			console.error(
				'\n✗ Version check failed. Please review the changes.'
			);
			process.exit( 1 );
		}
	} catch ( error ) {
		console.error( `Error: ${ error.message }` );
		process.exit( 1 );
	}
}

// Run the script
bumpVersion();
