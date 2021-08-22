const fs         = require("fs");
const htmlmin    = require("html-minifier");
const CleanCSS   = require('clean-css');


module.exports = function(eleventyConfig) {
	// Minify HTML
	eleventyConfig.addTransform("htmlmin", (content, outputPath) => {
		if( outputPath && outputPath.endsWith(".html") ) {
			let minified = htmlmin.minify(content, {
				minifyCSS: true,
				minifyJS: true,
				useShortDoctype: true,
				removeComments: true,
				collapseWhitespace: true,
			});
			return minified;
		}

		return content;
	});

	// 404 page for local development
	eleventyConfig.setBrowserSyncConfig({
		callbacks: {
			ready: function(error, browserSync) {
				if(error){
					throw new Error(error);
				}

				browserSync.addMiddleware("*", (request, response) => {
					const content_404 = fs.readFileSync("_site/404.html");
					response.write(content_404);
					response.writeHead(404);
					response.end();
				});
			}
		}
	});

	eleventyConfig.addFilter("cssmin", code => new CleanCSS({}).minify(code).styles);

	// Create a post collection
	eleventyConfig.addCollection("post", collectionApi => {
		return collectionApi.getFilteredByGlob('pages/posts/*.md');
	});

	eleventyConfig.addPassthroughCopy({"_layout/*.png": "/"});
	eleventyConfig.addPassthroughCopy({"pages/posts/*.jpg": "/"});

	return {
		dir: {
			input: "pages",
			includes: "../_layout",
			data: "../_data"
		}
	};
};