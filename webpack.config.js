var path = require("path");

module.exports = {
	entry: {
		app: ["./app/index.jsx"]
	},
	mode: 'development',
	devtool: 'nosources-source-map',
	output: {
		path: path.resolve(__dirname, "build"),
		filename: "app.js",
		sourceMapFilename: "app.js.map"
	},
	devServer: {
		contentBase: "./build",
		host: "127.0.0.1"
	},
	module: {
        rules: [
	    	{ test: /\.css$/, loader: "style-loader!css-loader" },
	    	{
		      test: /\.jsx$/,
		      exclude: /(node_modules|bower_components)/,
		      loader: 'babel-loader',
		      query: {
				"presets": ["@babel/preset-env", "@babel/preset-react"],
				"plugins": ["emotion"]
		      }
		    }
		]
	}
};