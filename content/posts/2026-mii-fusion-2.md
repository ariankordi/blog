---
title: The Ultimate Library for All Mii Operations in Any Language
date: 2026-03-31T00:17:00-04:00
draft: true
linkTitle: Mii Fusion Manifesto 2
---

This is continued from [my other post on where my Mii projects stand]({{< relref "posts/2026-mii-status-frontend" >}}#a-universal-library). That's when I first introduced Fusion, and this post goes into more depth on my plans.

---

* **MERGE BEST OF OTHER POST and REMOVE 2 FROM THIS ONE**
* REVISE with IMAGES, LINKS
* **HOW IS THIS DIFFERENT than the BRIEF EXPLANATION for my FRONTEND**
    - what does this bring to the table...?
* BEFORE PUBLISHING BOTH POSTS: consider OPTIMIZING IMAGES and FILENAMES?????

## Miis are deceptively complicated

On the surface? A cute Nintendo character creator. Choose a face shape, eye type, some sliders, done. Behind that, there's an entire hidden world that nobody fully appreciates until they sit down and try to read the raw data.

<!--more-->

To start with, Mii character data is stored in a fully custom and tightly packed binary format. This is ground zero for everyone examining Miis.

Here, a single 32-bit integer can hold several different values: eye type, eyebrow rotation, nose scale, mole X/Y position - all packed into specific bits, aka 'bitfields'. Here's what that looks like when you've deciphered it.

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-001.jpeg "450px")

There are dozens of fields, spread out across a 96-byte structure that's been more or less the same since Miis debuted in 2006.

On top of that, this layout changed across platforms. Wii data (RFL), 3DS/Wii U data (CFL/FFL/"Ver3"), and Switch (CharInfo/CoreData) are all incompatible and store things slightly differently. As a testament to efficiency, Switch CoreData is the smallest at 28 bytes.

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-002.jpeg "550px")

All formats overlap, but have unique fields:

* Switch has more colors that have to be converted up and down
* Various fields such as sharing and creator name were removed on Switch
* The "Mii ID" further packs creation time and console type in some formats

Then there's the format for the Nintendo Account web editor (obfuscated), QR codes (AES-CCM encrypted), and the local databases that differ per console.

If that seems like a lot, we haven't even touched on the _resource files_: the shape and texture data used to render heads and facial features are ALSO in completely proprietary formats.

So, there's a lot here. Which brings us to the obvious question: what does the existing ecosystem look like?

## The "Mii data" ecosystem as of 2026

It's not great!

I spent some time cataloging every Mii implementation I could find on the internet. There are implementations in most major languages: JavaScript, Python, C#, Rust, Go... and they all have their own problems. Some are incomplete. Some have fields guessed at (or just wrong).

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-003.jpeg "350px")

  _As many Mii implementations I could find. There are AT LEAST 29 unique ones._

If you look at them, the naming is absolutely everywhere:

* "fatness" vs "weight" vs "build"
* "sex" vs "gender" vs "isGirl" vs "female"
* "eyeSquash" vs "eyeScaleY" vs "eyeAspect" vs "eyeVerticalStretch"

... You get the point. Chaos like this makes it hard for other code to work together, and each time another attempt comes along, more people get confused.

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-004.jpeg "400px")

_Four Mii implementations. Barely anything in common._

But one of the worst parts is that they end up copying from each other, including the bugs.

There's a widely-used script called mii2studio.py that has an error in how it maps mouth colors. That same bug has since spread to who knows how many downstream implementations that used it as a reference.
Same story with Mii structs on 3dbrew.org/wiibrew.org that always get copy-pasted with wrong field names into new projects.

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-005.jpeg)

  _Two bugs that originated from mii2studio.py._

As I write this, I am discovering EVEN MORE code being written - more people making the same mistakes over and over again, copying from the same old sources.

