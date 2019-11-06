const path = require("path"); // Resolves resolves folder directory's
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // Extract CSS from source to a separate file
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // Clean a give output directory
const BrowserSyncPlugin = require('browser-sync-webpack-plugin'); // Hot Reloading web server
const CopyPlugin = require('copy-webpack-plugin'); // Hot Reloading web server

/**
 * Javascript management rule.
 * Take all the JS and apply babel to it
 */
const jsRule = {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: "babel-loader",
    query: {
        "presets": [
            [
                "@babel/preset-env",
                {
                    "targets": "> .05% in FR, not ie <= 9"
                }
            ]
        ]
    }
};

/**
 * CSS management rule
 * Take all the CSS from the source
 * Apply PostCSS
 * Then compile it with Sass
 */
const cssRule = {
    test: /\.(sa|sc|c)ss$/,
    use: [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: process.env.NODE_ENV === 'development',
            },
        },
        'css-loader',
        'postcss-loader',
        'sass-loader',
    ],
};

/**
 * Fonts management
 * If any fonts is referenced and the file exists,
 * copy the file to the fonts/ directory relative to the output
 */
const fontsRule = {
    test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
    use: [
        {
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
                outputPath: '../fonts/'
            }
        }
    ]
};

/**
 * Image management
 * If any image is referenced and the file exists,
 * copy the file to the img/ directory relative to the output
 */
const imagesRule = {
    test: /\.(png|svg|jpg|gif)$/,
    use: [
        {
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
                outputPath: '../img/'
            }
        },
        {
            loader: 'image-webpack-loader',
            options: {
                mozjpeg: {
                    progressive: true,
                    quality: 65
                },
                optipng: {
                    enabled: false,
                },
                pngquant: {
                    quality: [0.65, 0.90],
                    speed: 4
                },
                gifsicle: {
                    interlaced: false,
                },
                webp: {
                    quality: 75
                }
            }
        },
    ]
};

/**
 * Final webpack config
 */
let config = {
    /* Entry Points */
    entry: {
        app: [
            __dirname + '/js/main.js',
            __dirname + '/scss/main.scss'
        ]
    },

    /* Rules as module */
    module: {
        rules: [ jsRule, cssRule, fontsRule, imagesRule ]
    },

    /* Plugins instances */
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '../css/[name].css',
            chunkFilename: '[id].css',
        }),
        new BrowserSyncPlugin( {
                host: 'localhost',
                port: 3000,
                proxy: 'http://localhost/webpack/'
            },
            {
                reload: true
            }
        ),
        new CopyPlugin([
            { from: 'img/', to: __dirname + '/../dist/img/' },
        ]),
    ],

    /* Output definition */
    output: {
        path: path.join(__dirname, '/../dist/js/'),
        filename: '[na me].js'
    }
};

module.exports = config;

/* If mode is production, then clean the output directory */
if (process.env.NODE_ENV === 'production') {
    module.exports.plugins.push(
        new CleanWebpackPlugin(__dirname + '/../dist', { allowExternal: true })
    )
};