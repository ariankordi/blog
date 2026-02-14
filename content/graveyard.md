---
title: ariankordi.net Graveyard
date: 2026-02-14T17:18:00-05:00
sitemap:
  disable: true
robots: noindex
---

This page is for URLs I used to host but no longer exist. My 404 page redirects you here if you reached one.

## ariankordi.net/mii/, ariankordi.net/seth/, pf2m.com/hash/

All of these URLs took an NNID to get a "Mii hash" that allowed you to use the same Mii images that Miiverse did, using the same user ID people used on Miiverse, all with Miiverse clones in mind.

For example, it would give you **2efa39n1gq3r2** to be used in the URL [https://mii-secure.cdn.nintendo.net/2efa39n1gq3r2_normal_face.png](https://s3.us-east-1.amazonaws.com/mii-images.account.nintendo.net/2efa39n1gq3r2_normal_face.png) then multiple expressions and whole_body can be used.

##### Alternative

Nintendo shut down the endpoint this used to work in May 2024 (no, not April when game servers shut down). Between that and the fact that NNIDs made on 3DS/Wii U consoles aren't exactly the best way to get your Mii data anymore, this simply won't work the way it used to.

Ideally for things like Miiverse clones or whatever sh\*tty services you want a Mii image for, you'd want to accept other forms of Mii input, such as QR codes or amiibo (usable with the Switch). Something like the input selection on [mii-unsecure.ariankordi.net](https://mii-unsecure.ariankordi.net) would be good. In the future, having a simple and lightweight Mii editor embeddable directly on the website would be fantastic.

![](/uploads/20260214-173656.png)

If you really do want to use NNIDs (or Pretendo PNIDs), my API is usable for this but won't work in exactly the same way. There is documentation on my [Swagger](https://mii-unsecure.ariankordi.net/swagger/index.html#/) page, and I have patched Cl\*sed.p\*zza to support this, so that's probably the best reference if you are 9 years old and want to fix Mii support in your Miiverse clone:

- [Fetch and render NNIDs from mii-unsecure.ariankordi.net instead of fr… · ariankordi/closedverse@173f8e0](https://github.com/ariankordi/closedverse/commit/173f8e05a481f2b01b2f37c5241e10332bc6a507)
- If you want PNID support, take the commit above and replace
    - `?nnid=` with `?api_id=1&nnid=`
    - `/mii_data/` with `/mii_data/?api_id=1&nnid=`
    - Change all wording of Nintendo Network ID to Pretendo Network ID

## Others

These are for pages that are irrelevant, or already replaced with a static redirect. Those I can redirect, but I can't redirect wildcards on GitHub Pages.

#### ariankordi.net/aarch/

My various Miiverse archives and HTTP dumps used to be hosted here, the **A**rian **Arch**ive. These actually became _Lost Media_ for a little while, due to the funny. I mentioned the funny a few times before, and I have to get around to putting it on my blog.

I should really write a post about my Miiverse """"hacking"""" saga, then properly organize and host all of the dumps I have released and ones that I haven't released before either (due to having credentials, etc. that should be removed). Until then, enjoy these.

- [https://mii-unsecure.ariankordi.net/assets/2019-01-23-archive.ariankordi.net-just-aarch.7z](https://mii-unsecure.ariankordi.net/assets/2019-01-23-archive.ariankordi.net-just-aarch.7z "https://mii-unsecure.ariankordi.net/assets/2019-01-23-archive.ariankordi.net-just-aarch.7z")
- [https://mii-unsecure.ariankordi.net/assets/2017-12-27-arian-fiddler-arc.zip](https://mii-unsecure.ariankordi.net/assets/2017-12-27-arian-fiddler-arc.zip "https://mii-unsecure.ariankordi.net/assets/2017-12-27-arian-fiddler-arc.zip")

_Also: [Project Rosé](https://www.bing.com/ck/a?!&&p=b0d33a267388b8d9d63dc744fecacef86d1a769755f8b521b9fc276cc1dd1739JmltdHM9MTc3MTAyNzIwMA&ptn=3&ver=2&hsh=4&fclid=3b4f54c6-d358-6b60-0cf8-40cad24a6adc&u=a1aHR0cHM6Ly9naXRodWIuY29tL1Byb2plY3QtUm9zZS8&ntb=1)'s Miiverse clone was entirely made with these, lol. Lol_

#### ariankordi.net/cert/

Hosted 3DS/Wii U/Wii era client certificates for accessing Miiverse or the Wii Shop Channel on a PC. Pretty irrelevant now.

This was rehosted on GitHub at [larsenv/NintendoCerts](https://github.com/larsenv/NintendoCerts), or Larsen's site: [https://certs.larsenv.xyz/](https://certs.larsenv.xyz/)

#### ariankordi.net/tutorial/

This was a prehistoric tutorial showing you how to use 3DS or Wii U Miiverse on your PC. It is obviously obsolete, but a little bit of it should [be on web.archive.org](https://web.archive.org/web/20171108071722/https://ariankordi.net/tutorial/miiverse/), if you, um. "Want"

#### Umi! / Nico!

This web app for watching Crunchyroll content together is no longer hosted by me, as it stopped working and Crunchyroll requires Premium to watch most of their content now anyway. Sorry, Murilo.
