const CleanCSS = require("clean-css");

module.exports = function (eleventyConfig) {
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