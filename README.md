#Odette.js
A fully featured set of tools to get your scripts and pipelines up, running, tested, and finished quickly. By decoupling views from models, like backbone, js based directives, and the ability to handle multiple versions as well as multiple windows, Odette is the only framework that makes sense to use in today's integrated web landscape. Odette empowers you to monotize your content by creating your own framework and carving out space for anyone to fill, all while letting you elegantly manage your own site, events, and data in a single, unified way. When everyone is on the same page, the whole web can move forward together. Odette has learned from many other ways of thinking, and eventually, came up with her own.

Backbone was ok.
It's models and change events were done fairly well, but collections do not make any sense. Limiting what you can add to a list is simply not feasable for the problems that need to be solved and subsequently managed. As soon as any complexity is added to backbone the argument for it falls to pieces. There is no flexibility in Backbone, and as far as Odette is concerned, the body of Backbone has rigor mortis and needs to be buried.

Angular does not compute.
From complex setup to logic in the html, angular does not make sense to anyone who loves and really understands javascript at its root. The code is no longer beautiful, and Mutation Observers allow for little to no privacy or backtracking and should be implemented as needed rather than always. As a purist and minimalist, Odette does not need mutation observers, and is not limited to 2000 watchers.

jQuery == bloat
jQuery was once good for one thing, and that was dom manipulation and events. Now you can pull content in using Ajax, create animation sequences, and even create mediocre promises (oh boy!). It makes me sad to say this because I, like many of you started learning javascript through jQuery, but at the end of the day it really should have stuck to cross browser dom manipulation and events instead of feature chasing.

Backbone based Frameworks don't work
Certain frameworks tried to alleviate the shortcomings of backbone, by providing tooling for "robust views". This only served to empower the single track understanding of how views could be treated. By providing fancy ways to get up and running without js (ember) or by providing (poorly implemented) "modules" and an application object to wrap up the brown flaming dog poo bag. Please. Don't leave that poo on my doorstep.

Odette doesn't do features. Odette provides you with a cross platform, cross browser, cross window abstraction to your site management needs. Use green sock if you want crazy animation. Use Sizzle if you need to select something no one else would. Use raphael if you need some heavy svg manipulation. Use d3 if you want awesome graphs. But use Odette to make it all happen seamlessly. We will never provide fixed boxes, but rather solutions to "n".