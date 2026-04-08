---
title: The Ultimate Library for All Mii Operations in Any Language
date: 2026-03-31T00:17:00-04:00
draft: false
linkTitle: Ultimate Mii Library?
---

_This is continued from [my other post on where my Mii projects stand]({{< relref "posts/2026-mii-status-frontend" >}}#a-universal-library). That's when I first introduced Fusion, and this post goes into more depth on my plans._

---

It doesn't exist yet. Sorry if I clickbaited you. But it's not far off, either!

## Miis are deceptively complicated

On the surface? A cute Nintendo character creator. Choose a face shape, eye type, some sliders, done. Behind that, there's an entire hidden world that nobody fully appreciates until they sit down and try to read the raw data.

<!--more-->

To start with, Mii character data is stored in a fully custom and tightly packed binary format.

Here, a single 32-bit integer can hold several different values: eye type, eyebrow rotation, nose scale, mole X/Y position - all packed into specific bits, aka bitfields. Here's what that looks like when you've deciphered it.

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-001.jpeg "450px")

There are dozens of fields, spread out across a 96-byte structure that's been more or less the same since Miis debuted in 2006.

On top of that, this layout changed across platforms. Wii data (RFL), 3DS/Wii U data (CFL/FFL/"Ver3"), and Switch (CharInfo/CoreData) are all incompatible and store things slightly differently. As a testament to efficiency, Switch CoreData is the smallest at 28 bytes.

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-002.jpeg "550px")

All formats overlap, but have unique fields:

* Switch has more colors that have to be converted up and down
* Various fields such as sharing and creator name were removed on Switch
* The "Mii ID" further [packs creation time](https://jsfiddle.net/arian_/vhnmrgp3/5/) and console type in some formats

Then there's the format for the Nintendo Account web editor (obfuscated), QR codes (AES-CCM encrypted), and the local databases that differ per console.

If that seems like a lot, we haven't even touched on the _resource files_: the shape and texture data used to render heads and facial features are ALSO in completely proprietary formats.

So, there's a lot here. Which brings us to the obvious question: what does the existing ecosystem look like?

## The "Mii data" ecosystem as of 2026

It's not great!

I spent some time cataloging every Mii implementation I could find on the internet. There are implementations in most major languages: JavaScript, Python, C#, Rust, Go... and they all have their own problems. Some are incomplete. Some have fields guessed at (or just wrong).

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-003.jpeg "350px")

_As many Mii implementations as I could find. There are AT LEAST 29 unique ones._

If you look at them, the naming is absolutely everywhere:

* "fatness" vs "weight" vs "build"
* "sex" vs "gender" vs "isGirl" vs "female"
* "eyeSquash" vs "eyeScaleY" vs "eyeAspect" vs "eyeVerticalStretch"

... You get the point. Chaos like this makes it hard for other code to work together, and each time another attempt comes along, more people get confused.

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-004.jpeg "400px")

_Four Mii implementations. Barely anything in common._

But one of the worst parts is that they end up copying from each other, including the bugs.

There's a widely-used script called [mii2studio.py](https://github.com/HEYimHeroic/mii2studio/blob/master/mii2studio.py) that has an error in how it maps mouth colors. That same bug has since spread to who knows how many downstream implementations that used it as a reference.
Same story with Mii structs on 3dbrew.org/wiibrew.org that always get copy-pasted with wrong field names into new projects.

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-005.jpeg)

*Two bugs that originated from mii2studio.py.*

As I write this, I am discovering even more code being written - more people making the same mistakes over and over again, copying from the same old sources.

What we need is a library grounded in decompiled Nintendo code. Real field names from debug info we previously didn't have, accurate structures and layouts, provable behavior matching the real binaries. That doesn't exist yet, and I plan to make it.

## Which language do we use?

If I'm going to write a _"definitive"_ Mii library, what language do we write it in? This seems like the obvious first question but it took me embarrassingly long to think through properly.

My first instinct was JavaScript, because it works for convenient web tools and desktops/servers. But I've already written Mii data code [in C++](https://github.com/ariankordi/FFL-Testing/blob/renderer-server-prototype/src/DataUtils.cpp) for the renderer server, [JS](https://github.com/ariankordi/nwf-mii-cemu-toy/blob/ffl-renderer-proto-integrate/assets/data-conversion.js) for the website, [Go](https://github.com/ariankordi/nwf-mii-cemu-toy/blob/ffl-renderer-proto-integrate/mii2studio/mii2studio.go) for an earlier web server, and that's just me.