What we need is a library grounded in decompiled Nintendo code. Real field names from debug info we previously didn't have, accurate structures and layouts, provable behavior matching the real binaries. That doesn't exist yet, and I plan to make it.

## Which language do we use?

If I'm going to write a _"definitive"_ Mii library, what language do we write it in? This seems like the obvious first question but it took me embarrassingly long to think through properly.

My first instinct was JavaScript, because it works for convenient web tools and desktops/servers. But I've already written Mii data code in C++ for the renderer server, JS for the website, Go for an earlier web server...

Others have written Mii code in Python, C#, Rust, and more. Would I end up having to write and maintain 7 different versions?

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-006.jpeg)

  _Example of a similar-looking snippet I've had to copy over and over again._

I talked about this in my previous post, but: in March 2025 I found the [Fusion Programming Language](https://fusion-lang.org). The concept is that you write code once, and it transpiles cleanly to C, C++, Java, JavaScript, TypeScript, Python, C#, and Swift.

The premise of Fusion is that you write "library code" (_not applications, not I/O, not UI_) and it works wherever you need it. For my goal of one definitive and well-tested Mii library that just works, I thought this was perfect.

It may even end this cycle of duplicating the same code over and over again, because it meets you where you are!

![](/uploads/20260319-010250.png "450px")

_MiiToStudio.fu transpiled using the Fusion Playground._

If it sounds too good to be true... yes, it kind of is. But not in the ways you'd expect.

## Challenges with using Fusion

  ---

### Binary structures

These days when you want to exchange "data" between computers, it's usually in a textual form. Something in-between human and machine readable, like JSON:

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-008.jpeg "200px")

_This is actually the format that Apple Memojis are stored in. Lmao._

But you have to understand that Mii data is just a raw array of numbers. How do we make sense of this…?

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-025.jpeg "450px")

  _Nothing human-readable here._

The way the programmers originally dealt with this is with a feature C/C++ has called “structs”. We define each member of the data and its size, and we can read/write fields just like any other variable.

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-026.jpeg "500px")

  _We define the struct, then access its fields directly as if each were a variable._

This works great, but most programming languages don't have the concept of "structs", including Fusion. What do we do instead? We can still read that array of numbers, but we need to make sure the right index lines up with the right name.

It gets even messier when there’s fields smaller than a byte large (bitfields), which most Mii formats have. You have to do some bit-shifting that can get confusing really fast.

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-027.jpeg "300px")

  _A snippet of code I wrote in 2019 that did this, based on Kinnay's struct. It's very ugly, as well as being inaccurate..._

At this point many would give up, or go for an overcomplicated solution. I looked at Kaitai Struct, ImHex Pattern Language, and other libraries to no avail - they were just not going to work for me.

Weeks turned into months as this problem was still not solved, and it kept blocking any other progress I wanted to make.

That is until I realized something. If I simply wrote the Mii conversion functions in C first, then I decompile it with Ghidra and get this. It's the same logic, but auto-generated and will work when pasted in any language!

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-028.jpeg "550px")

  _The chain looks like this: C -> Ghidra -> JavaScript. The code is now easy to port to any language._

So what are we looking at, and why does it work? Structs only exist for us humans to understand the data. When the C compiler converts source code to an executable, every field gets converted directly into a byte/bit offset, adding bitshifts if needed.

The result is "pure" code that works everywhere with zero dependencies. No "Kaitai Struct Runtime", no library for struct parsing, no extra bit-reading functions, no nonsense.

But I'm sure you've noticed that it's also completely unreadable. In fact, I knew about this method all the way back in December 2024 and didn't want to proceed until I had a way to generate these in a reproducible and maintainable way.

Sigh. I may work on my own struct parsing/conversion/codegen library to solve this at a later date, but I just can't make it happen at the moment. I mean, these Mii data structs don't change to begin with - as long as it's added and tested, is there really an issue the way it is?

### Code that lives outside Fusion

Fusion is pure library logic: no file reading, no OS APIs, no network. This is by design, since it has to compile to environments where those don't exist (a browser, an embedded system, etc.).

