const CleanCSS = require("clean-css");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function (eleventyConfig) {
  // Copy assets over
  eleventyConfig.addPassthroughCopy('src/assets');

  // Copy over meta related files
  eleventyConfig.addPassthroughCopy({'src/meta': '/'});

  // Syntax highlighting
  eleventyConfig.addPlugin(syntaxHighlight);

  // RSS Support
  eleventyConfig.addPlugin(pluginRss);

  // Order posts desc
  eleventyConfig.addCollection("posts", function (collection) {
    return collection.getFilteredByTag("post").reverse();
  });

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