Others have written Mii code in [Python](https://github.com/HEYimHeroic/mii2studio/blob/master/mii2studio.py), [C#](https://github.com/TeamWheelWizard/WheelWizard/blob/c967554f3918bfb8ee1c52450a3ced9877e8db99/WheelWizard/Features/WiiManagement/MiiManagement/Domain/Mii/Mii.cs#L4), [Rust](https://gitlab.com/3ds-netpass/netpass-server/-/blob/30ab51867a600acd3572dbc66050e15ebeba906f/src/types/mii.rs#L307), and more. Would I end up having to write and maintain 7 different versions?

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-006.jpeg)

*Example of a similar-looking snippet I've had to copy over and over again.*

I talked about this in my previous post, but: in March 2025 I found the [Fusion Programming Language](https://fusion-lang.org). The concept is that you write code once, and it transpiles cleanly to C, C++, Java, JavaScript, TypeScript, Python, C#, and Swift.

The premise of Fusion is that you write "library code" (_not applications, not I/O, not UI_) and it works wherever you need it. For my goal of one definitive and well-tested Mii library that just works, I thought this was perfect.

It may even end this cycle of duplicating the same code over and over again, because it meets you where you are!

![](/uploads/20260319-010250.png "450px")

_[MiiToStudio.fu](https://github.com/ariankordi/mii-fusion-experiments/blob/main/MiiToStudio/MiiToStudio.fu) transpiled using the [Fusion Playground](https://fusion-lang.org/playground)._

If it sounds too good to be true... yes, it kind of is. But not in the ways you'd expect.

## Challenges with using Fusion

### Binary structures

These days when you want to exchange "data" between computers, it's usually in a textual form. Something in-between human and machine readable, like JSON:

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-008.jpeg "200px")

*This is actually the format that Apple Memoji characters are stored in. Lmao.*

But you have to understand that Mii data is just a raw array of numbers. How do we make sense of this…?

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-025.jpeg "450px")

*Nothing human-readable here.*

The way the programmers originally dealt with this is with a feature C/C++ has called "structs". We define each member of the data and its size, and we can read/write fields just like any other variable.

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-026.jpeg "500px")

*We define the struct, then access its fields directly as if each were a variable.*

This works great, but most programming languages don't have the concept of "structs", including Fusion. What do we do instead? We can still read that array of numbers, but we need to make sure the right index lines up with the right name.

It gets even messier when there's fields smaller than a byte large (bitfields), which most Mii formats have. You have to do some bit-shifting that can get confusing really fast.

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-027.jpeg "300px")

*A snippet of code I wrote in 2019 that did this, based on Kinnay's struct. It's very ugly, as well as veeerrrry inaccurate...*

At this point many would give up, or go for an overcomplicated solution. I looked at Kaitai Struct, ImHex Pattern Language, and other libraries to no avail - they were just not going to work for me.

<!--

Kaitai:
  - You need to "compile" each structure, but they end up needing a "runtime" anyway?!
  - Does NOT support encoding (outside of Java and Python). What the heck, man.
  - The runtime is heavy, needing to parse its own language for expressions. The structures can also be complex.
  - I may reuse the YAML format it uses, but I do not have much faith in the "compiler".

ImHex Pattern Language:
  - Resembles C syntax but is not actually compatible, especially not with bitfields.
  - Even harder to parse than Kaitai, which uses YAML.
  - Also supports a lot of complex features and expressions, making the runtime heavy.
  - Only really useful for ImHex. There is a library for the Pattern Language but I haven't seen wide use of it.

Other? solutions?
  - There may be struct libraries specific to certain languages (e.g., struct-fu in JS).
  - A library only in a certain language goes back to the programming languages problem.
  - Additionally, a lot of these libraries rely on heavy runtime reflection.

-->

Weeks turned into months as this problem was still not solved, and it kept blocking any other progress I wanted to make.

That is until I realized something. If I simply wrote the Mii conversion functions in C first, then I decompile it with Ghidra and get this. It's the same logic, but auto-generated and will work when pasted in any language!

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-028.jpeg "550px")

