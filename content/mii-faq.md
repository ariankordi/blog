---
title: Frequently Asked Questions - Mii Renderer (REAL)
date: 2026-04-28T00:00:00-04:00
sitemap:
  disable: true
robots: noindex
---

It only took two years, huh? If you want a question featured here, simply ask me frequently.

* [Model Export](#model-export)
* [Mii Data](#mii-data)
* [Meta](#meta)
* [Development](#development)

# Model Export

### How do I convert? How do I get a 3D model file?

_First_, obtain a render. _Second_, click this "convert" dropdown. _Finally_, there's a download button for the model export tucked into there.

![](/uploads/20260428-222817.png "450px")

Additionally, the conversion options are available:

* Studio Code: For the Nintendo Account Mii editor, aka "Mii Studio". See the browser extension linked.
  - mnms: Also for the browser extension linked.
* charinfo: Nintendo Switch Mii data format. Importable into some other programs.
* ffsd: 3DS/Wii U Mii data format. This is usually the most compatible.

Sorry, there's no option for Wii format (rcd, rsd, mii, miigx, mae).

### I opened the model in Blender and it's all gray, there's no face.

Are you seeing this? This is because Blender doesn't show textures by default.

![](/uploads/20260428-223017.png "500px")

At the top right corner of your screen, press the third circle. This will display the face.

![](/uploads/20260428-223138.png "300px")

## The 3D model has no body, can you add it?

My answer is complicated and comes down to: tech debt, laziness, lack of motivation… you know, that good stuff. I _want_ to add it, but it won't work with the current solution.

### What about body poses?

Same answer as above. I pretty much lost motivation after mii.nxw.pw added them, so get your sh❤️tty pose PFPs there.

# Mii Data

### How do I edit my Mii? Where do I get data from?

If you're asking this question, this isn't the site you're looking for. Sorry.

For creating and editing Miis without a console, here are your options:

* Nintendo Account ["Mii Studio" web editor](https://accounts.nintendo.com/mii_studio)
* [mii.nxw.pw](https://mii.nxw.pw) - Requires joining [this Discord](https://discord.gg/miicreator).
* [Pretendo Mii Editor](https://pretendo.network/account/miieditor) - Requires creating an account.
    - After updating it, click the _"force refresh"_ option in order to show the latest update.
<!--
* 3DS emulator (wait no the qr codes don't work), Cemu (oh wait it errors out)
* My Avatar Editor (Wii features only)
-->
<!--
    - I have an old unofficial rehost you can [use here](https://mii-unsecure.ariankordi.net/assets/mii-creator/index.html).
-->

## My QR Code isn't working.

**Does it work on a real console?**
- Usually, codes created by emulators are invalid.
- If you're using mii.nxw.pw, try disabling gold pants (it won't show here anyway).

**Sometimes submitting a picture file doesn't work if it's too detailed.**
- This is due to the [moiré pattern](https://en.wikipedia.org/wiki/Moiré_pattern).
- Try scanning with a camera. 

This is just my most common advice, but please [feel free to email me]({{< relref "about/" >}}) (even if you're shy or think it's a dumb question), I'll help you deduce the problem or decode from an emulator or console.

# Meta

## Why is your site called "mii-unsecure"? Is it really safe?

Don't you love a good inside joke that only like 5 people will ever get?

It's a play on how Miiverse's Mii icons were served from a domain called `mii-secure.cdn.nintendo.net`. Duplicating those icons is actually one of the main reasons I created this.

I've planned on buying a new domain, but I kinda sorta only want to do it when I give this site a huge epic upgrade or something.

I can't tell you if it's secure or not, I can't exactly protect your family or secure a loan or anything like that.

## Is your rendering fully accurate?

Mostly yes, but:

* Miitomo body is slightly off and has inaccurate scaling
* There are a few parameters from the official Nintendo Account API [not fully implemented](https://github.com/ariankordi/nwf-mii-cemu-toy/blob/ffl-renderer-proto-integrate/views/index-accuracy-section.html)

# Development

## I want to use this for my app or website, do you have any advice?

1. Make sure your thing works even if my website is down, which happens sometimes.
2. Don't hardcode my URL, put it in a configuration so it can be easily changed.
3. I highly recommend [self-hosting](https://github.com/ariankordi/FFL-Testing).
4. Feel free to use all of the options you want, but _higher quality usually means slower and heavier_.

## I'm a developer, do you have anything cool for me?

* [FFL.js](https://github.com/ariankordi/FFL.js): Accurate Mii rendering from JS with shaders and body scaling.
* [ffl-raylib-samples](https://github.com/ariankordi/ffl-raylib-samples): Showing how to render Miis in an easy C game engine.
* [FFL-Testing](https://github.com/ariankordi/FFL-Testing): Source of the current server. See if you can reuse parts, or something.
* [My JSFiddles](https://github.com/ariankordi/my-jsfiddles): JavaScript tools for QR codes, parsing, rendering, and more.

I unfortunately don't have anything to offer other than this, but I'm always working on stuff that will make Mii parsing and rendering easier. Read [this blog post]({{< relref "posts/2026-mii-fusion" >}}) for my plans on making a library, as well as [my plans for a modular renderer]({{< relref "posts/2026-mii-status-backend" >}}).

## Are you going to add anything?

I expected myself to be [done with the current design]({{< relref "posts/2026-mii-status-frontend" >}}) you see months and months ago, but alas, I never got around to it especially with the full-time job that I have.

Nowadays (mid-2026) I'm still dedicated to Mii reversing and custom tools, but it'll be a while before I get to work on anything "user-facing" again because there's so much that's piled up on me. Also, keep in mind that this originally replaced [an older "Mii Renderer" site that constantly went down](https://pf2m.com/tools/mii) which this replaced after 4 years.

However, I've planned for more than a year to fully replace the "renderer" with sets of versatile Mii tools, including a nice editor. They're just plans, though. If you're reading this far, though, check out [the post I wrote about it]({{< relref "posts/2026-mii-status-frontend" >}}).


## Why did it take you two years to add this basic FAQ?

SHUTUPSHTUSPSHTSUPSSHUTHSPHSUTHUPSHUYSHUPTHUSPOHTUPSTHUPSUP
