const CleanCSS = require("clean-css");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventyConfig) {
  // Copy assets over
  eleventyConfig.addPassthroughCopy('src/assets');

  // Syntax highlighting
  eleventyConfig.addPlugin(syntaxHighlight);

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