---
title: Accessing a Unifi network over VPN
date: 2022-11-24
summary: In this post I'm going to walk you through how I setup my VPN server on the Unifi Dream Machine, and it'll likely be the same for the Dream Machine Pro or Security Gateway.
tags: ['post', 'homelab', 'devops', 'guide']
layout: post
headerImage: https://res.cloudinary.com/jam3sn/image/upload/c_scale,w_800/v1668446188/udm-vpn.png
---

In this post I'm going to walk you through how I setup my VPN server on the Unifi Dream Machine, and it'll likely be the same for the Dream Machine Pro or Security Gateway.

I have a few services running in my homelab that I'd like to access when I'm not home, such as Plex and Nextcloud. But exposing these to the open web can be risky and a bit scary. Even though I have my network nicely segregated into VLANs, *(big thanks to my friend Blag for assisting)*, and could use a proxy tool like [FRP](https://github.com/fatedier/frp) or [Cloudflare tunnels](https://www.cloudflare.com/en-gb/products/tunnel/) to avoid opening ports, it's still risky. Of course setting up a VPN server isn't bullet proof, but it is *less* risky. In fact, if you're working remotely there's a good chance you're using a corporate VPN on your work computer to connect to their systems.

### Backup

Before we change any settings on the router I'd suggest creating a backup of your current configuration. Nothing *should* go wrong, but I've learnt the hard way from accidentally locking myself out of my managed switch that it's good to have a rollback point. You can do this from the Unifi OS System settings right after you log in, before selecting the network - Settings > System > Cloud Config Backup `https://[your_gateway_ip]/settings/system`.

![Unifi OS > Settings > System > Cloud Config Backup](https://res.cloudinary.com/jam3sn/image/upload/c_scale,w_800/v1668448481/udm-vpn-backup_hnpd8g.png)

Create a new backup and then download it. You should have a download similar to `unifi_core_backup_[some_string].unifi`.

### VPN Server Configuration

Go ahead and click into your Unifi network > Settings > Teleport & VPN `https://[your_gateway_ip]/network/default/settings/vpn`.

Now Unifi does have a zero configuration VPN "Teleport", however access with this is limited. You'll need to use the WiFiman app on mobile, and desktop... well as of writing this the macOS app is "coming soon" and there's no support for Windows.

We're going to opt for the traditional VPN server further down on the page. So check the enable VPN Server box and we can start entering our settings.

![Unifi Traditional VPN settings](https://res.cloudinary.com/jam3sn/image/upload/c_scale,w_800/v1668449603/udm-vpn-server-settings_hbsuqt.png)

Fields of note:
- Pre-shared Key - You'll need this later when connecting, I added it to my password manager with the username and password further down.
- User Authentication.
- Network Name - This will show in the network column of the "Clients" page in the Unifi Network along with the username connected.
- Gateway/Subnet - This is the Subnet / IP range you want your VPN clients to be on. I'd recommend setting the network size as small as you require, such as 29 (5 IPs).
- Require Strong Authentication - It may cause issues for some devices, but I've not encountered this so far.

It's worth noting the VPN cannot be on a VLAN, nor can it be in a VLANs IP range. However we can still configure firewall rules with groups, which we'll cover further down.

With those configured, your VPN server should be ready. You'll connect shortly via your public IP, but I would recommend using a DDNS (dynamic domain name system) if you don't have a static IP like me. My [Synology NAS has a service built-in](https://kb.synology.com/en-global/DSM/help/DSM/AdminCenter/connection_ddns?version=7) for this, but there's many others out there including [DuckDNS](https://www.duckdns.org/) and [Cloudflare](https://developers.cloudflare.com/dns/manage-dns-records/how-to/managing-dynamic-ip-addresses).

### Connecting

Now we have our VPN server running, lets try connecting! I'll be connecting from an iPhone and mac. But here's steps for [Android](https://support.google.com/work/android/answer/9213914?hl=en) and [Windows](https://support.microsoft.com/en-us/windows/connect-to-a-vpn-in-windows-3d29aeb1-f497-f6b7-7633-115722c1009c), the steps below should give you an idea.

#### iPhone

From settings, either search for VPN, or go to General > VPN & Device Management > VPN > Add VPN Configuration.

![iPhone VPN Configuration](https://res.cloudinary.com/jam3sn/image/upload/c_scale,w_400/v1668457648/udm-vpn-iphone_gzgmpt.png)

#### Mac

From settings, either search for VPN, or go to Network > Three dot button in the bottom right > Add VPN Configuration > L2TP over IPSec.

![Mac VPN Configuration](https://res.cloudinary.com/jam3sn/image/upload/c_scale,w_800/v1668458381/udm-vpn-mac_hjv6iq.png)

### Creating Groups

Once connected, a VPN user will be on your network almost as if they're connected locally. Depending on your preference or threat tolerance you might want to lock this down. I've configured my firewall to block all LAN activity except for specific rules I've created, such as connecting to [PiHole](https://pi-hole.net/) for DNS based ad blocking, or Plex as mentioned at the beginning.

First, we want to setup a group for the VPN. We can then use this group when creating firewall rules rather than adding each possible IP. To do this, go to Profiles in the Settings sidebar and scroll down to "Port and IP Groups" - `https://[your_gateway_ip]/network/default/settings/profiles`. Click "Create New Group".

![Create VPN Group settings](https://res.cloudinary.com/jam3sn/image/upload/c_scale,w_800/v1668451631/udm-vpn-group_isfqbp.png)

We'll create a group called "VPN Users", with the "IPv4 Address/Subnet" type. For the address we want to enter the subnet used by the VPN server in the last section. You might notice I've used `24` instead of the `29` that I configured for the VPN Server. This is incase I resize my VPN network later, I still want this group to apply to all IPs on the VPN subnet.

I also have another group named "RFC1918". This is a standard which defines the subnets used in private networks, you can read more about it [here](https://en.wikipedia.org/wiki/Private_network). I use this group to make blanket rules, like blocking all access to something. I then followup with another rule higher in the hierarchy that allows access for specific networks, IPs or groups. I'd recommend making this group too.

![Create RFC1918 Group settings](https://res.cloudinary.com/jam3sn/image/upload/c_scale,w_800/v1668452467/udm-vpn-rfc1928-group_zzjvne.png)

You should now have 2 groups ready to use in the firewall.

![Group settings](https://res.cloudinary.com/jam3sn/image/upload/c_scale,w_800/v1668452613/udm-vpn-groups_mz68g1.png)


### Firewall Rules

Navigate to the Firewall & Security page from the Settings sidebar and scroll down to Firewall Rules - `https://[your_gateway_ip]/network/default/settings/security`. Click "Create New Rule".

First we're going to create a rule to block the VPN group from connecting to any IP on the network. We'll then follow up with additional rules allowing access to specific IPs, groups or networks (VLANs).

![Create Block VPN from LAN rule](https://res.cloudinary.com/jam3sn/image/upload/c_scale,w_800/v1668455128/udm-vpn-block-vpn-lan_o3zwl9.png)

Fields of note:
- Type - Set to LAN out - I'll be honest, I still don't fully understand this, but it's to do with the flow of traffic.
- Action - We want to drop all connections.
- Source Type - Where the traffic's coming from, our VPN Users group.
- Destination Type - Where the traffic's going, anywhere on the LAN.

Note this doesn't block connections from the VPN user to the gateway, even if you use port groups. At the time of writing this it's a well documented issue with Unifi which is yet to be resolved.

Now we've blocked all traffic from the VPN subnet to our LAN, we want to create some rules allowing specific connections. I'm going to create one allowing access to PiHole, but the steps are similar for allowing access to another group or network.

![Create Allow VPN access to PiHole rule](https://res.cloudinary.com/jam3sn/image/upload/c_scale,w_800/v1668456767/udm-vpn-allow-pihole_b6imon.png)

This time the Action is `Accept` and the Destination Type is `IP Address`, but the source is the same - the VPN Users group.

Now that's added, we need to change the order of the rules as by default new rules are added to the bottom of each type, meaning anything above them such as the Block VPN from LAN rule will take precedence. On the left of each row you can click and drag, you want Allows above the Blocks.

![Order of firewall rules](https://res.cloudinary.com/jam3sn/image/upload/c_scale,w_800/v1668457163/udm-vpn-firewall-order_copoq5.png)

Go ahead and add any other rules you want to allow and that's it. Connect your phone or computer, test you can connect to the allowed IPs, and also test that you can't connect to the IPs you shouldn't be able to. 

#### In Closing

So that's now how I access my home network while remote. I plan on testing it properly on a small trip in the coming weeks, but so far it seems to work nicely.

I also planned on making a shortcut on my iPhone to automatically connect and disconnect from the VPN whenever I'm not on my WiFi, however iOS 16 doesn't have any support for VPN settings. Additionally, automations only support connection to a specific network, not disconnecting. Hopefully this will be expanded in future iterations.