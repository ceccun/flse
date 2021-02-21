# FLSE
Live Demo: [FLSE](https://stella.hs.vc/ejaz)

## Getting Started
**Should I add FLSE remotely or download it locally?**

There are both benefits and downsides to grabbing FLSE remotely and downloading it to your server.

Reasons to add remotely:
* You will get the latest features of FLSE with no extra hastle
* Important bugs can be fixed without any interaction from you

Reasons to add locally:
* In the event FLSE's host goes offline, your site will continue to operate normally
* You can tweak FLSE to your liking

Because of the two very different situations, we recommend you pick option would be best for you.

### Adding remotely
Get Started by adding this to the bottom of your HTML document.

    <script src="https://cdn.jsdelivr.net/gh/stel-la/flse/flse.min.js"></script>

This is the production version of FLSE, in most cases it is fine for development, however if you do need to edit the engine directly, you may need to use the local approach.
Then you can use `<flsemobilehide>` to hide objects on mobile and `<flsemobileonly>` to show objects on mobile only.
### Adding locally
Download the latest release of FLSE and place it somewhere such as /js/flse and link it as a script in your HTML document. In this case we stored FLSE at /js/flse/flse.js, so our script would look like this:
```
<script src="/js/flse/flse.js"></script> 
```
Please note that storing FLSE locally means you won't always have the latest version and therefore features, so we recommend you update your FLSE file every so often.
Head over to the Wiki to learn about more features.
