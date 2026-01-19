+++
date = '2026-01-09T00:00:00-05:00'
draft = true
linkTitle = "Jan. 2026 Mii Status"
title = 'Jan. 2026 status on my Mii projects'
+++

Hi.

I’ve been wanting to write about my stuff in a blog for a while.

I would love to give the story on how everything started and a bunch of knowledge on Mii internals and rendering specifics.
But, for now I just wanted to discuss where I am in this whole journey, and why you haven’t seen anything tangible from me in a while.

# Mii Renderer (REAL)

As I write this, it’s been 20 months, or nearly **TWO WHOLE YEARS** since I started this. Not strictly two years of hard work, just two years that have passed. That’s lowkey embarrassing for something I never wanted to bring into 2026, but here we are anyway.

As you know, the site has remained largely unchanged for forever. Indeed, the server is still pretty much the same code I began with: a mod of that one Mii rendering example by Abood, “FFL-Testing”.

I always wanted myself to get it working, be fully feature complete and accurate, then rewrite everything. Naturally, that didn’t happen.

The “temporary” solution stayed for a year and a half. Grass is green, sky is blue. Who could’ve ever seen this coming?! ?

Now, if you’re not particularly interested in the site, don’t worry. I’m just using it as a preface because almost everything else I wanted to do stem from this.

## Problems: Renderer Server

Back when it wasn't cringe, I cloned Miiverse a couple of times. During this, getting Mii icons was that one clunky piece of the Nintendo Network that felt like it'd be difficult to recreate.

So, a custom renderer is useful to revivals such as Pretendo, WiiLink, etc. who currently rely on this Nintendo server (the “Mii Studio API”) for rendering Miis that can be shut down at any time.

