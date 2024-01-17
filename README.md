# Jeff Nordlund Code Exercise

For the coding exercise I decided to take a swing at the intersection implementation.  It seemed 
a bit more interesting.

I probably spent a little more then 4 hours on this, spread out over a few days because of weekend 
stuff.  I try to finish what I start so I'm not worried about giving a little extra time, even if 
we don't move forward in the interview process.


## How to run
Open the zip and then open the index.html file in your favorite web browser -- as long as your 
favorite browser isn't Internet Explorer.  This has been tested in Edge and Safari so should also be 
good in Chrome and Firefox.


## Design thoughts
Really just wanted to keep it simple and focus on implementing the basic features.

I used basic html/javascript/css instead of React because I haven't coded consistently in React for almost 
2 years now and didn't want to spend the time re-learning (googling) how to do various things in React.  But 
I am looking forward to working in React again in my next job.

I limited the run time for this to 102 cars -- so roughly 2 minutes.  That should give a good enough 
sample to prove out the concept.

You'll also notice there are only 7 lanes instead of the 8 the exercise description called for.  In 
real life the left turn lanes in intersections are directly across from each other so I made the call 
to lay things out in that manner.  Obviously I cleared that decision with Product :)


## Code Layout
- index.html
- main.css
- javascript folder
    - intersection.js -- main controller
    - models -- contains the javascript classes



### Issues
Sometimes the cars will "stick".  My guess is this has to do with the number of intervals running at the same time when too many cars are active.  If I had more time I'd probably look into switching the car movements from brute-force positioning to CSS transitions or something that handles animations better.

To clear the "sticking" just click on the page and that seems to unclog it.

The sticking can also lead to some cars parking on top of each other.
