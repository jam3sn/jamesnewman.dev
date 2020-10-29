---
title: Enkel
date: 2020-01-15
summary: Enkel, the clean and simple RSS Reader, built with Laravel, Inertia and Tailwind.
tags: ['project', 'personal']
layout: project
---
![Enkel Feed](https://res.cloudinary.com/jam3sn/image/upload/c_scale,w_800/v1603986274/Home.jpg)

I was tired of being bombarded with ads, pop-ups, videos and notifications while trying to read articles or blogs. That’s why I built Enkel, it’s a clean and simple, privacy driven RSS reader that lets you focus on the content that matters.

### The Stack
The web application was built using Laravel, PostgreSQL, Stripe, Inertia.js, Vue.js, Mercury Parser and Tailwind. I hosted it on a single $5 Digital Ocean droplet, and the database in their managed databases solution. Let me break those down:

- [Laravel](https://laravel.com "Laravel") - PHP backend framework for quickly building out the application, and made use of PHPs XML library to parse RSS feeds users were following.
- [PostgreSQL](https://www.postgresql.org "PostgreSQL") - The database, nothing fancy here.
- [Stripe](https://stripe.com/ "Stripe")  - My payment provider of choice, using Laravel Cashier for an easier integration.
- [Inertia.js](https://inertiajs.com "Inertia.js") - Allows you build a frontend with the feel of an SPA, but use the backends routing and controllers.
- [Vue.js](https://vuejs.org "Vue.js") - My preferred choice in modern frontend frameworks.
- [Mercury Parser](https://github.com/postlight/mercury-parser "Mercury Parser") - A super cool open source tool for parsing any page online into simple HTML, Markdown or text.
- [Tailwind](https://tailwindcss.com "Tailwind") - Utility based CSS framework, doesn’t impose any design, just provides the tools for quick and iterative CSS.
- [Digital Ocean](https://www.digitalocean.com "Digital Ocean") - My preferred choice in cloud providers, their Droplets (VPS) are fast and they’ve just launched a new PaaS service.

### End of life
It’s a project I’ve since shutdown to focus my time and resources on other projects and work.