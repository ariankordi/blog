---
title: ariankordi.net Graveyard
date: 2026-02-14T17:18:00-05:00
sitemap:
  disable: true
robots: noindex
---

This page is for URLs I used to host but no longer exist. My 404 page redirects you here if you reached one.

## ariankordi.net/mii/, ariankordi.net/seth/, pf2m.com/hash/

These APIs used to take a Nintendo Network ID, and let you get a Mii render with it. It gave you a "Mii hash" used to access official NNID renders used on Miiverse. As you guessed, this was mostly used for Miiverse clones.

For example, it would give you **2efa39n1gq3r2** to be used in the URL [https://mii-secure.cdn.nintendo.net/2efa39n1gq3r2_normal_face.png](https://s3.us-east-1.amazonaws.com/mii-images.account.nintendo.net/2efa39n1gq3r2_normal_face.png) then multiple expressions and whole_body can be used.

#### Alternative

Nintendo shut this down. Specifically, in May 2024 the account.nintendo.net/v1/api/miis endpoint stopped working (not in April when the game servers shut down), so, this will not work the way it used to. NNIDs made on 3DS/Wii U consoles aren't even a good way to get Mii data anymore, either.

Ideally, if you want Mii images for a Miiverse clone or whatever sh\*tty service you're making, you would want to accept other forms of Mii input. These can include QR codes (3DS/Wii U/Internet), amiibo (Switch), Wiimote (readable with Web Bluetooth).

![](/uploads/20260214-173656.png)

To have something like the input selection on [mii-unsecure.ariankordi.net](https://mii-unsecure.ariankordi.net) would be good, and in the future it'd be even better to have a Mii editor. If all of these options were made available in a tiny widget that anyone can embed on their website, that would be perfect.

If you really do want to use NNIDs (or Pretendo PNIDs), my API is usable for this but won't work in the same way. There is documentation on my [Swagger](https://mii-unsecure.ariankordi.net/swagger/index.html#/) page, and the best resource is my patch for Cl\*sedv\*rse to support mii-unsecure.ariankordi.net. That's what I would refer to if you are 9 years old and want to fix Mii support in your Miiverse clone:

- [Fetch and render NNIDs from mii-unsecure.ariankordi.net instead of fr… · ariankordi/closedverse@173f8e0](https://github.com/ariankordi/closedverse/commit/173f8e05a481f2b01b2f37c5241e10332bc6a507)
- If you want PNID support, take the commit above and replace
    - `?nnid=` -> `?api_id=1&nnid=`
    - `/mii_data/` -> `/mii_data/?api_id=1&nnid=`
    - Change all wording of `Nintendo Network ID` to `Pretendo Network ID`

## Others

These pages are irrelevant or already replaced with a redirect.

#### ariankordi.net/aarch/

My various Miiverse archives and HTTP dumps used to be hosted here, the **A**rian **Arch**ive. These actually became Lost Media for a little while, due to _the funny_. I mentioned _the funny_ a few times before, and I have to get around to putting it on my blog.

I should really write a post about my Miiverse """"hacking"""" saga, then properly organize and host all of the dumps I have released and ones that I haven't released before either (due to having credentials, etc. that should be removed). Until then, enjoy these.

- [https://mii-unsecure.ariankordi.net/assets/2019-01-23-archive.ariankordi.net-just-aarch.7z](https://mii-unsecure.ariankordi.net/assets/2019-01-23-archive.ariankordi.net-just-aarch.7z "https://mii-unsecure.ariankordi.net/assets/2019-01-23-archive.ariankordi.net-just-aarch.7z")
- [https://mii-unsecure.ariankordi.net/assets/2026-05-27-arian-fiddler-arc-decompress3.7z](https://mii-unsecure.ariankordi.net/assets/2026-05-27-arian-fiddler-arc-decompress3.7z "https://mii-unsecure.ariankordi.net/assets/2026-05-27-arian-fiddler-arc-decompress3.7z")

_Also: [Project Rosé](https://www.bing.com/ck/a?!&&p=b0d33a267388b8d9d63dc744fecacef86d1a769755f8b521b9fc276cc1dd1739JmltdHM9MTc3MTAyNzIwMA&ptn=3&ver=2&hsh=4&fclid=3b4f54c6-d358-6b60-0cf8-40cad24a6adc&u=a1aHR0cHM6Ly9naXRodWIuY29tL1Byb2plY3QtUm9zZS8&ntb=1)'s Miiverse clone was entirely made with these, lol. Lol_

#### ariankordi.net/cert/

Hosted 3DS/Wii U/Wii era client certificates for accessing Miiverse or the Wii Shop Channel on a PC. These were rehosted on GitHub at [larsenv/NintendoCerts](https://github.com/larsenv/NintendoCerts), or Larsen's site: [https://certs.larsenv.xyz/](https://certs.larsenv.xyz/)

#### ariankordi.net/tutorial/

This was a prehistoric tutorial showing you how to use 3DS or Wii U Miiverse on your PC. It is obviously obsolete, but a little bit of it should [be on web.archive.org](https://web.archive.org/web/20171108071722/https://ariankordi.net/tutorial/miiverse/), if you, um. "Want"

#### Umi! / Nico!

This web app for watching Crunchyroll content together is no longer hosted by me, as it stopped working and Crunchyroll requires Premium to watch most of their content now anyway. Sorry, Murilo.
