---
title: Routing to multiple Minecraft servers on a host
date: 2022-10-17
summary: Following up my previous post on running Minecraft servers in Docker, lets configure a proxy to Route domains to multiple Minecraft servers on the same host, but without different port numbers for each server.
tags: ['post', 'docker', 'devops', 'guide', 'minecraft']
layout: post
headerImage: https://res.cloudinary.com/jam3sn/image/upload/c_scale,w_800/v1668105698/docker-minecraft.png
---

In my [previous post](/blog/docker-minecraft-servers) I walked through the setup of a Minecraft server with docker. But now you might want to setup a few servers on the same host and route domains to them without different ports, a bit like reverse proxying.

By default Minecraft runs on port `25565`, but when we have multiple servers running on the same host, they can't all expose port `25565` and so you end up with something like `25565, 25566, 25567` etc. With [mc-router](https://hub.docker.com/r/itzg/mc-router), we can route all those domains to `25565` and resolve them to the configured server!

### The Environment

At a minimum you'll need Docker installed on the host, but we'll also be using Docker Compose. If you followed the [previous post](/blog/docker-minecraft-servers) you're all set. If you need to install Docker Compose, you can follow their guide [here](https://docs.docker.com/compose/install/).

This solution also requires at least one domain to route to our server. Point your desired domains or subdomains at the server ip hosting your servers. If you're experimenting with this locally, you can add an entry to your hosts file to point to `localhost`. In this post I'll be using the following example domains set in my hosts file:

``` bash
nano /etc/hosts
```

``` bash
mc.example.com
modded.example.com
events.example.com
```

### Setting up the router

We'll be using another docker image from [itzg](https://github.com/itzg), this time [itzg/mc-router](https://hub.docker.com/r/itzg/mc-router). So go a head an open you docker compose file. If you followed the previous post, we'll continue using the same `docker-compose.yaml` file.

First we're going to need to remove our `ports` definition for each server, we don't need to expose these any more as we'll make use of dockers internal networking. Then we can go ahead and add our `mc-router` service.

``` yaml
version: "3.8"
services:
    vanilla:
        container_name: vanilla
        image: itzg/minecraft-server
        environment:
            EULA: "TRUE"
            MEMORY: 2G
        volumes:
            - ./vanilla:/data
        restart: unless-stopped
        tty: true
        stdin_open: true
    
    mc-router:
        image: itzg/mc-router
        environment:
            API_BINDING: ":25564"
        ports:
            - 25565:25565
            # bind the API port to only loopback, this avoids external exposure
            - 127.0.0.1:25564:25564
        command: --mapping=mc.example.com=vanilla:25565,modded.example.com=modded:25565,events.example.com=events:25565
```

You can see in the `command` line, we've mapped our domains to our containers:

``` bash
mc.example.com      -> vanilla
modded.example.com  -> modded
events.example.com  -> events
```

Now go ahead and startup the stack with `docker compose up` and test them out in your Minecraft client!

If you'd like to know a little more about how it works, I'd recommend taking a look at the [itzg/mc-router doc](https://hub.docker.com/r/itzg/mc-router) where they include some diagrams and alternative configurations.