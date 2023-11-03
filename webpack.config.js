const path = require( 'path' )
const webpack = require( 'webpack' )
const fs = require( 'fs' )

module.exports = {
    'entry': './src/MinaData.mjs',
    'mode': 'production', //'development',
    'output': {
        'filename': 'MinaData.js',
        'path': path.resolve( __dirname, 'dist' ),
        'library': {
            'type': 'module'
        },
    },
    'experiments': {
        'outputModule': true
    },
    'module': {
        'rules': [
            {
                'test': /\.m?js$/,
                'exclude': /(node_modules|bower_components)/,
                'use': {
                    'loader': 'babel-loader',
                    'options': {
                        'presets': [ '@babel/preset-env' ]
                    }
                }
            }
        ]
    },
    'plugins': [
        new webpack.BannerPlugin( {
            'banner': fs.readFileSync( './LICENSE', 'utf-8' )
        } )
    ]
}