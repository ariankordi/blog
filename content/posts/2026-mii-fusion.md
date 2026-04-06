---
title: 'The Mii library in any language (Fusion)'
date: 2026-03-22T00:00:00-05:00
draft: true
linkTitle: Mii Fusion Manifesto (old)
---

It doesn't exist. Sorry if I clickbaited you.

But it's really not that far off, and I've been quietly working on it for a whole year. This is that post where I finally explain what I've been doing — and why I think it's actually going to work.

<!--more-->

If you read [my other post on where my Mii projects stand]({{< relref "posts/2026-mii-status-frontend" >}}#a-universal-library), you might remember me briefly mentioning this thing called the Fusion Programming Language and promising more details later. Well. Later is now.

## The problem with Mii code

I'll keep the background brief since it ties into stuff I've written about before.

Every person who's ever needed to handle Mii data has written their own version of the same parsing code. In their own language. With their own naming conventions and their own bugs. Here's a quick hall of fame:

- **Python**: [mii2studio](https://github.com/HEYimHeroic/mii2studio) — used for converting Mii formats, ran server-side for years because Python doesn't run in the browser. Has a couple of parsing issues, and others have been copy-pasting it ever since.
- **JavaScript**: [mii-js (Pretendo)](https://github.com/PretendoNetwork/mii-js) — pulls in Node.js `Buffer` and `crypto` modules, meaning you need a huge polyfill for browser use. At some point this made their Mii editor JS 900+ KB.
- **JavaScript again**: Another one I won't name used to be ~3000 lines in one file, barely commented, and somehow still pulls in headless-gl and Three.js as dependencies just to give you Mii decoding.
- **C++**: There are two separate C++ implementations in my renderer server for conversion that have diverged from each other.
- **Go**, for [the web server](https://github.com/ariankordi/nwf-mii-cemu-toy/blob/ffl-renderer-proto-integrate/mii2studio/mii2studio.go). And then **JavaScript** for [the website](https://github.com/ariankordi/nwf-mii-cemu-toy/blob/ffl-renderer-proto-integrate/assets/data-conversion.js).

And every one of these has slightly different bugs, slightly different field names, and slightly different coverage of the formats.

The obvious question is: **could I just write it once?**

{{< figure src="TODO-upload" caption="The glassY/mouthColor issues — my fix never got merged. Multiple projects downstream share the same bug." >}}
<!-- 📷 suggest: upload fresh screenshot of mii2studio PR, or use discord gallery: ./discord-messages-from-discordchatexporter/jasmine cruza la muralla - ok - general [485919503369371648] (after 2025-01-11).json_Files/image-CE267.jpeg -->

## Finding Fusion

In early March 2025 I was going in circles on this exact question — what language should the "real" Mii library be in? — when I stumbled onto the [Fusion Programming Language](https://fusion-lang.org).

Fusion is an obscure, active project that started in 2011. (It used to be called "The Ć Programming Language". Nice spin on C#.)

The entire premise of Fusion is: **write library code once, run it anywhere.** It's not meant to be a general-purpose language. You can't open files, you can't call external APIs, you can't do I/O of any kind. What you CAN do is define classes, methods, and logic — and then transpile that code to C, C++, JavaScript, TypeScript, Python, Java, C#, and more.

{{< figure src="TODO-upload" caption="One Fusion file (.fu), transpiled to Python, C, and JS all at once from March 2025. The image is barely readable but I was very excited." >}}
<!-- 📷 use: discord-image-gallery.md → ./discord-messages-from-discordchatexporter/jasmine cruza la muralla - ok - general-2 [567697014943514634] (after 2025-01-11).json_Files/image-4936C.jpeg -->

The comparison that always comes up is [Haxe](https://haxe.org) — which does the same thing — but Haxe doesn't support raw C, only C++. For Mii tooling that needs to work in game engines, embedded systems, or be linked with other native code, raw C matters a lot. Fusion is the only transpiler I know of that gives you that.

~1,800 GitHub stars. That's it. Nobody uses this thing. I searched GitHub for `.fu` files and found two categories of results: actual Fusion projects, and things that had nothing to do with Fusion but happened to use the `.fu` extension for their own obscure languages. The community is tiny.

But it has an active maintainer, an [open issue tracker](https://github.com/fusionlanguage/fut/issues) where things actually get fixed, [comprehensive reference docs](https://github.com/fusionlanguage/fut/blob/master/doc/reference.md), and a [live playground](https://fusion-lang.org/playground). That's enough.

{{< figure src="TODO-upload" caption="\"like this Fusion thing is SUCH an unpopular programming language that the only projects i can find with .fu are... also their own obscure programming languages with the .fu suffix\"" >}}
<!-- 📷 use: discord-image-gallery.md → ./discord-messages-from-discordchatexporter/jasmine cruza la muralla - ok - general [485919503369371648] (after 2025-01-11).json_Files/image-FDC2B.jpeg -->

## Why this actually fits

Here's the part that took me a while to articulate: **Fusion's limitations are not a problem for this specific use case. They're a feature.**

Fusion can't open files. It has no I/O. At first that sounds like a dealbreaker for a library that, among other things, reads binary resource files. But think about what that actually means:

- The caller reads the file — from disk, from a network request, from memory, from wherever
- Fusion gets a byte array and does the parsing
- Fusion gives back structured data
- The caller does whatever they want with it

This is exactly the separation of concerns I've wanted for years. The Wii U Mii renderer (FFL) does too much: it talks directly to the GPU, it manages its own memory, it reads its own files. That's why adapting it to anything other than Wii U hardware has been a nightmare of stripping things out.

With a Fusion library, the "engine" part is whatever you bring. The library just handles the logic:

- **Data parsing**: reading the bitfields, validating CRCs, knowing that height goes from 0–127 but Switch caps the old format at 127 while the new format goes to 127 too but differently
- **Format conversion**: the color table mappings from Ver3 (3DS/Wii U) to NX (Switch) and back
- **Mask math**: the CalcRawMask / CalcMVMatrix positioning that people always get wrong
- **Resource parsing**: what shape goes where in the binary, what the compression headers look like

All of that logic is pure computation. No GPU, no filesystem, no network. Fusion is perfect for it.

<!-- 📷 use: discord-image-gallery.md → ./discord-messages-from-discordchatexporter/jasmine cruza la muralla - ok - general [485919503369371648] (after 2025-01-11).json_Files/IMG_3121-5756F.jpeg -->

---

## What I've built: the experiments

The repo is [`ariankordi/mii-fusion-experiments`](https://github.com/ariankordi/mii-fusion-experiments). It started in April 2025 as a proof-of-concept and has become… a lot more than that.

Here's what exists so far:

### Ver3StoreData (April 2025)

The 3DS/Wii U Mii format. This was the first one I implemented and the one I'm most confident about.

- Full bitfield-based decoding of all Mii properties
- CRC-16/CCITT validation and calculation (the checksum that makes the format "official")
- UTF-16 nickname decoding to UTF-8
- Conversion to/from `Ver3CharInfo` (the decoded, field-by-field representation)
- `WrappedStoreData` — the encrypted QR code format — was added later (more on that below)

The CRC implementation had to be written by hand because Fusion has no standard library. Same for the UTF-16 converter. That's fine — it means no dependencies.

{{< figure src="TODO-upload" caption="\"im really hoping this mii data library in All Programming Languages EVER!!!!!!!!!!!!!! (, that are transpilable by fusion) turns out well\"" >}}
<!-- 📷 use: discord-image-gallery.md → ./discord-messages-from-discordchatexporter/jasmine cruza la muralla - ok - general [485919503369371648] (after 2025-01-11).json_Files/image-61D31.jpeg -->

### NxResource + GLBExporter (May 2025)

This is probably the most impressive experiment. `NxResource` reads the Nintendo Switch Mii shape resource file — the binary that contains all the 3D mesh data — and `GLBExporter` encodes a full glTF binary file from it. Both completely in Fusion.

glTF is not a trivial format to output. It has a JSON header and binary body, attributes, buffer views, accessors, meshes, nodes... I wrote a handmade glTF encoder in Fusion from scratch, because there was no other choice, and it works.

{{< figure src="TODO-upload" caption="NxResource + GLBExporter: Switch shape data extracted and exported to glTF, running in both C and JS. This was a big deal." >}}
<!-- 📷 use: discord-image-gallery.md → ./discord-messages-from-discordchatexporter/jasmine cruza la muralla - ok - general [485919503369371648] (after 2025-01-11).json_Files/image-BFB37.png -->

### MaskTest (May 2025)

The "mask" is the texture that gets projected onto the face — it's how the eyes, eyebrows, mouth, and facial features end up in the right place. It's the part everyone gets wrong.

I reimplemented `CalcRawMask` and `CalcMVMatrix` from FFL's decompilation, added unit tests against the real values, and it's 1:1 accurate. This code is boring to look at (it's a bunch of matrix math) but it's the thing that makes Mii faces look correct.

{{< figure src="TODO-upload" caption="Mask positioning math with unit tests against real extracted vertex data. Yes, I wrote tests. Yes, I was proud of myself." >}}
<!-- 📷 use: discord-image-gallery.md → ./discord-messages-from-discordchatexporter/Direct Messages - lender [814599982841724938] (after 2026-01-01).json_Files/image-A0160.jpeg -->

### MiiToStudio (February 2026)

Converts any Mii format to the Nintendo Mii Studio web format. This one is [already public](https://github.com/ariankordi/mii-fusion-experiments/blob/main/MiiToStudio/MiiToStudio.fu) and I even used it to [remake pf2m.com/tools/mii](https://pf2m.com/tools/mii/) — where all parsing happens client-side in JS generated from this Fusion code.

### WrappedStoreData + AES-128 (March 2026)

3DS Mii QR codes are encrypted with AES-128-CCM. I ported some AES-128 code to be fully in Fusion.

This sounds insane, and it kind of is. AES is not a simple algorithm. But Fusion is capable of expressing the block operations, S-box lookups, key schedule — all of it. The result compiles to C, JS, Python, wherever.

{{< figure src="TODO-upload" caption="WrappedStoreData: Mii QR encryption/decryption, fully in Fusion." >}}
<!-- 📷 use: discord-image-gallery.md → ./discord-messages-from-discordchatexporter/Direct Messages - cookie, Gab, Murilo [1124892468593307658] (after 2026-02-25).json_Files/image-5A426.jpeg -->

### RFLResource, FFLResource, FFLToGLTF

Resource parsers for the Wii (RFL), Wii U (FFL), and 3DS (CFL) Mii resource files. `FFLToGLTF` does exactly what it sounds like.

{{< figure src="TODO-upload" caption="CFL resource parser working — the 3DS format, little-endian with some weird vertex layouts." >}}
<!-- 📷 use: discord-image-gallery.md → ./discord-messages-from-discordchatexporter/Direct Messages - lender [814599982841724938] (after 2026-01-01).json_Files/IMG_7614-7F2BF.jpeg -->

### RandomMii

The "look-alike" random Mii generator that FFL uses internally. I decompiled this myself from FFL and reimplemented it in Fusion. The output is seeded the same way, so it should be reproducible.

{{< figure src="TODO-upload" caption="Random Mii generation compiling to JS and actually working. The first language test for this module." >}}
<!-- 📷 use: discord-image-gallery.md → ./discord-messages-from-discordchatexporter/Direct Messages - cookie, Gab, Murilo [1124892468593307658] (after 2026-02-25).json_Files/image-D42BB.jpeg -->

### CharModel (WIP)

This is the goal. `CharModelHelper` is an early draft of what would become the rendering abstraction: given a `CharInfo` and a resource, produce the data needed to render a Mii. No GPU calls, no file I/O — just telling the caller "here's the shape at offset X with this scale and this color, do with it what you will."

---

## The honest flaws of Fusion

I'd be lying if I said this was a smooth ride. Fusion is limited by design, and some of those limitations genuinely hurt:

**⭐⭐⭐ No array slicing**

Want to pass a sub-array? Too bad, you pass the array and an offset instead. Every function that takes bytes has an extra offset parameter. This is annoying and makes the public API slightly more verbose than ideal.

**⭐⭐⭐ One output file, no imports**

Every build produces a single file. There's no way to have `import WrappedStoreData` in your project — you get all of `mii-fusion-experiments` compiled into one blob, and it's up to you to tree-shake it. For JavaScript this is manageable (bundlers handle it), for C it's just a big file. Not a dealbreaker, but not ideal.

{{< figure src="TODO-upload" caption="\"are the masses of setters and getters something that fusion adds?\" — yes. yes they are. FIELDS CANNOT BE PUBLIC in Fusion, so every field access goes through a getter/setter." >}}
<!-- 📷 use: discord-image-gallery.md → ./discord-messages-from-discordchatexporter/Direct Messages - GloriousGlider8 [1418243724135104582].json_Files/image-AAED1.png -->

**No unit test framework**

Fusion doesn't have one. I've been writing test harnesses manually — just `Main.fu` files that set up test cases and assert things. It works, but a real framework would be nice.

For async patterns (needed if you want to, say, load resources lazily), Fusion can't express them natively. The workaround is that the caller creates a `Promise`/`Task`/`std::future` and passes it in, while the Fusion code signals completion through callbacks. Annoying but workable.

---

## "Is this even worth it?"

Yes, I believe so, and here's the clearest way I've been able to put it:

{{< figure src="TODO-upload" caption="\"rn i have this example RIGHT NOW!!! which decodes mii data, reads shapes from the mii resource file, and does math to figure out where to position a face shape\" — the first time all of the pieces were working together" >}}
<!-- 📷 use: discord-image-gallery.md → ./discord-messages-from-discordchatexporter/Direct Messages - lender [814599982841724938] (after 2026-01-01).json_Files/image-F5B1E.jpeg -->

{{< figure src="TODO-upload" caption="\"now compare this to FFL.js which is 1200 lines long aND I MINIFIED IT ALREADY\" — the Fusion equivalent doing the same thing is considerably smaller" >}}
<!-- 📷 use: discord-image-gallery.md → ./discord-messages-from-discordchatexporter/Direct Messages - lender [814599982841724938] (after 2026-01-01).json_Files/image-2781D.jpeg -->

The alternative to Fusion is: I write this in C or C++ and then somehow make it available in other languages. That means WASM builds for JS (doable but adds complexity), bindings for Python and Java (totally reasonable but now I'm maintaining wrappers too), and so on. Fusion gives me all of that for free, at the cost of working within its constraints. For pure-logic library code — which is exactly what this is — those constraints are mostly manageable.

I also had a moment recently that really cemented this for me. I described a function I needed to implement for AES-CCM, pointed Fusion at some existing crypto code, and it filled in the implementation in Fusion correctly. The transpiler and the AI era are converging in a way that makes this kind of "describe once, run everywhere" actually realistic.

---

## Progress overview

Here's where things stand right now:

| Module | Languages tested | Status |
|---|---|---|
| Ver3StoreData | C, JS, Python | ✅ Working, tested |
| MiiToStudio | C, JS | ✅ Public, in production use |
| NxResource + GLBExporter | C, JS | ✅ Working |
| MaskTest (CalcRawMask) | C | ✅ Unit tested, 1:1 accurate |
| WrappedStoreData + AES-128 | C, JS | ✅ Working |
| RFLResource / CFL | C | ⚠️ Working, no textures |
| FFLResource + FFLToGLTF | C | ⚠️ Working, no textures |
| RandomMii | C, JS | ✅ Working, matches real binary |
| CharModel | — | ❌ Early draft |

---

## What's next

The endgame for this is `CharModel` — a full FFL replacement where:

- You give it Mii data and a resource
- It gives you back: shape IDs, colors, transforms, mask parameters
- **You** draw it — with Three.js, raylib, Godot, OpenGL, whatever

The rendering side ties into my [Mii renderer rewrite in Raylib]({{< relref "posts/2026-mii-status-backend" >}}) — ideally, the new server uses the Fusion library for all of its Mii data logic, which means that same logic is available to everyone else for free.

I don't have a release timeline. What I do have is a year's worth of accumulated progress that I'm actually confident in, which is more than I can say for most of my projects.

More soon — hopefully before another year goes by. 🙂

---

_If you want to follow along: [`ariankordi/mii-fusion-experiments`](https://github.com/ariankordi/mii-fusion-experiments). Most of the WIP stuff isn't public yet but the stable examples are there._
