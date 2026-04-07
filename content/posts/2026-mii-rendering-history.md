---
title: (WIP) How Mii rendering works/History of Mii Renderer REAL
date: 2026-02-22T04:00:00-04:00
draft: false
linkTitle: (WIP) Mii rendering history
---

**NOTE: THIS IS UNFINISHED!** I began writing this in February and just never finished. I may go back to it later, but if you're interested in this topic, here's what exists of this.

<!--more-->

---

There's this ["_Mii Renderer_" website](https://mii-unsecure.ariankordi.net/) I made a while back, and if you haven't already seen it, I recommend you do because it's kinda neat.

This website can replicate the exact same styles of Mii renders as the Wii U, Miitomo, and Switch. How does this work? How did I create a renderer server around it?

# Previous Attempts at Mii Rendering

Let's have a look at other attempts people have done over the years to render Mii characters, before getting into my approach.

## [My Avatar Editor](https://myavatareditor.blogspot.com/2008/07/my-avatar-editor-transitional-beta.html) (2009)

![myAvatarEditor_transitional.png](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-001.png "450px")

It doesn't look horrible, but also doesn't look the same. It's not in 3D, it doesn't move, there are no expressions.

![= File:Default Miis.jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-002.jpeg "400px")

This is also the source of the image used on Wikipedia, which everyone who isn't too familiar with Mii characters seem to use. Why do the arms look like that...?

## Joey Carlino Mii Maker for Blender FREE (Feb 2024)

- ![url.jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-003.jpeg "450px")

It's finally in 3D for a change, but, you can probably tell that it looks... wrong. The facial elements are all too close to each other, and the skin color doesn't look right either. In his video, he mentions eyeballing a lot of this. I guess that's admirable, but won't cut it for our purposes.

## iiMii Maker (Jun 2025)

- ![Head Features.jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-004.jpeg "450px")

LMAO, this may be the worst one yet.

I mean, Joey's is pretty inaccurate, but this one is VERY inaccurate. Why is the face so small?!

At least this isn't using Blender. It's in Unity, so it only requires... a few hundred MB. Jesus.

Neither of the above two projects support importing your own Mii data. WHY?! That's a death sentence if you ever hoped to do accurate rendering.

Not to mention that features have been removed, lol?

![Blushes have been heavily.jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-005.jpeg "300px")

## Chadsoft Mii Renderer (2017?)

This is used on the leaderboards of that Mario Kart Wii mod, CTGP Revolution. And it's... interesting.

![CTGP Revolution •.jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-006.jpeg "450px")

Like MAE, this isn't terrible but certainly doesn't look nearly as good as it does on the real console. Too dark, no reflections, that body model doesn't look right. This is also completely in 2D.

## [studio.mii.nintendo.com](http://studio.mii.nintendo.com) Rendering API (2018)

This is what the previous "Mii Renderer" tool from [pf2m.com/tools/mii](http://pf2m.com/tools/mii) uses, as well as Pretendo and some others.

![Please select a Mii..jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-007.jpeg "450px")

This is a service run by Nintendo that you can use to render your own Mii data as well as edit it on the editor. Because of that, the face looks pretty accurate. But why is it so... flat? Looks like Miis on the Switch.

It is, in fact, the style of rendering used in Miitomo.

![Miitomo..jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-008.jpeg "450px")

Previously, Nintendo actually used the Wii U rendering style for Miiverse and Nintendo Accounts until 2017. You can actually see this in screenshots of Super Mario Run, which came out in 2016.

![Toad Rally.avif](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-009.jpeg "300px")

_Source: <https://www.polygon.com/super-mario-run/2016/12/18/13971718/toad-rally-get-tickets-tips-tricks/>_

## My Attempt (as of Nov 2024)

Now, let's look at [mii-unsecure.ariankordi.net](http://mii-unsecure.ariankordi.net). I put three samples of the different styles I've reverse-engineered.

![Pasted Graphic 83.jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-010.jpeg "600px")

So that's Wii U, then Switch, then Miitomo. Nintendo's renders are on the right. As you can see, it's pretty much 100% exact.

You can try your own Miis if you don't believe me, either.

# How My Attempt is Different

The difference between my attempt and everyone else's (except Nintendo's) comes down to a few things.

- Wii U Cafe Face Library (FFL)

Actual decompiled Nintendo code is doing the heavy lifting of preparing the model. All of the decoding, positioning, shape/texture loading happens here.

- Shader Materials

This is the single biggest part visually. The only way to reproduce the lighting perfectly is by reversing the shader, which is the code that calculates lighting, and the material parameters that control reflectivity.

- Body Model & Scaling

A lot of licensed games with Miis show only the head, but the whole body is needed for accurate icons.

Additionally, the way Mii body models are scaled and shaped proportionally to their height/weight is very complex and took months to accurately replicate, which I was the first to do. If you aren't careful with this, you can stretch and distort the body model when resizing in one direction.

# Where my renderer began

## Abood's FFL Decompilation (11/2023)

