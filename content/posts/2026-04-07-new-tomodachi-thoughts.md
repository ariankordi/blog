---
title: So that new Tomodachi game, huh?
date: 2026-04-07T00:00:00-04:00
draft: false
linkTitle: New Tomodachi Thoughts
---

Where were you when Nintendo announced their new Tomodachi Life game? I sure wasn’t expecting that announcement!
So nice of Nintendo Co Ltd., oh that’s sweet billion dollar company, them, for doing the bare minimum and listening to their fans! We truly are Living The Dream. ☺️ 

As someone who’s been going embarrassingly deep into reversing and analyzing the internals of Mii characters over the past two years, you would probably imagine that I’ve been in endless excitement over this game. Ehhhh…

But of course, things have been moving really fast in the past few weeks. That will happen when Nintendo shadow-drops a demo for a highly anticipated game on a random Wednesday.

## First Impressions?
Allow me to wind back to the original direct. I was very pleased to see that Nintendo didn’t kill the series or Miis in general, like many were. This was a good thing! I love this.
Was I fan of the art style, the new voices, or every single other decision made in this game? Nope. I didn’t even play that much of the original on 3DS, because it gets very repetitive.
**image: my complaints? **
![image.jpeg](Attachments/49D31505-3E65-4A77-BBCF-319B845C4B68.jpeg)
*Some of my initial complaints when the game was revealed on 3/27/2025.*

But with my opinions aside, what people couldn’t stop talking about was the extra customization. Oh, all of the new options.
**image: what can convey this customization?**
I remember speculation going on for weeks about the new ears, all of the new hair customization, that little stupid sparkle in their eyes that I don't like...
**image: same as above but another one demonstrating it**

## New Mii Features!!!!!
Yes. There are many. We look into the game's assets and there's a lot to explore.
**image: mii models in toolbox**

I should say that previously all games always got the exact same Mii assets (no room to use custom ones), because new assets also means a new data format that all of the code needs to be updated to use.

For this reason, games usually add custom headwear/clothing/wigs that don’t affect the generated head model itself.
If I’m not wrong, Miitopia on Switch overlay its custom textures over the existing ones and appends its custom data format after the stock format.

**image: miitopia mask**
Specifically, they disable certain assets and draw custom ones on this “mask” face texture.

Allow me to gather all of the new features I've observed from the assets, even though I'm probably missing a few things:

**Shapes**
* General
    * They have tried to build multiple variants into the same bfres model, when needed.
    * Some of these parts also have bones now, such as hair. I think this is for the physics? Regardless, Mii head shapes NEVER used to have these.
* Ears
    * There are four of them. I think everybody stopped caring when we realize these are optional.
* Hair: All, Front, Back, Parts
    * Back hair can have many different positions: upper, middle / left, right, center
    * The old hair types are in “HairLegacy”.
    * They put the variant for hats as a separate mesh in the same file.
    * Interestingly, the “flipped” model is just a separate mesh entirely.
        * Previously they just flipped X on the model.
        * In some engines, this caused issues with triangle ordering.
        * Did they just get sick of doing that, or was there another reason (bones)?
* Glasses
    * These are now properly modeled shapes, wow.
    * Previously it was always this one “glass” plane, and then the actual glasses type texture was an overlay.

**Textures**
* Skin
    * instead of makeup/wrinkles, there are two different layers to each:
    * MakeUpper, MakeLower, WrinkleLower, WrinkleUpper
* Mouth
    * You can rotate it.
* Eyes
    * All eyes have this red channel to them, which I I’m assuming **can you look up what they called this in nn mii**
    * There is now: EyelidUpper, EyelidLower, EyelashLower, EyelashUpper
* “Highlight”
    * This is that little sparkle in the eyes.
**is that complete?**

### What Isn't New
You know, the way the facial texture is drawn on Miis has always been a little bit unusual. You would assume (and many have) that they are individual quads on top of the face, but instead they’re drawn into an intermediate square texture that’s then over, laid onto… This.
**image: mask shape**
I could’ve sworn Nintendo chose to do it differently this time around, but they didn’t! The new game still draws them this way.
**image: mask shape on epstein**

The reason I found this so interesting it’s because personally I was looking into a way to draw this thing without the intermediate texture, and I found something in the files suggesting they may have…?
**image: mask texture**
What you’re looking at represents the curvature of that “mask” shape, but in a texture instead of as triangles.
The problem if you try to throw those individual facial elements as quads is that they don’t have this same curvature, but I believe this would allow them to simulate that without the full shape.

