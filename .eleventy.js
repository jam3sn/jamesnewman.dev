const CleanCSS = require("clean-css");

module.exports = function (eleventyConfig) {
  // CSS Inline
  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });
  
  // Copy assets over
  eleventyConfig.addPassthroughCopy('src/assets');

  // Config
  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_layouts",
      output: "dist",
    },
    htmlTemplateEngine: "mustache"
  }
};