The history of my renderer starts in 2023 with this guy named [Abood](https://github.com/aboood40091). There have been a handful of other limited attempts by me from ~2017 that never went anywhere and aren't worth mentioning, which shows you how long I've wanted this.

Abood does a bunch of reverse engineering and decompiling for New Super Mario Bros. U and the libraries it needs to work.

One of the pieces of code NSMBU and other Nintendo games need is called the _Face Library_. It's what Nintendo gives to developers so that they can render Miis in their game.

Not much has been (publicly) known about this library over the years. There are versions for the Wii (RFL), DS (NFL), 3DS (CFL), [Miitomo](https://en.wikipedia.org/wiki/Miitomo) ("AFL"), and the Switch. The Wii U version is FFL, where F is for Cafe (NintendoWare For Cafe/NW4F also uses "F")

Unlike any other reverse engineering efforts, when Abood decompiled FFL he actually tried to make it work on PC. To do this, he made his own game engine called "RIO" that lets you render on both Wii U and PC.

![23, 11:33 AM.jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-011.jpeg)

At the time, he was pushing these changes to a branch called "nsmbu-win-port", so he clearly had a big dream there.

## Testing FFL (04/2024)

I only came across Abood's FFL decomp months later in early 2024, and at first I didn't find it useful. The code was tough to navigate, and I barely knew what it did.

Later on I found out that he didn't just have FFL on his GitHub profile, but also a program called "FFL-Testing". It had no screenshots or build instructions, and didn't work for me the first couple of times.

But after many hours of trial and error, there it was.

![image-A5F33.jpeg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-012.jpeg)

When I saw this on my monitor, it seemed INSANE. A real Mii head model, appearing on MY PC via a decompilation - nothing fake here! This may not seem impressive now, but it was truly amazing after years of looking at Miis on 3DS/Wii U, only in 2D images on my PC and all of the fake Mii rendering attempts in between then and now.

Then, reality set in.

- All this does is display the heads of the Guest Miis
- Cycling through each Mii as the head model spins
- No body model, no lighting, no controls
- It also needed fixes to work on 64-bit Linux

This was far from the goal I had to be able to render Mii images on my own PC, rather than having to use a console or a Nintendo server for it.

**![Select a facial expression..jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-013.jpeg)**

_The 3DS/Wii U Mii Maker apps let you make the kinds of renders I wanted._

Even though the next steps seemed intimidating and out-of-reach, I tried to do what I could to make this usable anyway.

- Allowed loading custom Mii files instead of just guests.
- Experimented with custom colors (for future Switch rendering?...)
- Fixed more memory errors and bugs in the decomp.
- Ported the code to work on OpenGL 3.3 instead of 4.5 because my brand new mac Book Bro does not support anything higher than 4.1 what the flip man

![Screenshot_2024-04-27_at_7.12.19_PM.jpg.jpeg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-014.jpeg)

_Horrifying upside down face texture on OpenGL 3.3._

![image.png.jpeg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-015.jpeg)

_Non-guest Mii (Jasmine), with pretty colors, on Linux 64-bit! Abood only tested on Windows 32-bit._

I was even able to read the pixels of the rendered Mii into an image and get a glimpse of what it'd be like to get actual renders out of this thing.

Comparing with Miitomo, you can see the Mii's shapes and face are pretty much identical! Just that the lighting is off.

![Pasted Graphic 24.tiff](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-016.jpeg)

_FFL-Testing versus Miitomo head-only icon renders ([Braden](https://discord.com/channels/360173962862395392/378688267802902528/1247347372472926319))._

However, I could only get so far on my own.

## Abood gets us the Wii U shader (06/2024)

I actually posted what I'd been doing on Discord, the "ForTheUsers" guild that Abood posted his own updates to. I eventually got his attention with my experiments, and gladly he seemed eager to help!

![image.jpeg.jpeg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-017.jpeg)

It seemed that he could answer any question I could come up with. He helped me match the camera angle of the real icons (for comparing in the screenshots above) as well as explaining a lot about how this rendering works.

More importantly, he wanted to help me with the shader - that one missing piece that'd singlehandedly make the biggest difference to make this look like a real Mii model.

![Pasted Graphic.jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-018.jpeg)

_I briefly asked him about shaders [in April](https://discord.com/channels/339118412414582786/439903071447941120/1233919438839877683)._

Interestingly, he let me hop on a screen share call to watch him reverse this with Ghidra and RenderDoc for a WHILE - at least 5 hours straight. I didn't catch everything he was trying to do of course, but I was always intrigued. I ended up learning a lot about both tools from this session.

![Cur Output 0 - Texture 32.jpeg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-019.jpeg "450px")

![image.jpeg.jpeg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-020.jpeg "450px")

![image.png.jpeg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-021.jpeg "450px")

_Some half-working attempts._

But after a few more hours of trial and error, we were left with a fully working shader!

**TODO VIDEO: <https://x.com/aaaarrrriaaannn/status/1802137468277232103/video/1> - spinny mii with shader on windows!**

Now I had a basic understanding of all this. What did I learn?

- A shader is a program that runs on the GPU to achieve an infinite amount of lighting styles.
  - There's two kinds: vertex, and "fragment"/"pixel". The latter is the one calculating the lighting, as it runs for every pixel.
- Game consoles use compiled shader code, but PCs need the source code.
  - Abood reused a shader decompiler from an emulator to use for our own purposes.
- We can decompile all of the code, but it also needs the right inputs.
  - Shaders usually render some shapes with different reflectivity, so they have variables (called "uniforms").

With that out of the way, in the end the shader code itself wasn't actually the most important part. As a matter of fact, FFL-Testing already had the Wii U shader: [aboood40091/FFL-Testing@6daad53](https://github.com/aboood40091/FFL-Testing/commit/6daad53408d7b6a8e93b64bd0027cd7d2cf7d52b#diff-42a7d4aaf29c2c59bfa6978f5bd5682317e09800d4c8878e9c9a9946501eea11)

![image.jpeg.jpeg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-022.jpeg "450px")

The first version he uploaded used "FFLShader.gsh", which looked like... that. It got changed to a ["much more simplified shader"](https://github.com/aboood40091/FFL-Testing/commit/0219f6fc86b4a5486fa869dda3a592fee9857fe2#diff-2171bccc197ef6f3cb8e8b57814c9d27d062648bcc873f1a5793909a8f3548fe) that was completely flat. But if this older one really is the Wii U shader, then why does it look like that?

**TODO screenshot: <https://github.com/aboood40091/FFL-Testing/commit/0219f6fc86b4a5486fa869dda3a592fee9857fe2#diff-42a7d4aaf29c2c59bfa6978f5bd5682317e09800d4c8878e9c9a9946501eea11> - just a visual of "uniforms", could be source or could be renderdoc**

These variables/"uniforms" are key to making the parts NOT all look flat/same-y. Abood extracted this table full of "material" parameters for each shape to use - face, beard, nose, hair, etc.

![Pasted Graphic.jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-023.jpeg "400px")

_Screenshot of [the material tables](https://github.com/aboood40091/FFL-Testing/commit/9cb248741e2c80159d0ce18afcb4f786a88df6f7#diff-b4230b81837a284e1f44bc4baa92853a7df306218f3375b9599110220c308412R138-R213) - pretty much just numbers and colors for each shape type._

For the most part, that was it. Decompile the shader, find the material tables, and that's how we got our result - plus other steps, of course (like fixing the face texture).

Decompiling the tables from the code is a pretty straightforward task with Ghidra, though at first we had some trouble with this one called "light direction".

**TODO screenshot: <https://discord.com/channels/360173962862395392/378688267802902528/1251380092769144852> - get default vs correct light direction**

Abood noticed that there was no default value for "light direction", and it was instead calculated. I looked into this, because I remember other games using the Wii U shader.

![lebron james reportedly used the default light direction in the.jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-024.jpeg)

![ww.jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-025.jpeg)

![Pasted Graphic 3.jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-026.jpeg)

You can see in the screenshots above that it looks similar to our attempt - it's definitely the Wii U shader as you can tell from the hair, but the face lighting looks off.

All of these titles ([Taiko Wii U](https://discord.com/channels/360173962862395392/378688267802902528/1257180717515935814), [Lucadian Chronicles](https://discord.com/channels/360173962862395392/378688267802902528/1251380092769144852), [FFLUtility](https://www.youtube.com/watch?v=pENlIR20c2I)) use this class called "FFLDefaultShader" (didn't get decompiled). It uses a light direction of (0, 1, 0), so that's why it looks that way.

## Replacing the Old Renderer + Fake Body Models (06/2024)

Having real Mii rendering with the real Wii U shader was absolutely amazing, and a sign that things were heading in the right direction. Like wow, this could actually be useful!

I tried putting this to use right away, but to tell you how I need to tell you about my _other_ attempt at accurate Mii rendering.

**![01.jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-027.jpeg)**

_Old [mii-unsecure.ariankordi,net](https://web.archive.org/web/20240401220503/https://mii-unsecure.ariankordi.net/) with old renders._

My "Mii Renderer (REAL!!!!!!!)" site was published in April 2024, but this Wii U shader happened in June. What was I using before then? Why is the render bright and... fat? This is the answer:

![image-AF0EF.png](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-028.png)

This is a really hacky way to render Miis that I actually got working all the way back in January 2024 with many layers of nonsense.

- It's running the "Nintendo Web Framework" in a Wii U emulator.
- NWF let you make JavaScript games that ran on the Wii U.
- There was a "private Mii plugin" for NWF that let you make Mii icons.
- The game would receive the Mii data via a fake amiibo that the server scans.
- The render appears on screen, a screenshot is taken, and the greenscreen is stripped out (badly).
- You usually get a response in 1-3 full seconds.

This was slow, Cemu made it very unreliable, and it wasn't even fully accurate. There's at least 4 issues you can see in this render:

![you g'ys want to know something about mii-unsecure.ariankordi.net that.jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-029.jpeg)

_The "Bedblom" NNID I often [used for testing.](https://discord.com/channels/360173962862395392/485919503369371648/1227333178663108639)_

It was fun to develop this and get a first glimpse of locally rendered Miis, but it obviously needed to go. That's all I will explain about this (you can [read the old repo](https://github.com/ariankordi/nwf-mii-cemu-toy/blob/master/README.md) for more info), but I was playing with FFL-Testing with the goal of replacing this solution.

The glaring issue with FFL rendering at this point was that there was no body model. All Wii U-era Mii renders you saw from Miiverse and Mii Maker had it, so it was definitely needed. But, one major problem: The Face Library does not handle body models.

If you pay attention to Mii support in each game, this may actually make sense. Usually Mii heads are slapped on top of custom body models that are always different across non-Nintendo titles.

**![wii fit u? uhhhhh nahhhhhh... not even sure if they get significantly shorter or taller.jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-030.jpeg)**

You may even see a lot of games show icons of the bare Mii head without the body at all, common in many Wii games. Indeed, there is a "MakeIcon" function that does this ([RFLMakeIcon](https://github.com/SMGCommunity/Petari/blob/master/src/RVLFaceLib/RFL_Icon.c#L20-L153), which is basically same in CFL/FFL/nn::mii).

What does that NWF plugin above do to render a body model? I've noticed a mysterious "FFLBodyRes.dat" file in it as well as Splatoon, Super Mario Maker, Mario Kart 8, and amiibo Settings. Luckily, MK8 (kiosk)'s debug symbols reveal it's actually a class called "FFLIconWithBody".

![Pasted Graphic 27.jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-031.jpeg)

Across all of these games, the Mii renders look the same as NWF - the body is always the same size with no scaling, and it looks a little brighter than it's supposed to. You can check amiibo Settings yourself and see.

I'll get back to this in a moment, but for now I needed a quick-and-dirty way to show the body model, so I extracted it as a static image from the NWF renders and just used it.

**![today i wanted to try to grind out making FFL.-Testing into a.jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-032.jpeg)**

_Concept of [the](https://discord.com/channels/@me/689624598651994208/1251919189032046745) "fake body model image to replace the old Cemu method"._

**<https://discord.com/channels/@me/689624598651994208/1252303716854272171> - it working**

After this and more banging my head against the wall trying to [make a server out of this](https://github.com/ariankordi/FFL-Testing/commit/fccd87dc4ae8cd24e46943b8abe97a6b85833319#diff-f907110c7897f799d25ab728d25d9131b207d7aa1f70121537fc399288264fd1), you can see it ended up working, and I could finally replace my stupid Cemu solution with something that was slightly less dumb. Hooray!

Later on I revisited that "FFLBodyRes.dat" file, and saw that it's literally the same FFL resource format but with 2 shapes instead of 857. I could view the male/female body models in Blender.

![Modeling Sculpting UV Editing.jpeg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-033.jpeg "450px")

After a little bit of porting, I was able to render this model instead of using static images which helped when I added more shaders later on.

The body model is still not a solved problem though, as I now needed it to scale to the proper height/weight. I couldn't even do whole body renders until then, because they just look lanky with this model:

**![image-4E94F.png](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-034.png)**

## Switch Shader (07/2024)

I was at a point where my site is functional, runs locally, could use more work in some areas.. but overall going pretty well.

Since one of my goals was to replace [studio.mii.nintendo.com](http://studio.mii.nintendo.com)'s renderer, it sounded like a good idea to replicate its shader in case anyone was attached to it. Until May, I thought this was the "Switch Shader", until realizing that it wasn't:

![24, 6:33 PM.jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-035.jpeg "450px")

_"Switch" and "Mii Studio" shaders are definitely [not the same](https://discord.com/channels/360173962862395392/378688267802902528/1241881565097754624)!_

The Miitomo/"Mii Studio" shader would have made the most sense to add, but I couldn't really reverse engineer that at the moment. Kaerutomo, the Miitomo revival, was down for months at this point. Funnily enough, it's down as of writing years later too.

So that ended up getting skipped, and I looked towards the next best thing, the shader used on the actual Switch. I used what I learned from Abood: Decompile the shader and match the uniforms. I took on this challenge in mid-July and it actually took just a few days to have a working result.

![image-8445F.png](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-036.png)

![image-B92F1.png](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-037.png)

This was actually before I rendered the body model as a real model instead of an image, so you can see how awkward this was:

![image-04354.png](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-038.png)

There are a few things that make this shader bizarre compared to any other Mii shader. Third one is the most problematic, but all of them are annoying.

- Glasses mesh has different normals (from Switch resource)
- Faceline (skin) texture is expected to be transparent
- The material uniforms vary for each color and shape, instead of just shape...

First one is annoying but workable, and so is the second one but the transparent skin texture is to be applied only for the Switch shader.

If you don't apply it, it's too dark. If you apply it to the other shaders, then... the face will simply be transparent, as you requested.

![image-CE749.png](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-039.png "450px")

But the third problem with the material tables is the real kicker. Remember that short table of uniforms for each shape, which basically changed their reflectivity, that the Wii U shader needed?

The Switch shader has these too, but they are HUGE.

**TODO IMAGE: show in either ghidra or <https://github.com/ariankordi/FFL-Testing/blob/9b08b6694b748456c2e565e952e67963ad63c478/src/ShaderSwitch.cpp#L116-L397>**

I was now able to extract these by myself in Ghidra thanks to learning from Abood, but boy it was not fun. It took hours, and I'm left with hundreds of lines of this stuff. Furthermore:

- You can ONLY use colors defined in this table - otherwise, it looks totally off.
- The "shader" needs to know what color ID you are using, not the color VALUE.
  - This can make the code more of a mess than it needs to be, as it needs access to the Mii data.
  - I actually had the Switch shader in a separate branch for a while because of this (along with the fake body image), as I had to rewrite it all in a way that didn't suck.

I kept staring at these numbers for a while, wondering if there was any rhyme or reason. Could this be algebraically "solved"/calculated at runtime? I never got anywhere with this. Unfortunately, they may just be handpicked - take a look at this:

**![Studio.tiff](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-040.jpeg)**

_[Comparison](https://discord.com/channels/778776082223726593/785756791354032131/1263536406878359605) between the three shaders. Picture if the background were fully white._

If you render white hair with the Wii U shader, you can see that it's totally blown out since it was never meant for it. The Miitomo shader does better, but still doesn't look as good as the Switch shader for this.

## UNFINISHED: The Body Scaling Saga (move this section) (12/2024)

As I kept developing my renderer to have more features and be more accurate, for the longest time this issue loomed over me: How can we make the body model adjust to the Mii's height and weight? **tbd improve that**

![0.tiff](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-041.jpeg)

_Comparing improper stretchy body scaling with accurate per-bone body scaling._

When it came to getting to a point where I could call this "complete", to be just accurate with Mii Maker/NNID icons, this was the biggest nuisance for half a year there. My render on the right looks so cheesy, and it was going to stay like this until I could figure it out alone. No help from anybody else, because simply nobody had gone this far with this much actual reversing.

One of the reasons this was so difficult for me to go through is that the Mii editor is pretty much the only title that scales the Mii model properly and makes it look the way it should in the icons I want.

However, there is no debug info or symbols whatsoever for any editor. Up to this point I had been reverse engineering FFL from games that included debug symbols, and now I had to work without any nice naming. Argh. How was I ever going to figure this out? I'm a noob, I don't know what I'm doing!  
<br/>Thankfully, Nintendo in 2015/2016 (whenever they made this feature) had me covered. There had been [leaked prerelease OS versions](https://discord.com/channels/370011926823960576/374765704877965312/1092276738886746183) with more debug info, and I found something interesting in the MiiEdit and amiibo Settings applets: "_VariableIconBody_".

If you remember "FFLIconWithBody" from earlier, this is the next version of it. It's used for Mii icons that seem to have ACTUAL proper body scaling?! Compare top = Mii Maker, bottom = amiibo Settings, Switch vs Wii U.

**![Pasted Graphic 31.tiff](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-042.jpeg)**

**![Pasted Graphic 29.tiff](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-043.jpeg)**

You can see that while on the Wii U amiibo Settings uses the exact same body size for all Miis, on the Switch it actually has the same body! And the icon is still slightly different, proving that amiibo Settings is in fact doing its own icon rendering for this screen.

![Pasted Graphic 33.jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-044.jpeg "350px")

When I first found these strings, I was of course intrigued but also a little intimidated when I saw language around "skeletons" and "skinning".

Sigh... it wasn't exactly surprising that it involves all of that, but I had little to no knowledge about skeletal animation. Even worse, RIO didn't support it (in a usable way, at least) which I already knew from looking into adding pose support.

Moving along, I threw the "VariableIconBodyImpl" into Ghidra and saw that the process had a few steps. Over the next few months I basically tried to use these individual pieces, thinking that I knew the whole picture when I didn't and beginning a long series of trial-and-error frustration.

## gag reel of bad body scaling attempts

## ![image.jpeg.jpeg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-045.jpeg "400px")

## [Thanksgiving Turkey](https://discord.com/channels/360173962862395392/378688267802902528/1290327929607163914)

![Ozz-animation sample: Skinning.jpeg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-046.jpeg "400px")

[Stick bug headass?](https://discord.com/channels/@me/814599982841724938/1323293386148675655)

![image.jpeg.jpeg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-047.jpeg "400px")

[Pinnochio lookin ahh?](https://discord.com/channels/@me/814599982841724938/1321290154354278481)

![0. 0. 8..jpeg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-048.jpeg "400px")

<https://discord.com/channels/@me/814599982841724938/1321288640135037001>

The screenshots above are me trying to achieve body scaling using ozz-animation, a skeletal animation framework. This is relevant to why these attempts never worked, let's come back to this.

It took me until Christmas to say that enough is enough, playtime is over. Over the next few days, I tried to decompile as closely as I could, and do manual skinning using the exact original model data.

**todo image? or video: [https://discord.com/channels/360173962862395392/378688267802902528/132303894665717768 2](https://discord.com/channels/360173962862395392/378688267802902528/1323038946657177682) - variableiconbody loader raylib**

In the end, I finally had a working result for the first time. This brought me back to when I first saw a Mii head on my desktop, I had the same giddy feeling seeing this work too.

**todo: how does this work (my explanation)**

But after all the fanfare of finally reversing this, it was time to add this to the server, right? Weeell…

I made both examples completely separately from the server, because this was hitting the limits of what RIO could do. It didn't reeallyy support skeletal animation (at least in a way I could use), and I was reluctant about implementing it myself, sounds complicated.

This was an issue I looked at previously when thinking about adding poses, but this time I couldn't avoid it.

## Miitomo(?) Shader(s?) (08/2024)

The last of the three major shaders, the Miitomo shader was the most elusive since the revival was down for a long time.

Even before it went back up, there's a lot I tried because Miitomo has some… interesting artifacts.

To start with, the game is using a library called "AFL" for Mii rendering, as well as an "AFLResHigh.dat" resource file that has the same header as FFLResHigh.dat. I even had a look at the names of AFL functions that were exposed.

![here's the symbols if you want to drool at them for yourself.jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-049.jpeg "400px")

_AFL function names I [stumbled upon](https://discord.com/channels/@me/375040634785890304/520018154395795457) a long while back._

Looking back after now knowing the ins and outs of FFL, it's very obvious what was going on here.

**![FFLResHigh.tiff](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-050.jpeg)**

_Tell me why_ **_FFLResHigh.dat_** _and_ **_AFLResHigh.dat_** _look very similar..._

![Pasted Graphic 12.jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-051.jpeg)

_Yup, a bunch of functions were copied. This only shows public_ **_extern "C"_** _symbols, but trust me, many mangled C++ symbols are shared too._

Opening Miitomo's code in Ghidra confirmed it as well. This is some weird port of FFL for mobile.

AFL uses OpenGL ES 2.0 instead of talking to the Wii U GPU, has some extra features for Miitomo (new expressions), and most bizarrely, it also contains sources from the Switch version of the Face Library (nn::mii) for handling the new Switch Mii format in version 2.3.0.

OK, so where does this freak of an app put its shaders? The _shaders_ folder, of course. Right?

**![• crashlytics-build.jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-052.jpeg)**

We can see a helpfully labeled "Mii" shader, along with other ones that I'm sure are unrelated. Right.

For a while here I was actually dumbfounded as to why this shader wasn't looking the way I expected. Kept looking like a broken version of the Wii U shader.

![24, 3:42 AM.jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-053.jpeg)

Guess what, that's exactly what it is.

![Pasted Graphic 15.jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-054.jpeg "450px")

The clues should've been obvious - there are definitions at the top mentioning "FFL", the uniform names are identical, and it's called "MiiDefaultShader" versus "FFLDefaultShader".

I even went through decompiling an "AFLiDefaultShader" class and its structures/tables to find that they were the same as what Abood extracted from Mii Maker. I actually had to do a double take and redo everything to confirm this.

![Pasted Graphic 16.jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-055.jpeg "450px")

_I uh... forgot I tried to reverse this before Abood did._

But I ignored every single clue until months later after reversing the real Miitomo shader, when I actually [got the MiiDefaultShader to produce the exact same result as the decompiled FFL shader](https://github.com/ariankordi/FFL-Testing/commit/cbf20074150ff7103ecd2f2857f3eb37380fb24e). There were a few tweaks that I had to undo, but at first one of the major differences was this.

**image: ffl shader with and without rim lighting**

Do you see it? In case you don't, look at the edges. The Miitomo version doesn't have rim lighting. If I'm not wrong, this is the same as what was seen in early Wii U screenshots.

**image: have to find that image of wii u mii maker with no rim lighting**

Odd, isn't it? Now, there's a (minified) version of the shader inside the binary itself that does have this, so at some point they stopped using this external file. I used that to add back to my version.

There's one more leftover that's commented out here- I have no idea where, why, or when this was added, but it has to do with toon/cel shading.

(Sorry, I'm too lazy to actually apply this for you.)

Moving on, I'll come back to the Wii U shader, but I needed to find the actual one that was in use.

Even though I couldn't run Miitomo my device, I know many people had RenderDoc capture files I could use to debug the rendering process.

My friend Timmi (**todo add a link to his Twitter or something**) gave me some of these, and.. I kept being in denial every time I looked at which shader was being used. I kept looking for evidence that the MiiDefaultShader was the news, and didn't find it. Instead, I saw this "LUT" shader.

**TODO: portray lut shader - file? renderdoc? uniforms?**

At first I groaned since it seemed more complex, but it's actually not too bad to understand.

- Instead of using a bunch of numerical uniforms, it used this 1D texture that looked like a gradient.
- This texture, the _look-up table_ or LUT differed for each shape.
  - I could simply save each texture, and plug it back in.
- Some uniforms did differ, but what was most jarring is that it also seemed to modify the source code for certain options instead of using a uniform?????
  - By enabling/disabling # define statements - so not literally changing the source code, but that's effectively what it did.
  - I can't go into exactly why, especially since I don't fully know, but it seems like some GPUs may have struggled with if statements. Go figure.

So I work all of this out like last few times [throughout August](https://github.com/ariankordi/FFL-Testing/commit/429d8c946cabf5366a6c47802a6504ec327d50ba), and here it is! But uh… why isn't it pixel perfect like the Wii U shader was?

**TODO: real miitomo icon vs. no color multiplication, ffl glasses size, maybe a difference with filtering**

Here's where Miitomo's tomfoolery strikes again, and these weren't minor…

- In Miitomo some colors are a bit darker, because they get multiplied by ~0.9 in this function
  - (**TODO: FUN\_\*\*\*\*\*, potentially post image?, Consider images for other bullet points as well???)**
- At some point, they messed up the function that calculates glasses size so they're all slightly larger.
  - **TODO: link to lines <https://github.com/ariankordi/ffl/commit/97eecdf3688f92c4c95cecf5d6ab3e84c0ee42c0>**
  - This is very obvious to tell in Mii Studio as well, proving its lineage to Miitomo.
- You can see the face texture from behind the head, only in Miitomo/Mii Studio. I don't know why, but this wasn't a cute minor change to make.
  - **TODO: needs its own image with the fuckyou mii**

The latter two are annoying to account for, and you'll keep seeing this theme come up where Miitomo makes awkward changes that have to be accounted for with ugly solutions.

Let's go back and answer the question of why the Wii U shader, in all its glory, has been sitting there dormant all this time in Miitomo.

I'll first give a cheap answer and say that it actually IS used when drawing 2D facial textures, which… lowkey seems like a waste of resources when they could've simply used the other one.

**TODO IMAGE: MiiDefaultShader used for mask rendering revealed in Miitomo**

But the real answer is that it DID 100% use that Wii U shader at some point in development.

[TODO IMAGE OR EMBED: https://x.com/Nintendo/status/609514061475115008 - iwata](https://x.com/Nintendo/status/609514061475115008?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E609514061475115008%7Ctwgr%5E2a13ce41342d68a5b9493dec2ed0b505c0822a8d%7Ctwcon%5Es1_&ref_url=https%3A%2F%2Fmynintendonews.com%2F2015%2F06%2F13%2Fiwata-updated-his-mii-to-reflect-weight-loss-after-health-issues%2F)

Come on, what else could this possibly be? Post from 2015, showing Miitomo body shape with clothing, and you see the shiny hair right there. I'm disappointed that this is all we get, but it is at least an answer. It is also surprising that they basically leaked their own game, don't you think?

I have one more reference to show you: [Cocos2d-xチューニング、マルチデバイス対応…任天堂エンジニアに聞いた「Miitomo」開発の裏側(CodeIQ MAGAZINE) - goo ニュース](https://web.archive.org/web/20210414031214/https://news.goo.ne.jp/article/codeiq/trend/codeiq-52755.html)

It's a neat little interview with the Miitomo developers (in Japanese, of course). It's full of vague non-specific references that are typical of other Nintendo interviews, but here they discussed "tun ing Shader".

![How to balance high-quality graphics and speed.png](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-056.png)

I could talk for a while about Miitomo's development process for a while. One of the weird things to me is that while it began in 2014, the up and coming "NX" console got a totally refactored version of FFL (which I believe was made in late 2015?) with new features that they had to rush to add to their custom AFL version in 2017.

Why didn't they work together? Were they even allowed to know about the NX? Is this one of the reasons why the Nintendo Switch avatar is separate from the My Nintendo Mii avatar on the same account, a piece of tech debt that Nintendo always seemed to neglect?

## UNFINISHED: More Miitomo!!!: Resource, Expressions (09/2024)

Unfortunately, I'm not done with Miitomo yet. We saw the brand new shader along with the brand old shader, but I kept wondering about other pieces.

The biggest one I was interested in by far was that "AFLResHigh" resource. Could we read it? Is it higher quality? Extra content?

Let me elaborate that the resource file contains all the assets for rendering Mii heads - all of those shapes and textures.

The resource is the only file you need for rendering, but you had to get it from a real console. Since Miitomo was a mobile app, its resource was downloadable directly from archive.org. Wouldn't it be awesome to run a script that automatically retrieve these, making setup much easier?

![Pasted Graphic 19.jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-057.jpeg)

There are actually two of these: AFLResHigh.dat and AFLResHigh_2_3.dat, the latter being for the 2.3.0 update, where they added Mii features from the Switch.

Since the header looks pretty similar to the FFL version, it will actually load and get pretty far but then it will crash. The reason comes down to the changes, and then lackthereof.

- The major change is that they added more parts. This is a problem.
  - Specifically for expressions: 18 new eyes, 4 new eyebrows, 15 new mouths
  - (Shapes are completely unchanged, contrary to the [mii-assets README](https://github.com/jaames/mii-assets/blob/c2811a81cad8be5330d8153ef3fc5b51e651e9e2/README.md?plain=1#L34-L36).)
- There's only a fixed amount of "slots" for all parts, and the file doesn't have any boundary for where a category starts and ends - that is hardcoded in the code.
  - slot 196 in FFL & AFL = eye 61 (max)
  - slot 197 in AFL = eye 62
  - slot 197 in FFL = eyebrow 1
- The AFL resource has barely any changes whatsoever in the header.
  - They didn't change the identifier (FFRA), version, or any other fields.
  - (Thankfully one number is different which I'll get into later, but it wasn't intentional.)

So it's completely incompatible in a way that will be annoying to work around, while at the same time there is barely any indication of this. Great, right?

Surprisingly enough, if I simply adjust the array to account for the amount of AFL parts, it… actually WORKS?!

![image.png](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-058.png "550px")

_Me trying this [on Aug. 22](https://discord.com/channels/360173962862395392/378688267802902528/1276173400032677919)._

Shapes are rendered perfectly, there seems to be zero difference between FFLResHigh and AFLResHigh/2_3 shapes. But… what's going on with those glasses? To explain, let me bring something else up.

Before Abood's decomp, there was this other project from 2018 called "mii-assets" that aimed to extract the FFL and AFL resources. Below is what you'll see if if you extract AFL and FFL respectively.

![Pasted Graphic 20.jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-059.jpeg)

Notice that the AFL textures look fine, where the FFL textures are messed up. What's happening here is that the FFL textures [have their pixels rearranged for performance](https://en.wikipedia.org/wiki/Z-order_curve#Texture_mapping), which is actually very common when [extracting any texture from a game console](https://github.com/AssetRipper/AssetRipper/issues/629). It's also known as "swizzling", and every modern GPU is invisibly rearranging your textures to look like this in memory.

![212212.jpeg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-060.jpeg)

_This is completely unrelated to textures or the Wii U's specific tiling, but it's the same idea. Source:_ [Apache Hudi™ Z-Order and Hilbert Space Filling Curves](https://www.onehouse.ai/blog/apachehudi-z-order-and-hilbert-space-filling-curves)

The FFL textures are swizzled (which CFL and nn::mii do too), but the AFL textures are in a linear order. In the decomp, Abood added code that deswizzles textures to properly display on PC.

Mystery solved, right? But, uh… if the code is incorrectly deswizzling all textures when they're already linear, why does everything look correct except for the glasses? This is what I found out about something that made me really upset.

You see, in AFL they unswizzled the textures but kept the MIPMAPS still swizzled. Mipmaps are tinier versions of the image embedded in the texture data, so that the GPU doesn't have to do hard work shrinking them manually.

![Pasted Graphic 21.jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-061.jpeg "500px")

_[Argh](https://discord.com/channels/360173962862395392/378688267802902528/1276173530844893244)._

Notice how the last screenshot had blurry eyes, because I specifically made it low quality which in turn forces mipmaps. But here, I'm doing the opposite:

![24, 9:51 AM.jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-062.jpeg "500px")

By the way, I found out that AFL doesn't use these mipmaps at all. Fantastic. So it doesn't tell me the layout is different, AND that the textures say they have mipmaps when they are unusable.

**TODO IMAGE: proof of this in ghidra or something**? if there is any

I gritted my teeth and patched FFL to support this anyway, but I was at a crossroads for a long time trying to figure out how to possibly get these changes in and functional when I didn't have an obvious way to detect. Like, you specifically added a version field and didn't use it?!

But there was one field that differed, called **ExpandedBufferSize**. It actually differs for every version of the FFL resource file (Middle, High, LG/linear gamma), because it's basically the size of every part uncompressed.

**TODO IMAGE: compare the values for each resource in kaitai view?????**

Real quick, this is used in a function called "FFLExpandResourceBuffer" that copies and decompresses the resource file into a buffer which you can use instead of the original for less CPU usage. This is also what the "IsExpand" flag is for. It may have been added because the WaraWara Plaza uses it, because only FFL (not AFL or nn::mii) has this feature, but I can't say for sure.

What we can do is compare the value against the ones known in AFLResHigh.dat/AFLResHigh_2_3.dat, and assume everything else is a normal FFL resource. This DID work, but [modifying FFL to use qny of the three formats](https://github.com/ariankordi/ffl/commit/d740192adb655a1a3d6e2bcae0feda5ea8fd25fc) was a total pain that took me nearly a whole month of contemplating how this would work and failed attempts.

**TODO maybe show this: <https://discord.com/channels/360173962862395392/378688267802902528/1279134595631288371>**

But in the end, we have the existing FFL formats working alongside the Miitomo one you can get from [archive.org](http://archive.org). Awesome.

I also modified FFLResource.py, a script Abood made to unpack/repack resources (which is better than mii-assets) to be able to also unpack/repack the Miitomo versions. This may allow for more Miitomo modding fun, such as hacking in lower quality (so retro!) assets.

![25, 12:20 PM.jpg](/uploads/How-Mii-rendering-works-%2B-rewriting-the-server-2509-attachment-063.jpeg)

_"3DS shapes" mod I published on ["Random Miitomo Modders" Discord](https://discord.com/channels/1335744218399768680/1336748107727110294/1336748311784194260) by picelboi._

Now that we have the Miitomo resource, we can see the 2x higher resolution textures which is nice (shapes are same). But another thing we notice are these extra parts, like I mentioned before.

**TODO IMAGE: screenshot of only the new parts**

These extra parts are for the 51 new expressions added in Miitomo - some are selectable via the Miifoto screen, others aren't.

**TODO IMAGE: the various screenshots i already took of the expressions**
