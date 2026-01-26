---
title: Jan. 2026 status on my Mii projects
date: 2026-01-09T00:00:00-05:00
draft: true
linkTitle: Jan. 2026 Mii Status
---

Hi.

I’ve been wanting to write about my stuff in a blog for a while.

I would love to give the story on how everything started and a bunch of knowledge on Mii internals and rendering specifics.

But, for now I just wanted to discuss where I am in this whole journey, and why you haven’t seen anything tangible from me in a while.

# Mii Renderer (REAL)

As I write this, it’s been 20 months, or nearly **TWO WHOLE YEARS** since I started this. Not strictly two years of hard work, just two years that have passed. That’s lowkey embarrassing for something I never wanted to bring into 2026, but here we are anyway.

**Website screenshot?**

_The website. I struggle to look at it anymore._

As you know, the site has remained largely unchanged for forever. Indeed, the server is still pretty much the same code I began with: a mod of that one Mii rendering example by Abood, “FFL-Testing”.

**FFL-Testing server screenshot?**

I always wanted myself to get it working, be fully feature complete and accurate, then rewrite everything. Naturally, that didn’t happen.

The “temporary” solution stayed for a year and a half. Grass is green, sky is blue. Who could’ve ever seen this coming?! ?

Now, if you’re not particularly interested in the site, don’t worry. I’m just using it as a preface because almost everything else I wanted to do stem from this.

## Problems: Renderer Server

Back when it wasn't cringe, I cloned Miiverse a couple of times. During this, getting Mii icons was that one clunky piece of the Nintendo Network that felt like it'd be difficult to recreate.

**image of miiverse clone - grape? openverse^2? with mii images highlighted**

So, a custom renderer is useful to revivals such as Pretendo, WiiLink, etc. who currently rely on this Nintendo server (the “Mii Studio API”) for rendering Miis that can be shut down at any time.