*The chain looks like this: C -> Ghidra -> JavaScript. The code in the middle is easy to port to any language.*

So what are we looking at, and why does it work? Structs only exist for us humans to understand the data. When the C compiler converts source code to an executable, every field gets converted directly into a byte/bit offset, adding bitshifts if needed.

The result is "pure" code that works everywhere with zero dependencies. No "Kaitai Struct Runtime", no library for struct parsing, no extra bit-reading functions, no nonsense.

But I'm sure you've noticed that it's also completely unreadable. In fact, I knew about this method all the way back in August 2024 and didn't want to proceed until I had a way to generate these in a reproducible and maintainable way.

Sigh. I may work on my own struct parsing/conversion/codegen library to solve this at a later date, but I just can't make it happen at the moment. I mean, these Mii data structs don't change to begin with - as long as it's added and tested, is there really an issue the way it is?

### Code that lives outside Fusion

Fusion is pure library logic: no file reading, no OS APIs, no network. This is by design, since it has to compile to environments where those don't exist (a browser, an embedded system, etc.).

For Mii data/rendering, here's what gets handled in the user's code:

- **Data loading**: Your code reads bytes from a file or network, and you pass in a buffer. Fine, actually cleaner.
- **Decompression** (for some resource files): You provide a zlib implementation in your target language via an abstract class interface.
    - You have the freedom to choose a library that does the same job with smaller or faster code.
- **AES encryption** (for QR codes): I was able to port an AES implementation to native Fusion code, so you can use that and it'll "just work" but you can also substitute your own.
- **Async code** (JS, C#): If something needs async (anything on this list), the goal is for it to not go through Fusion at all.
    - Example: If you're using the async `CompressionStream` API on the web, we provide the raw compressed data and you fully handle that part.

Example in Node.js: You provide a class for zlib -> read resource -> export model -> write to file. (Any of those steps can change, but the core logic is the same across all languages.)

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-029.jpeg "450px")

Whenever I have to explain the downsides of Fusion, "I/O stays outside" ends up turning into an advantage. Fusion code = pure logic. Caller code = getting bytes in, doing something with results.

That's a cleaner split than most existing libraries, which tend to mix file reading, parsing, and conversion all together.

### The language's actual limits

It never claimed to be the best language, but there are serious inconveniences here.

- **No imports**: All Fusion code gets built to a single output file. You can bundle multiple .fu files into one output, but for the most part the modules have to be self-contained.
    - This keeps dependencies minimal, which I like, but…
    - ... you can't split things across packages the way you might in a normal library.
- **Byte conversion**: Fusion does not have any functions to read multi-byte numbers or floats.
    - We actually can make them ourselves, but we may need code specific to each language (using Fusion 'native' blocks).

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-009.jpeg "400px")

- **Memory management**: Since the same code will be usable in C, you'll want to be as strict as you would there - reusing objects and byte arrays as much as possible.
    - For my library, I would not want to allocate any memory. That allows the user to leverage memory pools, which Nintendo code always does (including the Face Library).

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-073.jpeg "400px")

*The user's code is the only one calling "new" here. When you use "new", that allocates memory.*

None of these are dealbreakers, but they shape how you write code. It's a different mindset than usual.

## Fusion for Mii rendering?

This is the part that changed this project from a nice-to-have to a must-have. This was always about Mii data, but I asked myself early on if it can help with rendering as well.

Let me get this out of the way: The "Face Library" on Nintendo consoles (FFL, RFL, CFL, etc.), despite the mystery, is a glorified "Mii data to model loader".

I've been working with the Wii U version and all of its flaws for a year, and I can tell you that's what it is at its core.

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-079.jpeg "550px")

*A Mii head model imported into Blender. It was created by FFL using the textures (shown on the right) and shapes in the resource file.*

It loads shapes and textures, calculates positioning and colors, and sends draw commands. It's tightly coupled to each platform's graphics API (GX2 on Wii U, GX on Wii) making it far less portable than it should be.