It’s possible they still use this somewhere…? Or at least used to. That intermediate texture method is definitely more memory efficient, and given that the capture above was from in-game, I should probably check what it looks like in the editor.

### New Mii Data Format WahoooOo
Like I already alluded to, all of these fun new features also means a fun new proprietary Mii data format specific to this game that we have to reverse engineer.

The day the demo released, I immediately ripped into the binary in Ghidra and looked for anything that lead me to the Mii data format. I got just what I needed: a function that converted Switch "CharInfo" to the brand new format.
![and out of the game using a pet](Attachments/087402FD-2A94-4F93-B057-23CAF3BBC28C.jpg)
[https://x.com/aaaarrrriaaannn/status/2036827883054739817/photo/2](https://x.com/aaaarrrriaaannn/status/2036827883054739817/photo/2)

The official name for this [from the save file](https://github.com/tlmodding/ltd-gamedata/blob/main/GameDataStruct.json#L21295C6-L21295C16) is “CharInfoEx”. Cool name.
(In case you’re wondering, the save file editor folks observed this game using a hashmap for properties in the save file. Most of the hashes were easily solved, revealing these names.)
![f main -](Attachments/FDE764CC-D6F2-45B3-8B1D-FB0262382D3F.jpg)
At first I did an initial sweep for all of the fields shared between the old and new format, then [McSpazzy](https://github.com/McSpazzy) got the rest of the fields down. About a week or two went by since my first attempt, and I also found a few tools on GameBanana that extract/inject Miis from the save file. Good stuff.

As of now, you can use Spazzy's new JS library he whipped up: [tlmodding/charinfo-ex: Parser for Tomodachi Life: Living the Dream CharInfoEx data](https://github.com/tlmodding/charinfo-ex)
It’s no Epic [Universal Fusion Library](https://ariankordi.net/posts/2026-mii-fusion/)!!!!!!, but it’s definitely better than nothing. I have even seen the author of TomodachiShare [toying with this](https://github.com/trafficlunar/tomodachi-share/pull/26), so expect him to add it to that site as well in the coming weeks.


## The Only Way to Get Miis In and Out
At some point in January, the inevitable was confirmed. Nintendo didn't want any online sharing going on in this game.
![in addition to those screenshot imits, the Japanese website confirms that the game does not have any online](Attachments/70CE91A5-2373-4E46-904A-775E907FC5DC.jpg)
*Source: [Animal Crossing World](https://animalcrossingworld.com/2026/01/tomodachi-life-has-harsh-restrictions-on-sharing-screenshots-mii-designs-online/)*

Despite the initial shock, as well as the unsurprised "Oh Nintendo!" reactions, what wasn't obvious is that this was actually a first for Miis. Since the very beginning, they've had many ways to spread.
* Wii: WiiConnect24, **Wii Remote** Mii storage, Check Mii Out Channel, Mii Parade, third-party games
* 3DS: **Mii QR codes**, Wii U/Wii/TomoColle transfer, **StreetPass**, Friends List
* Wii U: WaraWara Plaza, Wii transfer, Miiverse, Friends List again, **amiibo**, Mii JPEGs
* Switch: They at least gave us a way in/out (amiibo), and Miitopia Switch had "access codes".

As you can see, every console above had a way to exchange Miis with people, including Miitopia on Switch. This new Tomodachi Life won't let you exchange Miis with strangers. Or at least, that's not what they intended.
Don't worry folks, Nintendo Co., Ltd. did add ONE way: local Wi-Fi transfers. Wow, the bare minimum!
![Share the Mii and items you](Attachments/E6A8EC53-2A9E-4D5B-BF37-E9E53A08F932.jpg)
*Their [Japanese site](https://www.nintendo.com/jp/switch/blfga/index.html?modal=1) demonstrates this.*

### Spoofing Local Wi-Fi Transfers?
This is the first thing that came to my mind as well as the minds of many others: there's **gotta be** a way to do this from a PC. I've been following this mindset as well, and eagerly waiting for my opportunity to look into it.

Thankfully, the seldom-used Local Wi-Fi feature on the Nintendo Switch has actually been reverse engineered! There is a repo by Kinnay, who's been doing this kind of network/security research around Nintendo consoles for a while: [https://github.com/kinnay/LDN](https://github.com/kinnay/LDN)
```
Python package for local wireless communication with a Nintendo Switch
This package is able to scan for nearby LDN networks, join them, and even host your own networks. To get started, check out the examples folder or documentation.

```
Just what the doctor ordered, right? But of course, there's more to it than that.
* This requires Linux, and root access, as well as a special Wi-Fi card supporting "monitor mode".
* It's just the protocol for local Wi-Fi, but the game has its own communications on top which is our job to reverse.
* There's then the question of what to do with the Mii data - render? edit? - but that's not the most important part.

These are all big questions, but the one most relevant is about the protocol.

### Reversing? The Local Wi-Fi? Protocol?
So when I was originally thinking about this in February, the demo wasn't released so I couldn't look into it. But even after the demo shadow-dropped in March, it turns out that it unfortunately doesn't include any code for the local Wi-Fi transfers (just the UI for it).
![March 30, 2026](Attachments/52D3AD81-7466-432E-B589-55D68181E6A6.jpg)
What do we do instead? I didn't want to just sit idly for two reasons: first, we could obviously still be more prepared for when the game does come out. But second and more importantly: There is another Mii local Wi-Fi feature that can be reversed.

This feature often gets glossed upon, but the Wii/DS, 3DS/Wii U, and Switch all have a local Wi-Fi transfer option for Miis.
![Received](Attachments/027F8A74-0E30-4B6E-B031-848B6F8818D1.jpg)
3DS -> Wii (Source: [Nintendo Life](https://www.nintendolife.com/news/2012/11/guide_transferring_your_mii_to_the_wii_u)).
![3-ds-to-wii-u-1.large.jpg.jpeg](Attachments/76EEF013-0160-4753-8718-BE8B13243D31.jpeg)
*3DS <-> Wii U (Source: [Nintendo Life](https://www.nintendolife.com/news/2012/11/guide_transferring_your_mii_to_the_wii_u)).*
![Send/Receive](Attachments/45B91976-C973-48C2-A80B-468A06CF6F4D.png)
*Switch <-> Switch (Source: [Nintendo Wire](https://nintendowire.com/guides/switch/transfer-miis/)).*

I've always been curious about this feature as a whole, since nobody has cared to reverse-engineer them up to this point. Sometimes I've even pictured [including this into an "ultimate" Mii toolbox](https://ariankordi.net/posts/2026-mii-status-frontend/#new-website-mii-toolbox). At the very least, it's more convenient than writing/scanning a bunch of QR Codes or amiibo. Let's look into this!

Because Wi-Fi is encrypted, we obviously can't just sniff communications between two consoles over the air. There's two methods to overcome this for LDN: [ldn_mitm](https://github.com/spacemeowx2/ldn_mitm), which forwards them over local Ethernet, and simply doing the local communication in an emulator (Ryujinx).

The first time I tried to use the MiiEdit applet's local transfer feature in Ryujinx, I saw... this:
![Create Newi](Attachments/CB47C905-EC20-4F87-A9F1-F79ACE32920E.jpeg)
I found this very strange, because I 100% definitely had Internet enabled in Ryujinx. This seemed like a "wi-fi enabled" option that only system applets searched for, because any other game in this scenario shows a *generic* error message like this, indicating it at least tried: 
![rouse turn Airplane Mode off when appropriste fo](Attachments/4E11BFDD-66AE-4C1B-9C02-B47D0DEDA909.jpeg)
At this point, I gave up for now. But when I asked the ReSwitched Discord, instead of being ignored like I was certain would happen, a kind soul ACTUALLY reached out to me to help me with this! It's like, wow, someone finally chose to help me the way I help others.
![not sure how you even got that far. This insales Dysteneral CemetenService inhead of I0verocal ComicationService](Attachments/9C852A59-73E2-4D39-A10C-D3B3587EF38C.jpg)
This guy "TSR Berry" has been looking into LDN and reimplementing it in Ryujinx and other places, and he identified two issues that lead to this:
* Yes, the MiiEdit applet is using two APIs Ryujinx didn't implement (IsWirelessCommunicationEnabled, IsAnyForegroundRequestAccepted)
* But it is also using... a copy? of the LDN service.
    * Usually it's called IUserLocalCommunicationService
    * But THIS APPLET SPECIFICALLY is using ISystemLocalCommunicationService
* Berry concluded the services are similar-ish, so he split it into a base class and reused it for both. This is what Nintendo did, as well. (Source: Trust me bro)

So, not off to a good start already. It took me many weeks to come back to this, but I eventually did more testing in Ryujinx and also met disappointing results.
* I couldn't easily test between a real console, because I think ldn_mitm itself had to be modified to MITM the "system" service as well as the user service. I didn't want to bother with this whatsoever.
* Apparently there is a bug with LDN on Mac so I had to use my work laptop to test with two instances of Ryujinx.
* At first it didn't show up, due to this weird "got empty Username" message.
![Pasted Graphic 12.jpeg](Attachments/04076ACA-91E3-4875-AD53-A13F0E14477C.jpeg)
* After patching that out, it then showed up but didn't connect.
![• • Cornectina with Rulink's Swach](Attachments/83043C0E-05B2-412F-A986-C4DEFCA29122.jpeg)
* I didn't see any obvious errors happening, either.
![image.jpeg](Attachments/C3C78338-16C7-4314-9877-4F5EDF5B5898.jpeg)
### Why does MiiEdit Not Work
I don't know, but I also decided to mess around with Kinnay's LDN repo that day. I actually got a bit farther by doing this, as it has a few scripts to play with.
![<> Code](Attachments/87F6A0D8-9874-406D-98AE-BEAF628D6D2C.jpg)
After finding a spare Wi-Fi dongle and firing up a Linux VM, I ran the "scan.py" script that didn't require the LDN password which I'd have to go through finding.
![Leesd iomynicatien id: 020000001001092](Attachments/5BADF121-0CD3-4E7C-949D-ABF999CA2940.jpeg)
It shouldn't be surprising to see it show up, but it was still really gratifying to see some semblance of success. This script sees my Switch 2, and I can observe that... wait, what?
```
Station accept policy: NONE

```
Usually, the way this works is that someone hosts, and another person joins. Pretty straightforward. I could not join the hosted network, even if I had the right password.
![Participants:](Attachments/168BDAC4-12FF-4D42-8DA9-0AF2F283DEC7.jpeg)

Okay, so let's try running host.py. After finding the LDN password required for this, looky here! It actually shows up on the real console, as well.
![Search for Users to Connect With](Attachments/5C906EDB-E876-4028-8182-48AF492CBB8E.jpeg)
![Search for Users to Connect With](Attachments/57B43CED-D6DA-4BB0-AE97-681675D392C0.jpeg)
*(I have censored some immature comments that I should not have put there whoops)*

Now this begs the question, what happens if we connect? Do we see any- nope we just see nothing. Nothing happens. Nothing ever does.

Do you remember the screen from earlier that said:
```
Connecting...

Have the other user select (Name)'s Switch.

```
It kept showing this when I tapped on my PC. But it didn't seem to be connecting at all. Maybe it was waiting for the other to connect? They need to connect to each other?
Remember, the two stations were still set to "closed participation", and it wouldn't let me join at all. I tried seeing if this changed while it said "select the other console", but it did not. Always stayed like this.

At this point I decided to look back at Ryujinx, since it should give me a log of exactly what the applet is trying to do.
![50109122-286](Attachments/00B10EC6-DAF8-4C45-8CB8-350117E94FF8.jpg)
This is kind of unusual. Each console hosts its own network, sees another console’s network, chooses to connect to it instead. But I don’t get how it does that when it’s always closed- wait a minute, what’s this?
```
00:00:13.559 |T| HLE.OsThread.9 KernelIpc CallCmifMethod: ISystemLocalCommunicationService: **ConnectPrivate**

```
That’s right, this motherf\*cker keeps using these private APIs. What’s the difference between Connect and ConnectPrivate?

I don’t know, and that’s also the point at which I gave up.

### Umm... Using The 3DS?!?! 😹
We still haven’t addressed one of the biggest issues of what I’m trying to do: Connecting a PC directly to an unmodded console over Wi-Fi needs low-level access to the hardware, meaning Linux, meaning headaches.
This was supposed to be the method easily usable without hacking your console, but in order to get there, you have to hack your PC instead? Waste three afternoons doing most cursed back ass insane stuff with sudo and 30 Python scripts, and not only does it still not work but you’ve destroyed your Windows install in the process, right? This is not a good way to live your life. Even if there are many Steam Deck users out there.

What else can we do? There are a handful of methods that have come to my mind:
* USB dongle + Linux VM: needs admin access
* Specialized USB dongle
    * Microcontroller: Trickier.
    * “Bring your own Raspberry Pi Zero”: Cool, but may be more expensive and still a hassle.
* Rooted Android phone: uncommon
I thought of another method, which is my favorite. If we just need full control of a device that has Wi-Fi, what about… a hacked 3DS?
Think about it for a sec. If it is possible, it’s just a simple as running a homebrew app. Nothing extra to buy, nothing to bog down your PC. The best part is that pretty much every 3DS out there has homebrew, and if you’re a fan of Tomodachi Life then you probably have one.
(It can later support doing Mii transfers other 3DS/Wii U consoles or even Wiis, proving a very versatile tool!)

Is there going to be some limitation of the 3DS’s Wi-Fi hardware preventing it from doing this? Well… I hope not! By default LDN uses 2.4Ghz *(unless they change it, please don’t Nintendo)* and the hosted network actually supports 802.11b/g, the limit of the 3DS.
**todo image**

Alas, all of the above remains just ideas. is there going to be some other stupid random thing preventing one or all of those options from not working? Absolutely. At the very least, Kinnay’s Python code has to be refactored to C++, and I’ve seen pet projects die over less.

Still, the fact that nobody else has done anything like this with local Wi-Fi up to this point means that… it may just stay like that if I don’t do anything.

## Rendering the Dream?
Let’s talk about the game’s assets for a moment. Y’know, custom Mii rendering has been a bit popular lately. I wonder who started that trend.
Can we render all of the new features in this game? We absolutely can, now with the Mii data format being reversed a few days ago.

I will point out right now that the tools out there there for doing this (FFL and anything derived from it) will not do, or at least, will need dramatic modifications that aren’t worth making in the case of the FFL decomp.
Now, my new [Mii rendering solution with Fusion](https://ariankordi.net/posts/2026-mii-fusion/#done-rendering) would be perfect for this given its [modularity](https://ariankordi.net/posts/2026-mii-fusion/#fusion-for-mii-rendering), but of course, it’s not ready whatsoever. That’s not the end of the world because Mii rendering truly isn’t that complex and someone can paste a bunch of code from the decomp to make it work. It would work for a proof-of-concept but would be really difficult for anybody else to use.

Either way, again, it’s totally possible. If we’re talking about full accurate rendering without trying to reproduce the lighting style or physics, yes. If you put a Splattershot Pro to my head and asked me, I could maybe do it. 

### Ass Ets
**image: game assets**
The assets for this game are ACTUALLY in formats Nintendo is used before, compared to all other Mii assets.
For those who are unfamiliar, every single first-party game that ever used Miis prior uses the Face Library and its assets (“resouce”) shared across the system. For maximum standalone-ness, these resources archives are all in completely proprietary formats.
![TEFLRosMiddle_ texturel](Attachments/B865EE86-3B91-4A37-A6DD-5B623D98F2D4.jpeg)
Once you get past the surface, they are just standard shapes and textures. But don’t worry, instead of proprietary garbage, we have slightly less uncommon proprietary garbage! 😀

All of the models are in “bfres”, a file extension Nintendo has been using for 12 years now. This and the other “bf” formats are a part of [NintendoWare](https://nintendo-formats.com/formats.html#nw), and the library that handles models is called “G3d”.
For whatever reason this isn’t very common information, and as a result, half the results you see for “bfres” are either the original Wii U format or the completely incompatible Switch format. Cool, right?

Either way, wherever I end up doing the rendering (whether it’s raylib, Three.js…), I know what format I want.
All models should be converted to glTF 2.0 (“.glb”). This is a very widely supported and open format. We do not want FBX because it’s proprietary, and definitely not DAE or OBJ because they’re both outdated.

### The BFRES Odyssey
I have never been fond of the “tools” available for this format, or any other NintendoWare format for that matter. I’ll give you a little mental mapping here on how I’ve dismissed most of the options.
* Switch Toolbox, Track Studio
* 
* Anything involving Blender - I don't want to deal with Blender. I don't want to touch it, I don't want to think about it. I hate it. I've also heard that Blender has scripting so that we can avoid the GUI, but... no.
* Anything involving 3ds Max - Proprietary and considered useless to me, sorry. Although, there is an impressively compatible MaxScript extractor for BFRES: [RTB-3DSMax-Scripts/Scripts/NintendoWiiU-Switch_BFRES.ms](https://github.com/RandomTBush/RTB-3DSMax-Scripts/blob/main/Scripts/NintendoWiiU-Switch_BFRES.ms)
