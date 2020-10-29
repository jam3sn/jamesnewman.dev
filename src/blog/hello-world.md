---
title: Hello World
date: 2020-10-29
summary: Welcome to my new site, built with Eleventy, pure CSS and zero JS. Oh so simple.
tags: ['post']
layout: post
---

Welcome to my new site, now featuring... a blog (jazz hands)! It's taken a few steps into the minimal direction, but apparently that’s cool at the moment.

My primary intention for rebuilding my personal site was to create something simple where I could blog and post projects. With this in mind, I was somewhat tempted to build my own static site generator in Node with TypeScript, as a method of better learning Nodes file system api. And because most of the solutions I had heard of, e.g. [Gridsome](https://gridsome.org "Gridsome") and [Gatsby](https://www.gatsbyjs.com "Gatsby") felt overly large and cumbersome. However, I stumbled upon [Eleventy](https://www.11ty.dev "Eleventy (11ty)") (11ty) and it’s the perfect fit.

In their own words, “Eleventy is a simpler static site generator”, doing exactly what it says on the tin. It’s versatile, allowing you to use markdown, html, and a variety template files, whatever suits your taste.  Additionally, there’s a small ecosystem of plugins for things like RSS, Navigation and Syntax highlighting.

I did however find the initial setup of my project to be a little tricky, lots of digging around the docs, example projects and googling, but I’ve reached a point now where I get it, and I like it.

So all in, I’m using [Eleventy](https://www.11ty.dev "Eleventy (11ty)") (obviously) as the SSG, SCSS to write my CSS, some open fonts, [Cloudinary](https://cloudinary.com "Cloudinary") to serve images and [Vercel](https://vercel.com "Vercel") (previously now.sh / Zeit) to host it all. Oh, and zero, nil, none… no JS on the site whatsoever. I’m intending to try [Cloudflare’s new web analytics](https://www.cloudflare.com/en-gb/web-analytics/) for monitoring the sites analytics, while respecting readers privacy.
