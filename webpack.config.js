var path = require("path");

module.exports = {
	entry: {
		app: ["./app/index.jsx"]
	},
	output: {
		path: path.resolve(__dirname, "build"),
		filename: "app.js"
	},
	devServer: {
		contentBase: "./build",
		host: "127.0.0.1"
	},
	module: {
        loaders: [
	    	{ test: /\.css$/, loader: "style-loader!css-loader" },
	    	{
		      test: /\.jsx$/,
		      exclude: /(node_modules|bower_components)/,
		      loader: 'babel-loader',
		      query: {
		        presets: ['es2015', 'react']
		      }
		    }
		]
	}
};