(Actually, you couldn't even make a Pretendo account when it went down in May 2024.)

Unfortunately, Pretendo isn't a fan of how it works and WiiLink has flat out ignored me when I suggested it to their dev. So none of my main &quotcustomers" are even using it.

I always thought one of the best parts of my server is how it's open source and runs on your own machine.

But, I only know of 3 people who rehosted it without my help. It’s had issues I knew about that made it harder to rehost, but I can’t stop ignoring them anymore.

* The renderer and web server are two separate programs.
* The server requires a window to always show up, which can be annoying.
* Building C/C++ code isn’t idiot-proof, and I actually don’t publish any builds.

+ This is single-handedly down to me not being confident enough in the thing ?

* Finding the FFL resource file is clunky and can be automated.
* The renderer is single-threaded (can’t use multiple CPUs) and doesn’t scale.
* It’s not as modular as I feel it should be. 80% of the code is globbed into one file.

Some of those issues are definitely fixable, but the worst part to me is how it uses an obscure game framework making everything hard to build on. Let me explain.

### What is RIO and why am I complaining about it

Back in 2023, the NSMBU modder and reverse engineer AboodXD decompiled FFL, the Wii U &quotCafe Face Library&quot. This is what makes a lot of Mii rendering magic happen.

But FFL only works on the Wii U, like versions of the Face Library for other consoles. It talks to the “GX2” graphics API that won’t work on PC. How did he solve this?

Abood made a homemade game framework/engine/thing the previous year called RIO, which actually lets you run the same code on Wii U through GX2 and PC through OpenGL! Awesome, right? The decomp is using this and that’s why it all works.

Months later, I discover his FFL-Testing example. At the time I knew nothing about 3D programming, but desperately wanted to make Mii icons so I just kept adding on top of this example.

All of this is still using RIO, and I think even Abood could agree that a homemade game framework like this can only do so much. I kept running into roadblocks and various frustrations that I couldn't always fix well, since I was still a noob.

* At first it didn't work on Linux, but both of us fixed this easily. It also couldn't even be built with Visual Studio on Windows.
* It needs OpenGL 4.5 which is unsupported on macOS, despite not using most of its features.

+ Imagine my frustration when I just spent $2000 on this new MacBook months prior.

* It needed modifications so that the window would be invisible for running on a server. More on this later.
* Did not use any build system, I had to make my own CMakeLists.
* Uses a custom model format(?!), so no glTF support.

### RIO's big missing feature

By far the most frustrating thing to not have was **Skeletal Animation**. This was very important, even for static poses.

(It actually had support in a separate branch, but it still used the custom model format and I didn't think it was worth using.)

The Mii body is required to make accurate icons, and the Face Library only draws heads. I only realized much later in 2024 that the Mii body's height/weight is applied in a very specific way that'd be hard to match accurately.

A simplified explanation is that the whole body gets three-dimensional scale applied as XYZ, but the arms get YXZ and other parts like those spherical hands and shoes get X on all axes. In the editor, notice how the hands are never &quotstretched&quot.

At a certain point I had everything needed to get Wii U Mii renders 100% perfectly accurate, EXCEPT for body scaling. As long as RIO didn't support this, I couldn't be 1:1 accurate and the project couldn't be considered &quotcomplete&quot.

It didn't help that I kept going through trial and error with this in other game engines for months and months without success.

It is possible to implement skeletal animation yourself from scratch, and in fact Nintendo did this for the Switch's version of the Face Library that had a feature called &quotnn::mii::VariableIconBody" which made icons with body scaling.

I say this because I ended up having to reverse engineer that and use its incomplete skinning code in the end.

But in general, I never felt like I should've had to do this. I don't want to develop a game engine, just this server. It's just that the lack of body scaling made everything look so cheesy and wrong. Once again, I spent a lot of time stalling on this and it ended up affecting other projects I wanted to do as well.

### OpenGL sucks for this

RIO is using OpenGL, and that's typical of many homemade engines. But, it really wasn't a good fit for this.

* OpenGL is single-threaded by design, not good for handling many requests on a server.
* You NEED to create a window to do any rendering.
* You can't debug shaders like you can with Direct3D, Vulkan, and Metal.
* OpenGL programs constantly act differently and break on other machines, speaking from experience.

It also felt pretty cringe from a younger version of myself to know that &quotmy" project was using OpenGL, which I always blamed for slow games and choppy GNOME UI on Linux.

### FFL without RIO

In mid-to-late 2024, I knew RIO had to go, but I also knew I had to make FFL .

In mid-to-late 2024, I knew that if I wanted to move away from RIO, I had to make FFL work more independently. There's two ways that I did this:

1. Using FFL from other OpenGL programs that don't use RIO
2. Then, ripping out all OpenGL use entirely.

So in the remaining months of the year, I tried exactly that.

* October: Made examples to use FFL with raylib, a simple game framework in pure C.

+ I published these to GitHub and moved on.

* November: Worked on FFLSharp which uses Veldrid, a &quotwrite-once-run-everywhere" library for all modern graphics APIs. It was also in C# which I use for my job.

+ This is the first time I got Miis rendered in Vulkan and Direct3D!

* January 2025: Began FFL.js, rendering Miis natively in the browser through FFL in WASM.

+ It uses Three.js, which works with WebGL 1.0/2.0 and WebGPU.

Each of these helped me learn more about 3D, C/C++, and FFL itself. I had what I wanted in the end, a success for once!

... Unfortunately, that didn't last long.

### 2025 disaster

For unrelated reasons, I kept getting sidetracked and avoiding a new project after FFL.js. There is more to that which I'll explain later.

From February to October 2025, I had pretty much been checked out here.

I kept thinking about rewriting FFL (which I'd wanted to do since August '24), but at a certain point I insisted I wasn't going to begin any new project until I had a fully polished rewrite in my hands.

When it came to the renderer server, I had moved on mentally, insisting I was &quottotally" going to epically rewrite everything. I kept letting week slip after week, and I can remember very few times I was actively “locked in” to coding something. Uh-oh.

The end of the year kept approaching, and it was November before I knew it. I still needed to reeeeallyyy fix these ongoing issues that I’ve had for a year and a half.