For Mii data/rendering, here's what gets handled in the user's code:

- **Data loading**: Your code reads bytes from a file or network, and you pass in a buffer. Fine, actually cleaner.
- **Decompression** (for some resource files): You provide a zlib implementation in your target language via an abstract class interface.
        - You have the freedom to choose a library that does the same job with smaller or faster code.
- **AES encryption** (for QR codes): I was able to port an AES implementation to native Fusion code, so you can use that and it’ll “just work” but you can also substitute your own.
- **Async code** (JS, C#): If something needs async (anything on this list), the goal is for it to not go through Fusion at all.
        - Example: If you're using the async `CompressionStream` API on the web, we provide the raw compressed data and you fully handle that part.

Example in Node.js: You provide a class for zlib -> read resource -> export model -> write to file.

Any of those steps can change, but the core logic is same across all languages.

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-029.jpeg "450px")

Whenever I have to explain the downsides of Fusion, "I/O stays outside" ends up being one of the things that turns into an advantage. Fusion code = pure logic. Caller code = getting bytes in, doing something with results.

That's a cleaner split than most existing libraries, which tend to mix file reading, parsing, and conversion all together.

### The language's actual limits

It never claimed to be the best language, but jeez..

- **No imports**: All Fusion code gets built to a single output file. You can bundle multiple .fu files into one output, but for the most part the modules have to be self-contained.
        - This keeps dependencies minimal, which I like, but…
        - ... you can't split things across packages the way you might in a normal library.
- **Byte conversion**: Fusion does not have any functions to read multi-byte numbers or floats.
        - We actually can make them ourselves, but we may need code specific to each language.

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-009.jpeg "400px")

- **Memory management**: Because the same code will work in C, we should always manage memory as if we are in C. This means reusing objects and byte arrays as much as possible. We never allocate.
        - This would also allow the user to use memory pools, which Nintendo code always does including the Face Library.

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-010.jpeg "400px")

_The user's code is the only one calling "new" here._

None of these are dealbreakers, but they shape how you write code. It's a different mindset than usual.

## How do I know it's correct?

This is something I’ve been obsessed with since the beginning. I didn't want to make another "I guessed at the field layout and it probably works" implementation. I wanted to definitively say: this is right, and this is exactly why.

- **Decompiled source**: Where possible, I reverse directly from the original binaries. Algorithms (random Miis), lookup tables, and struct fields are all exact.
        - I'm not even trusting the existing FFL decomp for this (sorry Abood) for a few reasons, and besides, I've gathered more of this:
        - **Debug info** is a treasure trove when available, and for most Face Library versions it is. This gives us the exact function names, and sometimes field/variable names.

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-011.jpeg "550px")

  _dwarfdump + generated header from a debug version of CFL. This is the most thorough kind of debug info._

- **Table extraction**: Occasionally there are lookup tables needed for things like colors, conversion, or the random Mii (“look-alike”) feature.
- **Extraction scripts**: These usually get extracted either manually or in Ghidra, but I wrote scripts that extract these byte-for-byte directly from binaries.
        - The scripts also make it easier to do further conversion, e.g. converting colors from floats (decimal-point) to plain numbers (0xRRGGBB).
        - Given that these tables take up room, there’s potential to shrink them by using RGB565 (16-bit).

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-012.jpeg "500px")

_Extraction scripts doing their thing. Colors are converted from float to 0xRRGGBB (no precision loss), the random parts arrays are reordered and that's what was actually used in my Fusion code._

- **Testing against real code**
        - I validated my random Mii implementation by running the same seed through my Fusion code versus an emulator that executed the function in FFL directly.
        - My random Mii impl. matches across thousands of rounds. That’s the standard I want for everything.

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-013.jpeg "550px")

_Left side: Python script using unicorn to emulate the random Mii function._

_Right: Fusion code producing the same result. Notice "1df4" in the third result._