When Abood ported the [FFL decomp](https://github.com/aboood40091/ffl/tree/nsmbu-win-port) to PC, that requirement was replaced with (effectively) OpenGL but still not removed. I had to spend a lot of time [tearing this out](https://github.com/ariankordi/ffl/commit/ec5f46ffd13686ef573d3c4d5f04ba9bd8904e25) when making [FFLSharp](https://github.com/ariankordi/FFLSharp) and [FFL.js](https://github.com/ariankordi/FFL.js), and it was not pretty.

In comparison to my Fusion code: I have working examples using the RFLResource right now rendering with raylib (C, OpenGL), as well as Three.js (JS, WebGL or WebGPU). That is also on top of having a glTF exporter that I will mention soon (C/JS, no rendering). All same Fusion parsing logic, totally different callers.

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-080.jpeg "600px")

*Left = Rendering with raylib in C, Right = rendering with Three.js in JS.*

The approach I plan to take in Fusion is to separate model/texture data from rendering entirely. Fusion handles all pure logic: reading resources, assigning colors, and calculating coordinates for the facial features (mask texture).

Your caller chooses when and from where the data comes, and you also handle everything on the GPU.

This way, it doesn't matter if you're using: raw OpenGL, Unity, Godot, Three.js, etc. Load assets, plug the vertex/pixel data into your engine, and you're good to go. Also allows more customization.

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-016.jpeg "300px")

*This class tells you which shape/texture IDs to load. It does not LOAD the raw data for you. Lets you have more freedom, unlike the Face Library.*

But if a Mii model is just that, a 3D model, can we export it to an open-source format that you can just.. load?

I've already made a Mii to glTF exporter usable on [my website](https://mii-unsecure.ariankordi.net/), though I was able to take this further by making a FULLY standalone exporter for the glTF 3D model format, from scratch, in pure Fusion.

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-082.jpeg "600px")

*Pure Fusion code exporting a glTF model of the hair mesh. Left = From FFLResMiddle.dat in C, Right = from Switch ShapeHigh.dat in JS. Two languages, same code.*

At the moment this only exports a single mesh, but I am planning to change this later on. Now THIS is the dream:

* A library supporting all Mii data and resources in all major languages
* You just give it your input Mii data
* You get a loadable model file out
* Load the model data from memory, and it'll just work.

If I am able to finish this, it would be the ultimate universal Mii rendering solution. But, let's give it some time and see if I actually get to this point.


## How do I know the code works?

<details>

<summary>
    <b>This section is a bit boring, so click here to reveal it.</b>
</summary>

Accuracy is something I've been obsessed with since the beginning. I didn't want to make another "I guessed at the field layout and it probably works" implementation. I wanted to definitively say: this is right, and this is exactly why.

- **Decompiled source**: Where possible, I reverse directly from the original binary. Algorithms (random Miis), lookup tables, and struct fields are all exact.
    - I'm not even trusting the [existing FFL decomp](https://github.com/aboood40091/ffl) for this (sorry Abood) for a few reasons, and besides, I've gathered more of this:
    - **Debug info** is a treasure trove when available, and for most Face Library versions it is. This gives us the exact function names, and sometimes field/variable names.

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-011.jpeg "550px")

*dwarfdump + generated header from a debug version of CFL. This is the most thorough kind of debug info.*

- **Table extraction**: Occasionally there are lookup tables needed for things like colors, conversion, or the random Mii ("look-alike") feature.
- **Extraction scripts**: These usually get extracted either manually or in Ghidra, but I wrote scripts that extract these byte-for-byte directly from binaries.
    - The scripts also make it easier to do further conversion, e.g. converting colors from floats (decimal-point) to plain numbers (0xRRGGBB).
    - Given that these tables take up room, there's potential to shrink them by using RGB565 (16-bit).

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-012.jpeg "500px")

_Extraction scripts doing their thing. Colors are converted from float to 0xRRGGBB (no precision loss), the random parts arrays are reordered and that's what was actually used in my Fusion code._

- **Testing against real code**
  - I validated my random Mii implementation by running the same seed through my Fusion code versus an emulator that executed the function in FFL directly.
  - My random Mii code matches across thousands of rounds. That's the standard I want for everything.

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-013.jpeg "550px")
_Left: Python + Unicorn emulating the random Mii function. Right: Fusion code producing the same result (notice "1df4")._


- **Unit tests**: If this sounds lame, you're right. This is mostly the kind of thing huge companies do.
  - In fact, the Switch Face Library has unit tests. See?
