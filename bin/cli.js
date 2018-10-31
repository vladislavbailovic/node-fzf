#!/usr/bin/env node

const keypress = require( 'keypress' )

const fs = require( 'fs' )
const path = require( 'path' )
const glob = require( 'redstar' )

const nfzf = require( path.join( __dirname, '../src/index.js' ) )

const argv = require( 'minimist' )( process.argv.slice( 2 ) )

return run()

function run ()
{
  if ( process.stdin.isTTY && !argv._.length ) {
    return glob( '**', function ( err, files, dirs ) {
      if ( err ) throw err

      nfzf( files, function ( result ) {
        if ( result.selected ) {
          console.log( files[ result.ind ] );
        } else if ( argv['print-query'] ) {
          console.log();
          console.log( result.query );
        }
        process.exit()
      } )
    } )
  } else {
    const api = nfzf( [], function ( result ) {
      if ( result.selected ) {
        console.log( result.selected.original )
      } else if ( argv['print-query'] ) {
        console.log();
        console.log( result.query );
      }
      process.exit()
    } )

    let buffer = ''
    process.stdin.setEncoding( 'utf8' )

    process.stdin.on( 'data', function ( chunk ) {
      buffer += chunk

      const list = (
        buffer.split( '\n' )
        .filter( function ( t ) { return t.trim().length > 0 } )
      )

      api.update( list )
    } )

    process.stdin.on( 'end', function () {
      console.log( 'end' )

      const list = (
        buffer.split( '\n' )
        .filter( function ( t ) { return t.trim().length > 0 } )
      )

      api.update( list )
    } )
  }
}
