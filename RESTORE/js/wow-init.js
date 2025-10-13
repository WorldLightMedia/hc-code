{# This file ensures WoW init is called only once, and only if wow.js is actually being used on a page,
 # this file is used by custom modules requiring wow.js, HS's combiner and minifier prevents this from 
 # being called multiple times #}
new WOW().init();