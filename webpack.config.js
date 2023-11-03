const path = require( 'path' )


module.exports = {
    entry: './src/MinaData.mjs',
    output: {
      filename: 'MinaData.mjs',
      path: path.resolve( __dirname, 'dist' ),
      library: {
        type: 'module',
      },
    },
    experiments: {
      outputModule: true,
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                },
                },
            },
        ],
    },
}