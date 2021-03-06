#!/usr/bin/env node
/**
*
*	SCRIPTS: resources
*
*
*	DESCRIPTION:
*		- Retrieves metric resources.
*
*
*	NOTES:
*		[1] 
*
*
*	TODO:
*		[1] 
*
*
*	LICENSE:
*		MIT
*
*	Copyright (c) 2014. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. kgryte@gmail.com. 2014.
*
*/

(function() {
	'use strict';

	// MODULES //

	var fs = require( 'fs' ),
		path = require( 'path' ),
		request = require( 'request' );


	// RESOURCES //

	var resources = {
			'disk': 'https://raw.githubusercontent.com/doc-metrix/disk/master/doc/index.json'
		};


	// VARIABLES //

	var filepath = path.resolve( __dirname, '../docs' );


	// FUNCTIONS //

	/**
	* FUNCTION: getResources()
	*	Retrieves the latest resources.
	*
	* @private
	*/
	function getResources() {
		var keys = Object.keys( resources );
		if ( !fs.existsSync( filepath ) ) {
			fs.mkdirSync( filepath );
		}
		for ( var i = 0; i < keys.length; i++ ) {
			request({
				'method': 'GET',
				'uri': resources[ keys[i] ]
			}, onResponse( keys[i] ) );
		}
	} // end FUNCTION getResources()

	/**
	* FUNCTION: onResponse( name )
	*	Returns an HTTP response handler.
	* 
	* @private
	* @param {String} name - resource name
	* @returns {Function} response handler
	*/
	function onResponse( name ) {
		var filename = path.join( filepath, name+'.json' );
		/**
		* FUNCTION: onResponse( error, response, body )
		*	Handler for HTTP response.
		*
		* @private
		* @param {Object} error - error object
		* @param {Object} response - HTTP response object
		* @param {Object} body - response body
		*/
		return function onResponse( error, response, body ) {
			if ( error ) {
				throw new Error( error );
			}
			if ( !body ) {
				throw new Error( 'Error when retrieving metric resource: ' + name + '.' );
			}
			try {
				JSON.parse( body );
			} catch ( err ) {
				console.log( body );
				throw new Error( 'Unable to parse body content as JSON for metric resource: ' + name + '.' );
			}
			fs.writeFile( filename, body, 'utf8', function onError( error ) {
				if ( error ) {
					throw new Error( error );
				}
			});
		}; // end FUNCTION onResponse()
	} // end FUNCTION onResponse()


	// RUN //

	getResources();

})();