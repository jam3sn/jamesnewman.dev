---
title: Running Minecraft servers from Docker
date: 2021-09-02
summary: Lets get some Minecraft servers setup and managed through docker!
# tags: ['post', 'docker', 'devops']
layout: post
---

Since picking up docker last year it's completely changed how I set up projects, home network applications, and now how I deploy Minecraft servers for friends. Gone are the days of figuring out which version of JDK I need on an ubuntu box and remembering the commands to reconnect to a [screen](https://help.ubuntu.com/community/Screen) session.

In this post I'll walk you through setting up a few different Minecraft servers, running vanilla, Paper and Forge, all on the same host. In a [follow up post](/blog/routing-minecraft-servers) I go through routing to these server on the same port.

Before we get started, I'd recommend having some basic command line and linux knowledge. In addition, pre-existing docker and docker-compose experience is a bonus but **not** required.

### The Environment

Docker being docker, you can run this on Windows, Linux, macOS - A spare computer, the cheapest DigitalOcean droplet, heck even a Raspberry Pi! Just make sure your systems up to date, has docker and docker-compose installed. Here's what we'll be using:

- A docker host, the steps below are for Ubuntu but you can use any.
- [itzg/minecraft-server](https://hub.docker.com/r/itzg/minecraft-server) docker image to run the server.

#### Install Docker & Docker Compose

These instructions are for x86_64 / amd64 systems. Dockers full install guide is available [here](https://docs.docker.com/engine/install/ubuntu/) and the full Docker Compose guide [here](https://docs.docker.com/compose/install/).

``` bash
# Install the required packages
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Dockers GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add the docker repository
echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Finally install Docker Engine
sudo apt-get update && sudo apt-get install docker-ce docker-ce-cli containerd.io

# Add your user to the docker group. You'll want to log out and back in so the permissions are set
sudo usermod -aG docker $USER

# Download Docker Compose (Change the version from 1.29.2 to the current version)
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Apply executable permission to the binary
sudo chmod +x /usr/local/bin/docker-compose
```

Now you should be all set! To double check, run the following:
``` bash
# Check the Docker version
docker -v

# Check Docker Compose version
docker-compose -v
```

### Creating our first server with Docker Compose

It's vary rarely I'll run a docker image with the docker command line. Having to remember the command and all the arguments I need, it's all a faff, however if you'd prefer to use this, take a look [here](https://hub.docker.com/r/itzg/minecraft-server).

Now, lets define our first Minecraft server, a simple vanilla server. First up, we'll create a directory to store all this. It can be your home directory, or elsewhere. We also need to create a docker-compose file.

``` bash
# Create directory
mkdir minecraft-servers

# cd into the directory
cd minecraft-servers

# Create a docker-compose.yml file
touch docker-compose.yml

# Create a directory to store our vanilla server files in
mkdir -p vanilla/server
```

Go ahead and open the docker-compose.yml. You can use nano, vim or even connect [VS Code with SSH](https://code.visualstudio.com/docs/remote/ssh).
In here we want to define our vanilla service:

``` yaml
version: "3.8"
services:
    vanilla:
        container_name: vanilla
        image: itzg/minecraft-server
        ports:
            - 25565:25565
        environment:
            EULA: "TRUE"
            MEMORY: 2G
        volumes:
            - ./vanilla/server:/data
        restart: unless-stopped
        tty: true
        stdin_open: true
```

This is the bare minimum configuration, but there's a whole bunch of options you can define such as ops, whitelist, difficulty etc, all documented [here](https://github.com/itzg/docker-minecraft-server/blob/master/README.md#server-configuration). Now we're ready to test our first server works, so lets spin it up!

``` bash
# Start the service
docker-compose up
```

You'll should now see the server begin to start up. It'll take a little while on the first launch as it downloads the image and server files, and there'll be a bunch of text logged to the screen. You'll know it's ready when you see:

``` log
vanilla | [17:22:18] [Server thread/INFO]: Done (13.045s)! For help, type "help"
```

Congratulations, you can now connect to your new server using the server IP or `localhost` if you're running it on the same machine! To exit, you can use `ctrl + c` in the terminal.

If you take a look in the `vanilla/server` directory we created earlier, you'll see it's generated all the server files needed. You *can* go ahead and edit the `server.properties` if you wish to make any changes to the servers configuration, however I'd recommend adding these to the `environment` block in our `docker-compose.yml` and simply deleting the `server.properties` file. This file will be recreated when you next start the server with your newly added environment options.



### Adding different server types

So we have our vanilla server set up, but if we want to use some server plugins, to say manage permissions or add prefixes to usernames in chat, we'll need to use a different server type. For a vanilla server, you have a few options, most popular: Bukkit, Spigot and Paper. We'll use Paper.

First, lets create a directory to keep our plugins in:

``` bash
mkdir vanilla/plugins

```

You can go ahead and add any plugins to this directory and we'll configure the container to mount these. You can also leave it blank for now and once we start the server you'll see `bStats` automatically added by Paper.

Now in our `docker-compose.yml` file, we'll add a new entry to the `environment` block of our `vanilla` service, defining the server type. We'll also mount the plugins directory we just created.

``` yaml
version: "3.8"
services:
    vanilla:
        container_name: vanilla
        image: itzg/minecraft-server
        ports:
            - 25565:25565
        environment:
            # Add our server type
            TYPE: PAPER
            EULA: "TRUE"
            MEMORY: 2G
        volumes:
            - ./vanilla:/data
            # Mount our plugins directory
            - ./vanilla/plugins:/plugins
        restart: unless-stopped
        tty: true
        stdin_open: true
```

Lets spin up the updated server, you'll see it download the new jar and create some new files.

``` bash
# Start the service
docker-compose up
```

Great! So now we have a vanilla server running, we add some plugins and manage various aspects of the server. Now lets take a look at a modded server!

### Lets Forge on

 

### Managing our servers


### Proxying and Routing domains to Minecraft Servers

In a follow up post, I go through adding adding [itzg/mc-router](https://hub.docker.com/r/itzg/mc-router) to route domains to multiple servers, all using the default `25565` port. No more ugly server addresses with different ports! You can read about that [here](/blog/routung-minecraft-servers)