---
title: about mii-unsecure being mii-unreliable
date: 2026-04-29T23:00:00-04:00
draft: false
linkTitle: mii-unreliable.ariankordi.net
---

today i had to go to some bullsh*t convention for work. was it nice? a little bit. was it worth it? not really. it was over before i knew it, and i was soon on an hour and 30 minute drive home.

when i finally got there, all i wanted to do was just lie down and decompose. then i see a bunch of messages notifying me of the unavoidable.

![April 29, 2026](/uploads/2026-04-29-mii-unreliable/509FDCB9-A236-4122-A6F9-BA01F8BEE192.jpg "450px")
![April 29, 2026](/uploads/2026-04-29-mii-unreliable/C0D163D7-3AEC-4777-8969-72B107EF8D3B.jpg "450px")

what now?

## piece of sh*t website goes down unprovoked
there's not a single thing i did to the server before i left that caused this. what could have possibly happened for the server to go down while i was an hour away from home?

after the dust settled and i came home with the knowledge that i needed to fix this, i had a look.
* machine was totally unreachable on the local network.
* the computer was definitely still on (monitor said so), no ethernet.

no problem, right? just reconnect it...?

* still wasn't responding after reconnecting it.
* the [Intel Active Management Technology](https://en.wikipedia.org/wiki/Intel_Active_Management_Technology) was also not responding, even though **i thought it would work when the operating system is down**

at this point, i wasn't restarting it. no f*cking way. what other option do i have?

## unplugging the router makes everything worse
all i did was pull the power and plug it back in. a minute later, and something went wrong. i get the dreaded text:
![What happened to the Internet?](/uploads/2026-04-29-mii-unreliable/0197F712-759A-4044-A761-D56064C83CAD.jpeg "500px")

guess what? it just reset _ALL INTERNET SETTINGS_. so not only did i have to fix my server that still doesn’t work, but also had to manually redo all router settings.

wi-fi, guest networks, port forwarding, static dhcp, firewall... 😐😐😐😐😐😐😐😐

### fixing it all, then it strikes back
router settings got (reluctantly) fixed, reboot and get situated.

it works for a moment, then minutes later david says it's down again.
![@arian cloudflare being STINKY](/uploads/2026-04-29-mii-unreliable/01FD0742-BEAD-4BD2-91E9-05392E83D479.png "450px")
what happened? to put it simply, we had the wrong ip forwarded. so now we change it to the correct ip, right?

on top of the GAYT&T router interface being an extremely slow (*~15s page load*), inconvenient (*have to keep entering password*), and unintuitive (*over complicated "service" forwarding*) piece of f%}}*%cking sh\*t that has been the exact same for a decade, has never been fixed, and will never be fixed…

… on top of all that, it lists my server at least THREE TIMES?!
![Application Hosting Entry](/uploads/2026-04-29-mii-unreliable/4E10849A-A1A7-47CE-BF2A-FA0B6BA14EDF.jpg "550px")
that’s right, you don’t get to choose an IP or even MAC address. just duplicated hostnames it chooses for you.

the ONLY way i got around this was by using the mac address of each option inside the html form

## every reason this shouldn’t have happened
allow me to break this down into whose "faults" these are.

### the machine
* why would ethernet stop working while the rest of the system and the router are still working?
* why doesn’t Intel AMT let me remote in during this situation? if it isn’t that resilient… what is it useful for?!
### at&t router
* the router should never reset settings after being power cycled. that’s stupid
* why the *f\*ck* can’t i back up/restore settings?!
* why does it not display the ip or mac address while port forwarding?
### my whole system
oy vey…
* i couldn't reboot without manual labor, because i still haven't configured all mii services to start at boot.
    * i think this was because mysql was being fussy about starting up last i played with this