_This FFLiDatabaseRandom decompilation is from scratch by me, since I noticed a mistake in Abood's version._

- **Unit tests**: If this sounds lame, you’re right. This is mostly the kind of thing huge companies do.
        - In fact, the Switch Face Library has unit tests.

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-014.jpeg "300px")

        - For my renderer server, I remember features constantly breaking whenever I made changes. This would prevent that.
        - Fusion doesn’t have its own test framework, but to run the test in all languages we can make a simple program for each test case and run in every language.
                - Coverage can be measured in an individual language like JS, C#, C++. I would love to eventually have high coverage.
        - Example: There is a test for facial feature positioning (mask) where the exact coordinates were captured from a Wii U game in RenderDoc, and it matches exactly.

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-015.jpeg "500px")

  _The C++ googletest here will be ported to Fusion eventually._

## What exists right now

      **INCOMPLETE!**

## Fusion for Mii rendering? (INCOMPLETE: IMAGES)

This is the part that changed this project from a nice-to-have to a must-have. This was always about Mii data, but I asked myself early on if it can help with rendering as well.

Let me get this out of the way: The "Face Library" on Nintendo consoles (FFL, RFL, CFL, etc.), despite the mystery, is a glorified "Mii data to model loader".

I've been working with the Wii U version and all of its flaws for a year, and I can tell you that's what it is at its core.
  **image: something... FFLDrawParam?**

It loads shapes and textures, calculates positions and colors, and tells the GPU what to draw. It's tightly coupled to each platform's API (GX2 on Wii U, GX on Wii) making it far less portable than it should be.

When Abood ported the FFL decomp to PC, he replaced the GX2 requirement with (effectively) OpenGL. This worked for a while, but when it came time to make FFLSharp and FFL.js, I had to tear this requirement out and it was not pretty.

The Fusion code doesn't care.
* There is a working example using shapes from RFL_Res.dat (Wii )
I have working examples using `RFLResource` (Wii shape data) rendering in both raylib (OpenGL/C) and Three.js (WebGPU/JS), on top of having the FFL/NX to glTF exporters. Same Fusion parsing logic, totally different callers.

[IMAGE NEEDED: RFLResource rendering in raylib and Three.js side by side]

The approach I plan to take in Fusion is to separate model/texture data from rendering entirely. Fusion handles all pure logic: reading resources, assigning colors, and calculating coordinates for the facial features (mask texture).

Your caller chooses when and from where the data comes, and you also handle everything on the GPU.

This way, it doesn't matter if you're using: raw OpenGL, Unity, Godot, Three.js, etc. Load assets, plug the vertex/pixel data into your engine, and you're good to go. Also allows more customization.

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-016.jpeg "300px")

_The "CharModelHelper" class tells you which IDs to load, instead of the raw shape/color/texture data like FFL does._

There's one piece that took me a while to appreciate: the "mask". This is the facial texture — a composite of your eyebrows, eyes, nose, and mouth, positioned on the face geometry using specific UV math derived from the CharInfo values. FFL computes this internally and never exposes it. I reverse engineered that math and put it in Fusion (`Mask.fu`), verified coordinate-by-coordinate against data captured from a Wii U game in RenderDoc.

This matters beyond just "it works." Miitomo used the exact same FFL internally but with additional expression table entries to support its custom emotions. Miitopia adds new face elements entirely. Tomodachi Life on Switch tweaks parameters. All of that is possible when the math is yours to control — something you can never do when it's buried inside the Face Library.

But if a Mii model is just that, a 3D model, can we export it to an open-source format that you can just.. load?

I've already toyed around with this by making a glTF exporter for mii-unsecure.ariankordi.net, though I was also able to implement a fully standalone exporter for the glTF format completely from scratch in Fusion.
    **image: read below**

_Pure Fusion code exporting a glTF model of the hair mesh. Same code in C and JS._

At the moment this is only capable of exporting one model, but I am planning more later on. Now THIS is the dream:

