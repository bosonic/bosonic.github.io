{
  title: "FAQ",
  category: "documentation",
  section: "Getting started",
  order: 4
}

# FAQ

## Why Bosonic?

When the initial Web Components spec draft was released, I ([@goldoraf](https://twitter.com/goldoraf/)) was immediately sold. At that time, my team and I were developing Single-Page Apps for two years and we used different JS frameworks in our quest of the perfect stack. The end result was I had many times recoded the same basic UI elements in order to adapt them to these various frameworks. I became convinced there should have a better way, and that way was Web Components.

[Polymer](https://www.polymer-project.org/) and [x-tag](http://www.x-tags.org/) were soon released, and I began to experiment with them. I rejected Polymer almost immediately: it was too feature-rich for me (two-way data binding was a no-go, for instance) and its elements were not too useful for our use cases. I want to thank here the Polymer authors for their awesome work, though: without them, we wouldn't have all these fantastic polyfills to work with! So my team began to implement some elements using x-tag, and soon discovered that building the elements' DOM manually was cumbersome (x-tag doesn't use the `<template>` element nor Shadow DOM). I then decided to build my own tool, with the aim of being lighter than Polymer yet feature-richer than x-tag, and after many doubts and rewrites, Bosonic was born.

## Why the "reboot"?

There have been a long hiatus between Bosonic's initial release and this "refresh". There are many reasons for that.

First, I've been surprised by the lack of feedback from the community. It took me a long time and many conversations during conferences, meetups and other events to begin to understand why. Basically, a lot of people were confused and didn't "get" Web Components the same way I did: they believed that Web Components were proposed as a standard way for building complete apps with only Web Components and vanilla JS. I personally believe Web Components are ideal for low-level, "standard", reusable UI elements like dialogs, tabs or dropdowns, and that they should be combined with a more powerful library or framework like React, Angular or Ember in order to develop a complete application.

Some people found that working with Bosonic was too complicated: the necessity of a build step was an obstacle for some to even try Bosonic. My will of IE9 support and awesome performance is the main culprit here: I saw that build step as a necessary evil in order to achieve these goals.

It's hard to stay motivated when you put a lot of hours into a project you believe into, and don't get much feedback. It's even harder when health issues (not life-threatening, but very painful) and professional difficulties get in the mix.

A few months ago, with these personal issues resolved, I began to think about what to do with Bosonic. Polymer 1.0 and its Material Design had been released, and I found the paper elements mostly useless for my team (again, Polymer people, you did an awesome job, but it's just not for everyone). x-tag hadn't moved at all, so I thought there was still an opportunity for Bosonic because I still thought that Web Components were important.

I then realized two things: 
- I needed to simplify Bosonic a lot: no more mandatory build step, even if it meant to drop IE9 support for a time ;
- I needed to reformulate my value proposition: in short, I wanted Bosonic to be like Bootstrap ported to Web Components, i.e. a library of everyday UI elements, and much less a library for building Web Components.

Hence the reboot :-)

## What do you plan next?

Lot of things.

- Get IE9 (and other older browsers) support back: it'll involve a build step, but it'll be optional and shouldn't block people to try Bosonic ;
- Release a build tool for elements concatenation & CSS Variables post-processing ;
- Refactor some elements' code into mixins applicable to all elements, not just custom elements: I found out working on Bosonic that what should be simple tasks can get really complicated when using DOM. In some ways, I miss jQuery sometimes :p ;
- Work on elements a11y: I tried to implement a11y as best as I could, but I need testers and feedback to be sure it works fine ;
- And of course : more elements!

