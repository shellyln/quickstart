var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');


var scssRoot = 'src/assets/scss';

var scssDevToolFix = (info) => {
    let search = `/${scssRoot}/`;
    let fi = info.resourcePath.indexOf(search);
    let li = info.resourcePath.lastIndexOf(search);
    let s  = (fi < 0 || fi === li) ? info.resourcePath : info.resourcePath.substring(0, fi) + info.resourcePath.substring(li);
    return `${s}`;
};


module.exports = function (env) { return [

    // [Browser-single-js-file]: Packing a library Javascript file.
    {
        entry: {
            // TODO: YOU SHOULD REPLACE THE LIBRARY OUTPUT NAME!
            main: [
                path.resolve(__dirname, 'node_modules/zone.js/dist/zone.js'),
                path.resolve(__dirname, 'src/main.ts')
            ]
        },
        // TODO: YOU SHOULD MODIFY PATTERN OF EXTERNAL MODULES!
        // If you call "require()" with passing modules paths matched to following pattern,
        // "require()" will be resolved runtime.
        //externals: /^(fs)$/,
        output: {
            // TODO: YOU SHOULD REPLACE THE LIBRARY NAME!
            library: 'Quickstart',

            libraryTarget: 'amd',
            filename: process.env.NODE_ENV === 'production' ? '[name].min.js' : '[name].js',
            path: path.resolve(__dirname, 'src'),
            devtoolModuleFilenameTemplate: process.env.NODE_ENV === 'production' ? '[resource-path]' : void 0
        },
        module: {
            rules: [{
                test: /\.tsx?$/,
                use: ['babel-loader', 'ts-loader?' + JSON.stringify({
                    configFileName: 'tsconfig-webpack-dist.json'
                })],

                // TODO: YOU SHOULD REPLACE THE PACKAGE NAME!
                // exclude 'node_module' directory except myself (refered from other packages)
                exclude: /node_modules[\/\\](?!(webpack-typescript-lib-quickstart)|(zone.js)).*$/
            }, {
                test: /\.jsx?$/,
                use: ['babel-loader'],

                // TODO: YOU SHOULD REPLACE THE PACKAGE NAME!
                // exclude 'node_module' directory except myself (refered from other packages)
                exclude: /node_modules[\/\\](?!(webpack-typescript-lib-quickstart)|(zone.js)).*$/
            }, {
                enforce: 'pre',
                test: /\.[tj]sx?$/,
                use: ['source-map-loader']
            }, {
                test: /\.html?(\?.+)?$/,
                use: ['html-loader']
            }, {
                test: /\.(css|scss)$/,
                use: [
                    'to-string-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                require('postcss-custom-properties')(),
                                require('postcss-nested')(),
                                require('autoprefixer')({ browsers: ['last 2 versions'] })
                            ]
                        }
                    },
                    'sass-loader'
                ]
            }, {
                test: /\.(jpg|jpeg|png|ttf|otf|eot|svg|woff2?)(\?.+)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            }]
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js']
        },
        devServer: {
            contentBase: [
                path.resolve(__dirname, "src"),
                path.resolve(__dirname, "node_modules")
            ],
            publicPath: "/",
            compress: true,
            port: 8080
        },
        devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'source-map'
    }

]}
