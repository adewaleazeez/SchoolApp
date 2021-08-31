var path = require('path');

module.exports = {
   entry: {
      app: './web/globals.js'
   },
   output: {
      path: path.resolve(__dirname, 'dev'),
      filename: 'main_bundle.js'
   },
   mode:'development',
   module: {
      rules: [
         {
            test:/\.(js|jsx)$/,
            include: path.resolve(__dirname, 'src'),
            loader: 'babel-loader',
            query: {
               presets: ['es2015','react']
            }
         }
      ]
   }
};


/*var HTMLWebpackPlugin = require('html-webpack-plugin');
var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
	template: 'web/index.jsp',
	filename: 'build/index.jsp',
	inject: 'head'
});

module.exports = {
	entry: 'web/components/app.js',
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			}
		]
	},
	output: {
		filename: 'transformed.js'
		path: 'build'
	},
	plugins: [HTMLWebpackPluginConfig]
};*/