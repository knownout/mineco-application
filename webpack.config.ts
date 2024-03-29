/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/mineco-application
 */

// Webpack modules import
import Webpack from "webpack";

// Webpack plugins require
import UglifyJsPlugin from "uglifyjs-webpack-plugin";
import OptimizeCssAssetsPlugin from "optimize-css-assets-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

import HtmlWebpackPlugin from "html-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";

// Common node module functions import
import path, { resolve } from "path";
import fs from "fs"
import webpack from "webpack"

/*
	Webpack preferences
*/

const distPath = "dist";
const entryPoints = { main: "./src/main.tsx" };
// const certificates = {
//     key: readFileSync(`E:\\Certificates\\localhost+3-key.pem`, "utf8"),
//     cert: readFileSync(`E:\\Certificates\\localhost+3.pem`, "utf8")
// };

// Webpack configuration
const config = {
    target: "web",
    mode: "production",

    resolve: { extensions: [ ".ts", ".js", ".tsx", ".jsx" ] },

    parallelism: 8,
    entry: entryPoints,

    output: {
        filename: "js/[name].js",
        path: resolve(distPath)
    },

    module: {
        rules: [
            {
                test: /\.(scss|sass)$/g,
                use: [ MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader" ]
            },
            { test: /\.tsx?$/, loader: "ts-loader", exclude: resolve("tests") },
            {
                test: /\.css$/,
                use: [ MiniCssExtractPlugin.loader, "css-loader", "postcss-loader" ]
            },
            {
                test: /\.js$/,
                use: [ "babel-loader" ]
            },
            {
                test: /\.svg$/,
                use: [ "raw-loader" ]
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: "./src/index.html",
            filename: "index.html"
        }),

        new MiniCssExtractPlugin({
            chunkFilename: "css/[id].css",
            filename: "css/[name].css"
        }),

        new CopyPlugin({
            patterns: [
                { from: "public", to: "public", filter: (path: string) => !path.includes("sw.js") }
                // { from: "public/sw.js", to: "" }
            ]
        })
    ],

    optimization: {
        minimize: true,
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: false,
                extractComments: false,
                uglifyOptions: {
                    compress: true,
                    ie8: true,
                    output: { comments: false },
                    safari10: true
                }
            }),

            new OptimizeCssAssetsPlugin({
                cssProcessorOptions: { discardComments: { removeAll: true } },
                canPrint: true
            }),

            new CssMinimizerPlugin({
                parallel: true,
                minimizerOptions: {
                    preset: [
                        "default",
                        {
                            discardComments: { removeAll: true }
                        }
                    ]
                }
            })
        ],

        splitChunks: {
            chunks: "all",
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            enforceSizeThreshold: 50000,
            minSize: 100,
            maxSize: 25000,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        },

        providedExports: true,
        concatenateModules: true,
        usedExports: true,
        removeAvailableModules: true
    },

    devServer: {
        historyApiFallback: true,
        liveReload: true,

        host: "0.0.0.0",
        port: 8089,
        hot: true,

        compress: false,
        static: {
            publicPath: "/public/",
            directory: "./public"
        }

        // https: certificates
    }
} as Webpack.Configuration;

module.exports = (env: any) => {
    if (process.env.NODE_ENV === "production") config.mode = "production"
    else config.mode = "development"

    if (env.ALLOW_DEBUG === undefined) env.ALLOW_DEBUG = config.mode === "development"

    const dotenvFileData = Object.fromEntries(
      fs.readFileSync(path.resolve(__dirname, ".env"), "utf-8")
        .trim().replace(/\r/g, "").split("\n")
        .filter(Boolean)
        .map(item => item.split("="))
        .filter(item => item[0][0] !== "#" && item[1] !== undefined)
    )

    console.log(dotenvFileData, "\n\n\n\n\n\n\n\n\n\n\n\n")

    config.plugins = [
        new webpack["EnvironmentPlugin"]({
            "NODE_ENV": typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "development",
            "ALLOW_DEBUG": env.ALLOW_DEBUG,
            ...dotenvFileData
        }),
        new webpack["DefinePlugin"]({
            "process.env": JSON.stringify({
                "NODE_ENV": typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "development",
                "ALLOW_DEBUG": env.ALLOW_DEBUG,
                ...dotenvFileData
            })
        }),
        ...config.plugins as any
    ]

    return config
}
