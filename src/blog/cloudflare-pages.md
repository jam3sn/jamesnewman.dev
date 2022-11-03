---
title: Switching from Vercel to Cloudflare Pages
date: 2022-11-03
summary: I moved this static site from Vercel to Cloudflare pages, lets talk through the process.
tags: ['post', 'js', 'devops', 'guide']
layout: post
---

Cloudflare has launched its Pages product, [Cloudflare Pages](https://pages.cloudflare.com/). Aimed at JAMstack websites and applications, it joins the many hosting services that offer easy deployment for simple sites like this one! 

I've been using Vercel for a while, it was known as now.sh, then Zeit when I first started using it. Using the hobby tier, their free tier, it's served its purpose just fine and in all honesty I didn't have much of a reason to leave them. However, I already manage my domains through Cloudflare and use their basic but free, privacy respecting analytics, so I figured I'd give Pages ago.

Set up was a breeze. If you've setup a site on a similar service, the workflow is familiar. You link the repository, point it at the branch to monitor, add build configuration and deploy. They have presets for a number of JAMstack frameworks, including the one I use for this site, [11ty (Eleventy)](https://www.11ty.dev/). However I did need to tweak the build steps slightly to my configuration. This included the build command and output directory as shown below.

![Cloudflare Pages build settings](https://res.cloudinary.com/jam3sn/image/upload/c_scale,w_800/v1667498720/Cloudflare%20Pages%20build%20settings.png)

I use [sass](https://sass-lang.com/), or scss, to style the site, so those stylesheets should be compiled into a css file during deployment. Doing this is simply part of my `npm run build` command:
```json
{
  ...
  "scripts": {
    ...
    "styles": "sass src/styles/main.scss src/assets/styles.css --style=compressed --no-source-map",
    "build": "npm run styles && eleventy"
  },
  ...
}
```

I also needed to adjust my rewrite rule for 404s so any urls not found are redirected to the 404 page. In Vercel, you can achieve this like so:
```json
{
    ...
    "rewrites": [{ "source": "/(.*)", "destination": "/404/index.html" }]
}
```
I struggled to find a straight forward way to do this with Cloudflare Pages, but after digging around a little, I found [Cloudflare can resolve 404s](https://developers.cloudflare.com/pages/platform/serving-pages/#not-found-behavior) automatically to a `404.html` file in the top level of your site, meaning I didn't need a `_redirects` file to handle this. So in my `404.ndk` file I simply updated the [front matter](https://www.11ty.dev/docs/data-frontmatter/) to include the `permlink`. This placed it in the top level, instead of `404/index.html`:
```html
---
title: 404
layout: base
templateId: not-found
permalink: 404.html
---
<section>
    <h2>404</h2>
    <hr />

    <p>Hmm, we couldn't find what you were looking for...</p>

    <a class="button" href="/" title="Home">Back to Home</a>
</section>
```

And that was it! My nameservers for jamesnewman.dev were already pointing at Cloudflare, so the DNS just needed updating which Cloudflare can also do at the click of a button. It really is straight forward.

### My thoughts so far
 
As of writing this, the sites only been on Pages for a few days. However Cloudflare analytics seem to be working better and more importantly, the site seems to load faster! Better yet, it's backed by the power, scale and security of Cloudflare.

So should you switch? Maybe. Like I said at the beginning, I didn't _really_ need to switch and you probably don't need to either. But with that in mind, take a look at the feature list on [their site](https://pages.cloudflare.com/), [the pricing tiers](https://pages.cloudflare.com/#pricing) and evaluate if it's worth it for you.