* it only runs on my home server behind my residential internet, georgia power, and not on a reliable system (e.g., a cloud).
    * the choice of a local pc was for performance, but with severe reliability consequences
    * i planned to have a backup cloud server as [early as november 2024](https://github.com/ariankordi/nwf-mii-cemu-toy/blob/c0874c5f9226494a2ba4dee7497920bb3c989888/views/index.html#L173-L182), and never went through with it

### myself
how is this MY fault that we got into a place we should've never stumbled in to begin with?

* not investing time to prevent outages
    * seen throughout: a more reliable machine, avoiding port forwarding, fixing auto-start on my existing server.
    * most important in this category though, is not setting up an automatic failure solution. i'm 100% capable, just gotta do it.
* not having a solution ready to avoid the server altogether
    * this gets more complex, however i've known about this need since the very beginning.
    * i had attempts going back to 2024 ([august](https://x.com/aaaarrrriaaannn/status/1828321049508790436/photo/1), [october](https://github.com/ariankordi/FFL-Testing/commit/e93c7fc69584c065d1b985235518dda094c4972f)) to refine and use the server *as it is* in enviroments such as the browser (not ffl.js)
* (maybe:) not nudging people to be self-reliant
    * if i really wanted everyone to not rely on me for important stuff, would it have been worth adding limits to encourage this?
    * while this is seen as restrictive, the intent is that big users need to rehost.
        * i don't see any scenario where they aren't benefitted by doing that (if they already run a service).
        * the code is, and always will be, open
    * maybe i would've received more feedback or even contributions to improve my existing process if i did this too.
        * in my experience, most people i've come across would rather redo the entire thing (usually poorly) than contribute back.
        * (because i'm in the process of a rewrite right now, any feedback still helps for the new version!!!!!)
        * side note: **i didn't realize until recently** that i **forgot to enable github issues** for the ffl-testing server :( sorry about that, it has them now.

### one of my biggest issues: not simply IMPROVING stuff RIGHT NOW
what i've done a lot over the past two years is to picture a fancy rewrite/successor, and use the idea of that as an excuse to not fix current problems, yet still not working on the successor.

for each flaw that may take an hour or two to fix, it's blown up into spending 10 hours each, yet i still don't invest the time.

just yesterday, i wrote an [FAQ](https://ariankordi.net/mii-faq/) for the website with common issues ive spent hours diagnosing for people. when i realized the page took less than an hour to make, it made me so angry i put it off for so long

...

have you heard enough yet? 😀

## what you should expect from me now
i don't want you to trust or rely on me. well... i mean, not that you shouldn't 😅.. please do.. no one ever does :(

to rephrase that, i want to make it so that you *don't have to* rely on me to keep running a simple service. it's great when everybody can stand on their own. right?

i know that FFL-Testing has always been a mess. but.
* there was a big change in january that should've made it easier to run: [Use GLHeadless and em-inflate instead of GLFW and zlib for easier setup and window-less operation](https://github.com/ariankordi/FFL-Testing/commit/9b08b6694b748456c2e565e952e67963ad63c478)
* there is a [docker-compose.yml](https://github.com/ariankordi/FFL-Testing/blob/renderer-server-prototype/docker-compose.yml) file so that you can containerize.
    * **NOTE**: it needs FFLResHigh.dat in the current directory in order to build properly. sorry, didn't really document this.
* please at least *just try* building it. open up an issue. move forward
    * even if you think it's 10000% "your fault", open it. if i can't fix your problem right now, at least give me the grace of knowing that it happened. i want to make it as easy as possible in the future
* finally, i'm actively working on fixing the server.

i've been developing the replacement *right now*, in april. it is happening. do i have anything to show for it other than this vague overview of commits/files?... no.
![Pasted Graphic 4.jpg](/uploads/2026-04-29-mii-unreliable/998B0917-2CDB-4234-B0D4-93158851D366.jpg "650px")
it does feel like no less than the 5th time i have written a program that spins around a mii head model, so i don't want to say or promise too much before it is fully ready and in your hands. right now, i am confident with this path. stay tuned.