![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-014.jpeg "350px")
  - For my renderer server, I remember features constantly breaking whenever I made changes. This would prevent that.
  - Fusion doesn't have its own test framework, but to run the test in all languages we can make a simple program for each test case and run in every language.
      * Coverage can be measured in an individual language like JS, C#, C++. I would love to eventually have high coverage.
  - Example: There is a test for facial feature positioning (mask) where the exact coordinates were captured from a Wii U game in RenderDoc, and it matches exactly.

![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-015.jpeg "500px")

*The C++ GoogleTest here will be ported to Fusion eventually.*

</details>

## Progress: What exists right now

Here's my reality check for where I am at overall.

### Done: Mii data

* **3DS/Wii U format (Ver3StoreData)**: Round-trip encoding/decoding works correctly.
    - For decoding, there is also [MiiToStudio.fu](https://github.com/ariankordi/mii-fusion-experiments/blob/main/MiiToStudio/MiiToStudio.fu) which was used alongside the QR decryption code to [refactor pf2m.com/tools/mii](https://github.com/PF2M/pf2m.github.io/blob/main/tools/mii/pf2m-mii-ninstudio-renderer.js) as fully local JS.
    - (But I consider MiiToStudio as more of a one-off.)
* **Mii QR codes**: Encryption/decryption works, as well as having an AES-128 implementation in pure Fusion.
* **Random Mii (look-alike) generator**: Decompiled from FFL into Fusion and verified to have identical results.
![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-083.jpeg "550px")

### Done: Rendering

- **Mii shape resources**: There are parsers for Switch ShapeHigh/Mid.dat, FFLResHigh/Middle.dat (not AFL yet), RFL_Res.dat (Wii), and CFL_Res.dat (3DS). Shapes only for now.
  - This includes the RFL ["display list"/primitives](https://github.com/koopthekoopa/RFL/blob/fe6bc4b17e0fe80732d82210b89a1978faac9db5/source/RFL_Model.c#L1043-L1069) quirk.
- **glTF exporter**: Exports a single shape from FFL/NX resources in pure Fusion. Not very useful without all head meshes.
- **Shape rendering math**: Color tables from FFL/CFL (identical), eye/brow rotation offsets, head model shape positioning (CharModelHelper). Shape rendering is fully covered and good.
  - Recently I used these along with the RFL/CFL parsers to help me fully reproduce the Wii and 3DS lighting styles as shaders.
![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-084.jpeg "550px")
  - (These shaders will be released soon for all -2 FFL.js users, and for the renderer server as soon as I get to that rewrite.)
- **Face texture (mask)**: Accurately decompiled, vertex positions fully match FFL via a test.
    - Remember my [glTF exporter rewrite]({{< relref "posts/2026-mii-status-backend" >}}#new-gltf-exporter)? I've added the ability to export facial textures DIRECTLY - no render target. It's all possible because of this Fusion implementation.
![](/uploads/The-Ultimate-Library-for-All-Mii-Operations-in-Any-Language-3122-attachment-085.jpeg "550px")
  - I would also like to go on a little side tangent and mention that this logic was previously buried within the Face Library, leaving the face totally un-customizable for years.
      * Allowing the user to customize this would enable:
      * More [expressions (Miitomo)](https://github.com/ariankordi/ffl/commit/2bdfc351f16af84e279956d57e2be5cb42c946e8), new face elements entirely (Miitopia Switch)
      * Or a mix of both with more features and customization overall like in the new Tomodachi Life game.

### Work in progress: Data

* **All other Mii formats**: Wii, Switch, Studio - Not difficult to add.
* **Data conversion**: Need to add CharInfo for Switch with conversions between previous formats. [Implemented before](https://github.com/ariankordi/nwf-mii-cemu-toy/blob/ffl-renderer-proto-integrate/assets/data-conversion.js), just needs to be done cleanly.
* It would be good to read/write **local DB formats**, as well as the **Wii Remote DB**, **amiibo format**, and add "**Mii comparison**" for generating instructions.

### Work in progress: Rendering

- **End-to-end rendering**: CharModelHelper.fu and Mask.fu work standalone for shapes and textures respectively, but need to be connected in some way for a full Mii head model.
- **Resource textures**: All of them are swizzled, so Fusion code is needed per-platform for de-swizzling.
- **Expressions**: Tables have been extracted from FFL to make these work, but there is some other complex logic I haven't considered yet.
  - The challenge is keeping FFL's optimizations while also allowing customization here.

### Still unknown

* What level of abstraction makes sense for callers. In other words, we need maximum flexibility but without making it too complicated for whoever wants to use this.
* There needs to be a way to read from any resource format through one interface, but all of them are so different that "one-size-fits-all" gets difficult fast.

And of course, all code needs to be reviewed and polished before I'm done. I have some early work in the [mii-fusion-experiments repo](https://github.com/ariankordi/mii-fusion-experiments), but everything else is just on my machine for now.

As a reminder, I'm the only one working on this. I don't have any deadlines, pull requests, bug reports, anything. Just me to decide when it's ready.

My plan has been to finish my [rewrite of the renderer server]({{< relref "posts/2026-mii-status-backend" >}}#mii-renderer-rewrite-in-raylib), then use it as a testbed to fully replace FFL. That way, I can get a nice side-by-side with tests going. Once that project gets off the ground, this one will as well.

## Sigh.

For how long I've had this planned out, it's been going way slower than I'd like. Why?

+ **Scope keeps growing**. What started as "a Mii data library" now includes resource parsers, a glTF encoder, AES, rendering math, and texture handling is still ahead among others.
  - Why haven't I released what's usable currently? I think developing data + rendering is important, but...
  - The real answer is that it's harder for me to go back and polish, than to keep experimenting. So I've just kept doing so.
+ **For it to just "work" is never good enough**. There was a point early on where I had a method for handling binary structs that worked fine. Instead of moving on, I spent months looking for a more principled solution.
  - I knew about the Ghidra method all the way back in August 2024. I only went back to it because I knew I couldn't keep spending more time on this.
+ **No external pressure.** Working alone means nothing forces a decision. I can decide something isn't ready indefinitely, which is something I do a lot.
  - There also isn't a project I have that actively "needs" it. Sure, I have many ideas here and there. The only "product" I've released with FFL is [the renderer server](https://github.com/ariankordi/FFL-Testing), which I have so far written off.

None of this is going to stop the project, but it should explain the timeline.

### Why I keep going at all

Y'know, there's a version of this where I just use whatever is out there, finish "the" project, and move on with my life. I 100% understand why many have gone that path.

For me, I am always seeing people trying to solve this, and usually badly.

* Copying old code that's many years old with known bugs
<!-- this has the mii2studio mouth color bug: https://github.com/skylarc2006/rkg-inspector/blob/1cc02e6bd847c5469779e47db4375f485102ef61/src/mii_rendering.rs -->
* Wrapping my server in a Python library and calling it a "renderer"
<!-- very cringe, disgraceful to call this "miipy" https://github.com/davitizhgenti/miipy -->
* Still guessing struct layouts in the year of our lord 2026
<!-- many people do this. trust me. -->
* Emulating Miitomo's code in QEMU, not realizing it is just FFL
<!-- pretendo: https://github.com/PretendoNetwork/org-issues/issues/2#issue-2762403314 -->
* Pasting the rendering code of FFL into JavaScript, GDScript, Rust, C#
<!--
  * JS: kat's thing
  * GD: timmi..? (but he good)
  * RS: uhhh.. veee??? https://github.com/j0lol/vee/tree/main
  * C#: this thing https://github.com/TeamWheelWizard/WheelWizard/blob/ad13b926f569265b1f5adc521d35b026d471dc59/WheelWizard/Features/MiiRendering/Services/ManagedFflResourceArchive.cs
-->

Barely anyone wants to help each other, but I do. The demand is there, but the quality isn't. Or whatever else Claude is telling me to write at this point. I've been working on this for five months straight please hel-

<!--
* 2018: https://github.com/jaames/mii-assets
* 2020: https://github.com/HEYimHeroic/mii2studio
-->

There are tools from 2018 and 2020 that are still relevant because nobody has yet made anything better. If I release my work openly, document it thoroughly, and it's actually correct, then it too can last 5 or 10 years.

On the other hand: tools that are closed-source, abandoned, or locked behind a Discord login don't survive like that. They may win the short game, but I want to win the long game.

## Conclusion

I've been working towards this for the better part of a year, and I'm more convinced than ever that Fusion is the right tool for this problem despite its flaws.

Fusion as a concept is very strong, and if this leads to it getting more popularity and support, that's worth more than any of my ideas here.

Nobody has done the "Mii library" correctly before. I hope I can.

Hopefully you'll be hearing more about this soon.