* A library supporting all Mii data and resources in all major languages
* You just give it your input Mii data
* You get a loadable model file out
* Load it right in from memory, it'll just work(tm)

If I am able to make this work, this would be the ultimate universal Mii rendering solution. But, let's give it some time and see if I actually get to this point.

## What exists right now

To keep this grounded, here's a rough snapshot of where things actually stand.

**Done and tested:**

- **Mii data decoding/encoding**: Ver3StoreData (3DS/Wii U), conversion through to Mii Studio format. CRC-16 validation, UTF-16 nicknames, the whole stack. Proven to round-trip correctly.
- **QR code encryption**: AES-128 in pure Fusion, so encrypted 3DS Mii QR codes decrypt entirely client-side — no native dependency.
- **Random Mii (look-alike generator)**: Decompiled from FFL by me, independently verified 1:1 against the real implementation running in an emulator.
- **Shape resources**: Can parse face shapes from NX (Switch), FFL (Wii U), RFL (Wii), and CFL (3DS). Each format has its own quirks — endianness, weird vertex indexing in RFL, compressed blocks in NX.
- **Rendering math**: Color lookup tables extracted from FFL, CharModelHelper for model positioning, Mask.fu for face UV coordinates.
- **glTF exporter**: Written entirely in Fusion. Exports shape data, works in C and JS both.

**In progress / left:**

- NX CharInfo class and Switch-specific format conversions.
- Texture reading — shapes work, textures don't yet. Deswizzling is platform-specific and the main remaining blocker.
- Getting rendering end-to-end: Mask.fu and CharModelHelper exist but haven't been connected to actual output.
- Expressions: the table exists in FFL, the deduplication logic doesn't have a clean home yet.

**Still unknown:**

- What level of abstraction makes sense for callers. Less hand-holding = more flexibility but more work for whoever uses this.
- Whether some of the texture work even belongs in Fusion, or should live in caller code.

All of this is local for now. I'm the only one working on it, which means there's no external deadline, no pull requests, no issue tracker — just me deciding when something is ready. The plan: finish the rendering pipeline using the raylib server as a testbed, then release together. That's the target.


## Sigh.

For how long I've had this planned out, it's going slower than I'd like. A few reasons, honestly:

- **Scope keeps growing.** What started as "a Mii data library" now includes resource parsers, a glTF encoder, AES, rendering math, and texture handling is still ahead. I keep telling myself it's all connected — and it is — but "connected" doesn't make it faster.
- **"Works" is never good enough.** There was a point early on where I had a method for handling binary structs that worked fine. Instead of moving on, I spent months looking for a more principled solution. I knew about the Ghidra approach from December 2024 and didn't use it until April. That's on me.
- **No external pressure.** Working alone means nothing forces a decision. I can decide something isn't ready indefinitely, and frequently do.

None of this is going to stop the project. But it explains the timeline.

On why I keep going at all: there's a version of this where I just accept that good enough tools already exist and move on. I don't believe that, but I understand why someone would. What actually keeps me going is something closer to — people are already trying to solve this. Badly, sometimes. Copying old scripts with known bugs, wrapping my server in a Python library and calling it a renderer, writing their own struct definitions by guessing at the layout. The demand is there. The quality isn't.

If I document this thoroughly, release it openly, and it's actually correct — it'll still be there in five years. Tools that get closed off, abandoned, or locked behind a Discord membership don't survive like that. That's the long game, and I think it's worth playing.

## Conclusion

I've been working towards this for the better part of a year, and I'm more convinced than ever that Fusion is the right tool for this problem even in spite of its flaws.

The constraints that seem limiting at first (no imports, no I/O, no exceptions) end up producing the kind of clean, portable library code that we want. Fusion as a concept is very strong, and if this leads to it getting more popularity and support, that’s worth more than any of my ideas here.

Nobody has done the "Mii library" correctly before. I think I can.

More soon.