(Actually, you couldn't even make a Pretendo account when it went down in May 2024.)

**image of pretendo account creation broken?**

![](./attachments/Jan-2026-status-on-my-Mii-projects-2100-attachment-001.jpeg)

https://discord.com/channels/408718485913468928/413884110667251722/1242172998815846561

Unfortunately, Pretendo isn't a fan of how it works and WiiLink has flat out ignored me when I suggested it to their dev. So none of my main &quotcustomers" are even using it.

I always thought one of the best parts of my server is how it's open source and runs on your own machine.

But, I only know of 3 people who rehosted it without my help. It’s had issues I knew about that made it harder to rehost, but I can’t stop ignoring them anymore.

* The renderer and web server are two separate programs.
* The server requires a window to always show up, which can be annoying.
* Building C/C++ code isn’t idiot-proof, and I actually don’t publish any builds.
* This is single-handedly down to me not being confident enough in the thing ?
* Finding the FFL resource file is clunky and can be automated.
* The renderer is single-threaded (can’t use multiple CPUs) and doesn’t scale.
* It’s not as modular as I feel it should be. 80% of the code is globbed into one file.

Some of those issues are definitely fixable, but the worst part to me is how it uses an obscure game framework making everything hard to build on. Let me explain.

### What is RIO and why am I complaining about it

Back in 2023, the NSMBU modder and reverse engineer AboodXD decompiled FFL, the Wii U &quotCafe Face Library&quot. This is what makes a lot of Mii rendering magic happen.

But FFL only works on the Wii U, like versions of the Face Library for other consoles. It talks to the “GX2” graphics API that won’t work on PC. How did he solve this?

Abood made a homemade game framework/engine/thing the previous year called RIO, which actually lets you run the same code on Wii U through GX2 and PC through OpenGL! Awesome, right? The decomp is using this and that’s why it all works.

**abood screenshot in that one discord of ffl on windows from 2023**

![](./attachments/Jan-2026-status-on-my-Mii-projects-2100-attachment-002.jpeg)

_Native Mii rendering with FFL on Wii U and Windows!_

https://discord.com/channels/339118412414582786/339118412414582786/1170385259913805956

Months later, I discover his FFL-Testing example. At the time I knew nothing about 3D programming, but desperately wanted to make Mii icons so I just kept adding on top of this example.

**screenshot of me getting icons in chat with abood**

All of this is still using RIO, and I think even Abood could agree that a homemade game framework like this can only do so much. I kept running into roadblocks and various frustrations that I couldn't always fix well, since I was still a noob.

* At first it didn't work on Linux, but both of us fixed this easily. It also couldn't even be built with Visual Studio on Windows.
* It needs OpenGL 4.5 which is unsupported on macOS, despite not using most of its features.
* Imagine my frustration when I just spent $2000 on this new MacBook months prior.
* It needed modifications so that the window would be invisible for running on a server. More on this later.
* Did not use any build system, I had to make my own CMakeLists.
* Uses a custom model format(?!), so no glTF support.

### RIO's big missing feature

By far the most frustrating thing to not have was **Skeletal Animation**. This was very important, even for static poses.

(It actually had support in a separate branch, but it still used the custom model format and I didn't think it was worth using.)

The Mii body is required to make accurate icons, and the Face Library only draws heads. I only realized much later in 2024 that the Mii body's height/weight is applied in a very specific way that'd be hard to match accurately.

A simplified explanation is that the whole body gets three-dimensional scale applied as XYZ, but the arms get YXZ and other parts like those spherical hands and shoes get X on all axes. In the editor, notice how the hands are never &quotstretched&quot.

**images of the difference with body scaling**

official: https://discord.com/channels/360173962862395392/485919503369371648/1297021047211692043, my: https://discord.com/channels/360173962862395392/485919503369371648/1297025958800396338

_This is an official Mii render where the body is scaled properly._

_In my attempt, the entire mesh is stretched. Notice how the limbs (circled) look squashed._

At a certain point I had everything needed to get Wii U Mii renders 100% perfectly accurate, EXCEPT for body scaling. As long as RIO didn't support this, I couldn't be 1:1 accurate and the project couldn't be considered &quotcomplete&quot.

It didn't help that I kept going through trial and error with this in other game engines for months and months without success.

**images of my attempts with ozz-animation and maybe three.js**

_A common result I got._

_In Three.js, either the pants model was too small or the head position was wrong._

_Other attempts I had used ozz-animation._

It is possible to implement skeletal animation yourself from scratch, and in fact Nintendo did this for the Switch's version of the Face Library that had a feature called &quotnn::mii::VariableIconBody" which made icons with body scaling.

**image showing this off**

_Left: amiibo Settings on Wii U, right: Switch_

_It uses “FFLIconWithBody” that has no scaling, whereas the “VariableIconBody” on Switch has scaling._

I say this because I ended up having to reverse engineer that and use its incomplete skinning code in the end.

**miitomo body model frustration?**

![](./attachments/Jan-2026-status-on-my-Mii-projects-2100-attachment-003.jpeg)

_Miitomo body scaling never worked without proper skeleton code._

But in general, I never felt like I should've had to do this. I don't want to develop a game engine, just this server. It's just that the lack of body scaling made everything look so cheesy and wrong. Once again, I spent a lot of time stalling on this and it ended up affecting other projects I wanted to do as well.

### OpenGL sucks for this

RIO is using OpenGL, and that's typical of many homemade engines. But, it really wasn't a good fit for this.

* OpenGL is single-threaded by design, not good for handling many requests on a server.
* You NEED to create a window to do any rendering.
* You can't debug shaders like you can with Direct3D, Vulkan, and Metal.
* OpenGL programs constantly act differently and break on other machines, speaking from experience.

It also felt pretty cringe from a younger version of myself to know that &quotmy" project was using OpenGL, which I always blamed for slow games and choppy GNOME UI on Linux.

### FFL without RIO

In mid-to-late 2024, I knew that if I wanted to move away from RIO, I had to make FFL work more independently. There's two ways that I did this:

1. Using FFL from other OpenGL programs that don't use RIO
2. Then, ripping out all OpenGL use entirely.

So in the remaining months of the year, I tried exactly that.

* October: Made examples to use FFL with raylib, a simple game framework in pure C that uses OpenGL.
* I published these to GitHub and moved on.

![](./attachments/Jan-2026-status-on-my-Mii-projects-2100-attachment-004.jpeg)

* November: Worked on FFLSharp which uses Veldrid, a &quotwrite-once-run-everywhere" library for all modern graphics APIs. It was also in C# which I use for my job.
* This is the first time I got Miis rendered in Vulkan and Direct3D!

![](./attachments/Jan-2026-status-on-my-Mii-projects-2100-attachment-005.png)

* January 2025: Began FFL.js, rendering Miis natively in the browser through FFL in WASM.
* It uses Three.js, which works with WebGL 1.0/2.0 and WebGPU.

![](./attachments/Jan-2026-status-on-my-Mii-projects-2100-attachment-006.jpeg)

Each of these helped me learn more about 3D, C/C++, and FFL itself. I had what I wanted in the end, a success for once!

... Unfortunately, that didn't last long.

### 2025 disaster

For unrelated reasons, I kept getting sidetracked and avoiding a new project after FFL.js. There is more to that which I'll explain later.

From February to October 2025, I had pretty much been checked out here.

I kept thinking about rewriting FFL (which I'd wanted to do since August '24), but at a certain point I insisted I wasn't going to begin any new project until I had a fully polished rewrite in my hands.

When it came to the renderer server, I had moved on mentally, insisting I was &quottotally" going to epically rewrite everything. I kept letting week slip after week, and I can remember very few times I was actively “locked in” to coding something. Uh-oh.

**github history**

![](./attachments/Jan-2026-status-on-my-Mii-projects-2100-attachment-007.jpeg)

_I didn’t lock in enough :(_

The end of the year kept approaching, and it was November before I knew it. I still needed to reeeeallyyy fix these ongoing issues that I’ve had for a year and a half.

## Back To Reality: New Renderer

After several months of fooling around, I’ve decided that I’m going to rewrite the renderer server using raylib, a game/rendering framework in C that I used before.

This isn't even the epic outcome I want, because raylib still uses OpenGL. So, why am I doing this?

* raylib is popular and maintained. It has skeletal animation, UI, broad compatibility, and lots of contributors.
* It's something I could use between the server and (future) editor, which is very attractive as Nintendo does this too.
* It’s lightweight, as my FFL raylib examples are 250 KB.
* Much lighter than Three.js for the web.
* It also makes it nicer to convert into a library so other programs can use it.
* I already have the Wii U shader and body scaling in raylib.
* This is an opportunity to fix all of the uglier things I had before (such as the separate web server), making it easier to host and maintain.

I’ve split this rewrite into a few reusable components. This is what I’d need for a new renderer server:

* Library for using OpenGL headlessly
* Smaller glTF exporter that works standalone
* Accurate Mii rendering and icon creation in raylib
* Implementing the web server in C++

Let’s see how much progress I made since November.

###

### (85%) Mii Model glTF Exporter

My renderer has this cool 3D model export feature that’s awkwardly hidden on my site, but works for what it is. That glTF exporter I made in September 2024 is more vibe coded and more bloated than I’d like.

I took the opportunity to start a rewrite, and I actually got pretty far here.

* Uses cgltf, a bump allocator, and minimal dependencies.
* Fully exports all Mii shapes with names, and puts all shapes under a single node/group.
* Texture exporting/encoding is handled by a user-provided function, and uncompressed PNGs can be used. This also means it doesn't need rendering.

**screenshot: model export alongside the code**

_I can plug it into FFL-Testing and it Just Works(TM)_

This is nice. There's just a few things left for it to be feature matching with the current exporter: The ability to export multiple &quotvariants" of the mask texture for different expressions, and, I also need a function that precisely calculates the buffer size needed because I'm pre-allocating.

Guess what, I had pretty much everything in it done on Nov. 6th other than those two, then I came back to work on those two later on and noticed a huge issue. Don't you love when that happens? I'm still procrastinating on those to this day.

(Don't remind me that I should add body model support ?)

But along with being just a better exporter for my server, I wanted to keep this dependency-less so that it could be used outside of the server for a pretty important reason.

You know how a Mii head is a 3D model, just that it's generated in a funny way? And we want to be able to bring the Mii magic into programs, games, fun stuff.

What if you could call some function that you put Mii data into, then you get a glTF model out and you can use it directly in your game?

This is an idea I've had for a while with Fusion, but for whatever reason it didn't occur to me that I could try it right now with FFL.

So along with the new exporter being new and nice and all, I'm also trying to make this C program called &quotffl2gltf" that fully gets a Mii model without calling OpenGL at all. If it doesn't have to do that, it'll be pretty flexible. Some things may need to happen on the CPU, but no big deal since it's native code.

**screenshot: ffl2gltf model export (nov 25?)**

![](./attachments/Jan-2026-status-on-my-Mii-projects-2100-attachment-008.jpeg)

_Mii model export fully on the CPU in 0.7 ms._

So far, here's where I'm at with that:

* ? Shapes
* ? Textures: Glass, Noseline, Cap, Faceline
* ? Mask Texture

Everything can be done on the CPU right now except for the mask. That's the texture that contains eyes, eyebrows, mouth, and more.

I have to figure out how to either draw it on the CPU where I'd have to find a super lightweight library (not something like Skia), or, try to fake it where instead of being one texture it's split up into multiple meshes with their own textures.

I'm not going to get too deep into either approach, but that's where I am with that. I hope I can get it fully working though, because on my machine the export happens in less than 1 ms, plenty fast for a game.

### (97%) GLHeadless Library

You know how I said you need a display and window when you want to render with OpenGL? The modern replacements like Vulkan, Direct3D 12, etc. don’t require this. So for a while, I thought it was non-negotiable that my rewrite would be using those.

But eventually, I realized that you CAN actually create an OpenGL context and use it without opening a window.

The problem is that you needed different code to do this for each OS, and none of the existing libraries for cross-platform OpenGL let you do this. So, I decided to make my own!

**image of example, link to repo**

_Drawing with OpenGL and raylib without a window on Linux, macOS, Windows._

So I worked on this for a while, got to a point where I was happy with it and released the repo in January. There’s still some minor features I’d like, but I’ll get to them later. This part isn’t remarkable.

However… the library is one 1500 line file, but it took me THREE MONTHS from start to finish. Why did it take this long, when an average dev would’ve been done in a week tops?

In short, I overcomplicated it as usual. Here’s a timeline:

* Nov 6: I found some code on GitHub that did headless GL initialization on all platforms, and copied it into a working raylib example.
* I immediately wanted it to be a library, but realized I’d have to rewrite all of it from scratch since I copied from GPL licensed code.
* Nov 26 (+ 20 days): Rewrite is nearly complete minus Windows support.
* Dec 2 (+ 7 days): Rewrite is done. But, I realized I’d need to allow: specifying the exact OpenGL version, using GL ES, legacy OpenGL, and surface/surfaceless initialization…
* Dec 24 (+ 28 days): Finally figured out the best way to specify versions and stuff, still needed polishing.
* Jan 3 (+ 10 days): Surface/less and legacy support is complete, self-reviewed. I decided I needed a fake GLFW stub and more testing.
* Jan 12 (+ 9 days): Code is polished, tested, GLFW stub is working with FFL-Testing, good documentation and README coverage.

So I kept demanding perfection from myself, and each step took weeks to reach. I didn’t even work on much else at the time, so it was an unproductive few months. Yippee.

I look back disappointed at how I wasted so much time on something so stupid, but will I make the same mistakes again? Probably.

###

**== MARKER: 2026-01-22 ==**

###

### (60%) Mii Rendering in raylib

Rendering can be the most gratifying part, since you actually get to see the result. Like I said before, I actually do have progress here!

* Mii head (CharModel) rendering
* Wii U shader
* Body model **AND SCALING** ?

**need an image here**

I do have to implement all shaders and body models, but other than that, this all has to be made “reusable”.

As in, yes I have examples that do these things, and they need to be made into nicely modular pieces of code that don’t require a ton of setup. An example is how FFL.js creates a Three.js “model” object from the Mii head - has to be something like that.

It’s arguably one of the most important parts, but I have yet to start ?

###

### (3%) New Renderer HTTP Server

This is the piece of code handling when you go to /miis/image.png, and for various reasons it’s been written in Golang instead of C++ like the rest of the server, in a separate binary, making it one of the most annoying parts.

**image… url? swagger?**

But let’s zoom out a bit, what does it actually do today?

1. Validates the URL form data.
2. Parses numbers and enum strings such as “wiiu”, “switch”.
3. Talks to the server externally over TCP with a binary protocol.
4. Encodes the image to PNG.

It’s not exactly a complex task, but every part of how it does this bothers me.

1. Writing all those lines of code to validate each and every single parameter is annoying.

* Can we define a “table” of properties with min/max, and it’ll just validate automatically?

2. The meaning of parameters and the corresponding type strings can change, and it’s tedious to have to update this between the renderer and the server.
3. This format between the two servers can also get out of date, everything is added to both sides.

* It would also be nice if other programs could talk to the renderer - although I guess HTTP is the only “public” way.

4. The image encoding should be done by the renderer, it’s happening in the wrong place and could be faster...and the corresponding type stringand the corresponding typeand the correspondand the Corisand theand

So I definitely know where the downfalls are, but there’s also a handful of things to consider before doing this port.

* There’s one renderer server, but there’s actually two different web servers.
* One web server is only meant to be used on my website, and the other is meant to be standalone.
* My web server also handles NNID/PNID lookup, load balancing all renderer processes, logging and error reporting.
* If the new server is built into the renderer, it can’t have NNID/PNID lookups.
* MySQL, SQLite cache, and upstream HTTP(S) just too much complexity.
* But do I remove it altogether or try to add compatibility on my side?
* Whoever wants to use these can do the lookup themselves and provide data. I feel that this stuff should really be separate.
* Is C++ “safe” for a server?
* I used to not think so which is why I went with Go. But, I’ve changed my mind after all this time.
* There’s many libraries for HTTP servers in C++, and you can definitely do it without tons of bugs.
* But, you need to use your tools and review/test your code.
* I’ll probably want to set up ways for folks to sandbox this if they’re running it on their own box.

As usual I have a ton of personal notes about this as well, but, this piece is not started.

While we’re on the topic, I may as well bring up that I did eventually want to make this new server able to “embed” itself as a library in another program. How would that work? Would I have to make a single “render request” format/interface that’s used for both cases? I don’t know…

aaa

not started but

* it should have form items and enums in tables to not be annoying
* it is in pure c++ and light, but, needs robust testing as well (no bugs!)
* exclude nnid/pnid fetching

but perhaps more importantly

* http should not be the only way to request the new renderer
* it should be modular to later support things like gRPC, and should definitely support function calls as a library
* need an interface for requests to share between function calls and web server

### Mii Data Conversion

i almost forgot about this, but there is some code in ffl-testing right now that converts from switch mii data formats that also have to be brought over.

should i rewrite this? probably. will i? probably not.

### But why am I doing this only just now?

My mantra behind doing this rewrite is that it can help people who want to use the server right now. In particular, there are a few cases

### What are the &quotreal" reasons I'm doing this?

My mantra behind this rewrite has been that it’ll help people who need it right now. I've been motivated by a handful of people...

* Jon (Pretendo):
* Jon Barrow

Best I could tell, Jon has been indifferent towards me and the renderer I made, considering that they are the ones who would “need” it the most if Nintendo went down.

With Jon there’s been a pattern of back-and-forth, not working out, and not reaching out to each other for months (but we pretty much talk exclusively through GitHub Issues) and this time is no different.

In September, Jon is doing some polishing to some other Mii parsing code, and begins thinking about rendering again. I get pinged in regards to FFL.js.

What I tried making is a few examples trying to accurately render Mii icons headlessly in JS. They ended up being perfectly accurate since I did more reversing of Wii U Mii Maker, but the examples were also very simple, mostly because I already had a bunch of JS code for rendering the Mii head and body, including scaling.

Naturally, this worked in practice, but didn’t work for Jon after a few constraints. They repo to Rewrite It In Rust!(TM), but as I’m writing this, it doesn’t work.

I always prefer to do things in C/C++ so I didn’t really use this example for anything else, but it still showed me that this could be made nicely modular and simple.

Since October I’ve been working at a snails pace on this, maintaining list of what I need to have and finish up before getting to this. This is a rough list of what’s needed before I begin.

* New light and flexible glTF exporter based on cgltf - Almost done!
* Model-based management of Mii models in raylib

but hang on, doesn’t raylib still use OpenGL? Oh, yes, it sure does. But, I’ve realize that I can overcome a good amount of its limitations.

After some thinking, I figured that I didn’t just want to do this rewrite, but I actually needed it to move forward. If I ever wanted a hope of

## Problems: The Website

Oh boy, this one is a whole other can of worms.

First, let me be clear on what the wonderfully named _mii-unsecure.ariankordi.net_ is, and what it isn’t.

It was originally a web server that renders Mii icons. That’s it.

I originally came in with the goal to remake the Mii icons seen on Miiverse, which were always hosted on _mii-secure.cdn.nintendo.net._ Don’t you love a name based fully on an inside joke that only like five people will ever get?

When it was time to make the UI, first of all I stalled on doing this for 2 months, even when the server was working. But then, I mostly took cues from the pf2m.com Mii Renderer. This worked for a little while, but as more features kept getting added, they all just piled on top of each other...

Previously I made plans for how to improve the UI, such as: using more symbols for conciseness, being more horizontal to use space on PCs, having a dedicated &quotpreview" area and allowing you to move to another render...

But then I added the conversion dropdown, purely because I already had the code ready and needed a place to put it. Then it became clear to me that we need more than a new &quotMii Renderer" site, but one place where many versatile tools

## Mii Editor???

Most of you know that, unfortunately, a web app called “Mii Creator” suddenly came into existence a little more than a year ago. I even give them a shout out on my homepage.

I thought it was cute at first, tried to help the author as much as I could. But I always knew at the back of my head that I was going to make my own Mii editor, no matter what anyone else thinks.

A few months go by, and there’s some issues between me and Austin that get worse day after day. I’m going to tell the story and resulting drama + evidence of stolen code later on, but by now I’m very unhappy with how everything is.

I’ve always believed in open source all my life, and to see something that was born out of the reverse engineering I did, only from the attention of detail that I have, all suddenly get turned against me, seeing the project now have a strict policy on being closed source and requiring an annoying Discord membership and login… it’s kind of broken me.

## So Where Is The Arian Kordi Mii Maker Free Download For Windows Xp 2019 1000% Working No Scam

I think you can tell that it’s not here by how much I’m bitching about it. But, I DID try!

# What am I doing again? Why?

at the end of this article, I wanted to come back to my main point with all of this. If I just wanted to complete my first goal of replacing that Nintendo Network Mii server, I would’ve been done a year ago. So what am I still doing?

To start with, I don’t know. Great answer, right?

I guess I haven’t had a fantastic idea to move on to, and between how much pressure I put on myself and the fact that I still have a full-time job, it’s not exactly easy to find that next thing.

(You could also say that the whole purpose of life in general is TO figure out your purpose.)

But I’ve still latched onto a few things that inspire me to keep going.

* Developer Support
* Reverse Engineering
* Opportunity to Impress

### Developer Support

If you’ve been paying attention, pretty much nothing I’m making at the moment is user facing. it’s just the thing to make the thing worse, just the pickaxe you use in the gold mine.

But that’s not a bad thing, and how many people following my footsteps are doing the same thing.

I have always loved Miis and wanted more people to experience them, without: decompiling thousands of lines of code, or even worse, making recreations by eye that look like total crap and make me ashamed to be human.

People have been trying to reverse engineer these things for literal decades, and even though perfection is impossible, I want to be as close as I can.

I want to document as much as possible, make it as easy and widespread as possible, and make it high-quality so that anyone can re-create these iconic and adorable little characters in a way that feels like magic.

The fact that Mii Creator will probably never be open source again makes it borderline useless to developers, bringing nothing more to the table than I do. I could admire how Austin is trying to allow use of your Mii library elsewhere just like Nintendo does, but overall I feel the way he’s going is the wrong one.

In the wise words of Gabe Newell, “suck is forever.” That actually makes no sense out of context, but the point is that I feel this is a long game, and whoever makes the next best thing will simply be the new standard for however many years in the future Nintendo will be relevant.

### Reverse Engineering

To me and many others, there’s nothing like f\*cking up your sleep schedule and spending many hours into the morning trying to reverse something very interesting. That’s consistently the only thing that can keep me up, like that, other than. You know. ?

Mii rendering has gotten me way deeper into reverse engineering than ever before, and I am single-handedly way more knowledgeable about computers in general from looking at a somewhat Mii related piece of code in Ghidra. I feel more powerful now, like I can just do more stuff.

I can’t put into words how gratifying it is to finally have figured something out that I’ve been kicking my ass for a few days or months, and ESPECIALLY reversing something that others have tried and failed that, or maybe got parts wrong because they weren’t looking at the actual code.

I’m especially proud when solving mysteries I had 7 years ago: AFL symbols in Miitomo, FFL resource format, Miitomo obfuscation… As far as younger me is concerned, I’m pretty much doing God’s work.

I’ve always been striving to get things exactly as 1:1 accurate as they should. Mii shaders, face textures, proportional body scaling, accurate structs from DWARF data… this is a level of accuracy and attention to detail that I feel is pretty rare. It’s easy to half-ass a lot of this, throw your hands up and not care about it.

I wouldn’t call many things perfect, including what I’ve done up to now, but I definitely know what perfection looks like and I’ve gotten a good chunk there.

I want to take a second to mention Abood, who decompiled FFL and the Wii U shader. We certainly wouldn’t be where we are today without him, and I’m not gonna pretend I would be in the same place either if he weren’t there in the early days showing me how he decompiled and worked.

He’s been working over the past few years decompiling New SUPER MARIO BROS. U, where some of our goals overlap.

There’s a level editor he made that shows level identical to how the game does, also involving decomps and reversing shaders. I’m not aware of too many other projects that go this far for accuracy.

### Opportunity to Impress

I’m definitely not alone on this, but doing development is always an opportunity to show the world “how it’s done.” so if there’s things that you hate about every website, things that you hate about every game, things that you hate about every program… guess what, the people making those things are no smarter than you are, and anyone has an opportunity to set a bar for high standards.

So yeah, something that really motivates me is to make: a server that Doesn’t Suck! A library that Doesn’t Suck! and hopefully, a program that isn’t web app bloat, and actually feels smoothly nice to use.

This kind of thing applies to any project and I undoubtedly will probably never make something flawless- for example, I always wanted to make a Miiverse clone that exemplified everything I wanted in a nice web app. I had many ideas that I never ran with, and all my previous attempts are everything but.

# It's hard To stay Motivated

well, when I was wrapping up what I wrote above, something reminded me to search GitHub for examples of anyone who have used my code, since it’s all open.

I found two examples that didn’t impress me.

* Someone I found that copy-pasted my JSFiddle example for Mii body rendering onto GitHub, removed the copyright header, and also copied FFL.js into their repo (ethan)
* I had to _find out_ why he did this by trying to import it the right way, and it didn’t work, but instead of submitting an issue or PR they instead copied the files.
* Someone who made a library called “MiiPy” which they say “renders high quality Mii images” when it literally just wraps and launches FFL-Testing (MiiPy guy)
* They probably saw the issue that it was difficult to set up, but instead of consulting me or actually fixing it, they over complicated and vibe-coded a “solution”.
* I’m also offended when low quality projects or wrappers take a good name like “MiiPy” that will forever cause confusion if these get published to package managers.

after this, I thought a little more about it, and asked myself: What HAS been my overall experience with developers? What kind of person is using my tools?

* Someone who made an amateur-ish web app eclipsing everything I did (kat)
* Removed my credits from the app, doesn’t let me have any input and went against my wishes to be open source
* Copy-pasted my code with his friend purely to deny that he took any help from others, preventing others from discovering my work just to boost his own ego
* Used my code to their advantage to make a closed web app requiring membership to their Discord that they use 90% of the time to self-promote
* Someone who made an extremely amateur and poor quality JS Mii library using FFL.js who used to “solve” issues with a copy of the library in their repo, instead of contributing back (kestron)
* Someone who I can’t seem to please no matter what who has to come up with a reason to criticize everything (jon, heroic)

Is everyone just autistic or something?

Sometimes, on bad days I look at this and ask why I even bother, I mean the whole reason the Mii Community(tm) never got as far as I was able to to begin with is because a bunch of it is made up of kids and people who don't know what they're doing, and that's exactly what I'm dealing with.

### BUT

You can honestly find an endless amount of &quotbad examples" like this while working towards... literally anything. Depending on who you are, you can always see things this way.

There's some important things to realize:

* If you keep a tool closed source, and then get hit by a bus tomorrow, a bunch of what you did won't matter, people won't be able to see and build on top of it.
* See the RFL_Res.dat Editor tool, where the author lost the source code.

There's a mindset Austin and others had which is very understandable, that if something is open source, people can take it and run with it. This isn't even that uncommon TO see in open source (Chromium). But...

* If your &quotproduct" is truly the best, shouldn't it be at the top of Google searches?
* If you truly provide every solution, shouldn't you be the go-to? Shouldn't you make a name for yourself?

This is something I'm trying to grasp myself, especially when it comes to Miiverse clones. But I think you'll surprise yourself to see how true it is.

And for Chromium, I mean, Google Chrome isn't the BESTESTEST browser anyway isn't it? Look at its alternatives, and they're pretty much Chrome without Google. But isn't that what many people literally want to begin with?????

Let's say some asshole took mii.nxw.pw's source and rehosted it, but didn't require a login. I guess that sucks, but is it Austin's fault that it's being locked behind a stupid Discord membership and doesn't work offline?

Isn't the problem with &quotpiracy" not just that the thing costs money, but that in a lot of cases they make it inconvenient to use the thing you bought anyway? Like how the site logs me out every single time I go to it and I have to stare at the dumbass landing page?

The fact that others will sometime provide something even if you won't isn't even a bad thing. Sure, there's a lot of things I hate about Mii Creator, but if someone is asking me about something or maybe it's even in-person, I'm not going to _not_ recommend it if it fits their needs.

Likewise, I'm not as angry as I could be surrounding that because there was nothing ever stopping me from making my own editor other than myself.

These things just become bad when people get greedy. Like, the only reason we're stuck with Windows and Mac are because the programs aren't compatible

# OK, but how am I doing?

Wow, I thought you’d never ask. What’s that? Oh, you didn’t ask? Oh alright, my bad. oh, nobody’s actually talking to me right now? Ah.

2025 has been one of the most typical “me” of all time, and I mean that in the worst way possible. All of the wrong habits staying with me. all of the procrastinating, over complicating, low self-worth, certain habits that are all too typical for young adults that I’ve sworn on myself to stop, and I’ve been extremely weak-willed about it… not to mention all the time continuing to spend indoors, not going on walks, not giving myself a bunch of daytime to actually legitimately think about myself…

There’s a ton of lessons to learn this year, and I’m probably only going to learn 20% of them- not because I want to, not because I’m insisting that I’ll never improve, just that I can’t convince my inner mind and self to stay committed to anything. Anything. Anything positive, at least
