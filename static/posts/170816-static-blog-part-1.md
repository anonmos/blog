#On Static Blogging: Part 1

When I set out to create a blog, I wanted to find a platform where had I the ability to _really_ tinker.  After reviewing a few, 
I decided to write my own, mostly because I'm a sucker for over-engineering my side projects as a vehicle for learning.

I had a couple of loose goals for this:
- Be completely static (no "back-end")
- Simplicity (emphasis on _loose goals_)
- Easy to deploy
- Use a technology or three that I haven't worked with extensively
- Open source the whole thing!

The site you're visiting now, and the post that you're reading, is the first evolution of that effort.  This first series
of posts will detail how I set this all up, and how the underlying code repository for this blog works

By the time you're finished with this post, you should be able to visit `www.yourvanitywebsite.com`, where 
`yourvanitywebsite` is your domain, and have it present you with `Hello World!`.

##Be Completely Static
This first post describes how I set about accomplishing the goal of making the site static.

A lot of other solutions have a "back end".  This is usually some virtual server that acts as service for compiling a bunch of
static markup, Javascript, and stylesheets with some other sort of database of content to weave together an experience
that doesn't require the blogger to also be a developer.  But if you're willing to get your hands dirty, it's really not that difficult to build
your own project _without_ a back end.  To do this, you need to do a few things:
- Keep in mind that _everything_ is browser based.
- Find a place that is built to serve "static" (e.g. unchanging or non-dynamic) content
- Manage the content (posts) via files and Javascript trickery

There are a host of different solutions that are optimized and priced specifically for serving static content.  [Github Pages](https://pages.github.com/) 
are a beautiful solution for this.  But because I'm trying to make sure my understanding of AWS is second nature, 
I opted for a static site hosted on S3 and backed by CloudFront.

###Setup
To build the skeleton for serving a static site, we'll need to walk through a few steps:
- [Configure an S3 bucket](http://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html) to serve static content
- Buy your domain name and configure e-mail forwarding
- [Create an SSL/TLS certificate](https://aws.amazon.com/certificate-manager/) with AWS Certificate Manager 
- [Configure an Amazon CloudFront instance](https://aws.amazon.com/cloudfront/) to serve static content from the S3 bucket
- Add a CNAME record to your DNS provider that points to your CloudFront URL

###Configuring your S3 Bucket
Think of the Amazon Web Services' [S3 (Simple Storage Bucket) product](https://aws.amazon.com/s3/) as a place where you can store files. 
It's like DropBox or Google Drive, but built specifically for storing files at Enterprise level scale, with all of the
tools necessary to do just that.

Head on over to [AWS](https://aws.amazon.com/) and set up an account.  Once you've done that, you should be greeted with
a page that looks like this:

![aws console](https://assets.timgrowney.com/post-content/aws-console.png =90%x* "Initial AWS Console")


While this _may_ seem a bit daunting with all of the [different AWS products](http://awskids.club/) that are available, 
they do a pretty nice job of making everything searchable.  Click the "Search" bar at the top, and type `S3`.  The click
on `S3` within the dropdown of results.

To add a sort of taxonomy to your files, AWS requires you to create a "bucket" to store everything.  Click the `Create Bucket`
button, set the name to `www.yourvanitywebsite.com` (where `yourvanitywebsite` is your _actual_ domain name), set the region
to `US West N. California`, and click next.

![aws bucket creation step one](https://assets.timgrowney.com/post-content/aws-bucket-step-one.png =90%x* "Creating an S3 Bucket Step 1")


Click next to skip the `Set Properties` step.  On step 3, we'll want to change the `Manage public permissions` section to
be `Grant public read access to this bucket`, then leave the `Manage system permissions` section alone.  Click next.  On
Step 4, click `Create Bucket`.

![aws bucket creation step three](https://assets.timgrowney.com/post-content/aws-bucket-step-three.png =90%x* "Creating an S3 Bucket Step 2")


This should drop you back to the S3 main console with your shiny new bucket.

Next, let's set up your bucket to serve static content.  Click your newly created bucket, then in the menu at the top,
select "Properties", then click on the square that says `Static website hosting`.  Click the radio button that says
`Use this bucket to host a website`.  Set the `Index document` field to `home.html` and the `Error document` field to 
`error.html`.  Then click Save.

![aws bucket static config](https://assets.timgrowney.com/post-content/aws-bucket-static-content.png =90%x* "Serving Static Content")

Your website should now be serving pages!  But you don't have a page there yet, so let's take care of that.

Create an empty text file on your desktop called `home.html` and put `Hello World!` in it.  Create another file on your
desktop called `error.html`, and put `Goodbye Cruel World!` in it.

Navigate back to your new bucket's main panel by clicking the `Overview` top menu option, click the `Upload` button, 
select the HTML files from your desktop, and click the Next button.  On the `Set Permissions` step, again set the `Manage
public permissions` to `Grant public read access to this object(s)`.  Click Next twice to skip to Step 4, then Upload.

You should now be able to visit your vanity bucket at [http://www.yourvanitywebsite.com.s3-website-us-west-1.amazonaws.com](http://www.yourvanitywebsite.com.s3-website-us-west-1.amazonaws.com)
and see `Hello World!`!  Visiting `/anythingelse.html` should result in a `Goodbye Cruel World!` result.

To Recap, here's what we just did:
- Created a new bucket on AWS' US West Northern California region
- Set the bucket to serve static content
- Gave it some static content to serve!

###Buying Domains and Configuring Email Forwarding
There are a lot of places where you can buy your domain name, set up DNS settings, and configure e-mail forwarding.  I'm
personally a fan of [Google Domains](https://domains.google/#/), primarily out of familiarity.  So this blog will focus
on instructions for using that.

Email forward will be important for creating your SSL/TLS certificate, as AWS will send a confirmation e-mail to be sure
that you actually own the domain.

Visit Google Domains and go ahead and purchase your vanity domain (if possible, make it a .com, CloudFront has some 
weirdness around other domains that is out of scope of this post and will require some Googling).  

Google Domains should drop you on the Domain Management page.  You should see your domain, with an envelope icon.
Click the envelope to configure e-mail forwarding.

In the e-mail forwarding section, add an `*` in the first input box, and your e-mail address in the second input box, 
then click `Add`.  
_Note:  This will forward EVERYTHING that gets e-mailed to @yourdomain.com to your e-mail address. 
This does potentially leave you open to being spammed. If you want to narrow this down, use `admin` instead of *_

![email forwarding config](https://assets.timgrowney.com/post-content/email-forwarding.png =90%x* "Forwarding Domain Emails")

###Creating an SSL/TLS Certificate
Google has taken a [pretty strong stand](https://webmasters.googleblog.com/2014/08/https-as-ranking-signal.html) when it
comes to ranking websites and security.  If you want to give it the best chance for success, we'll need to set up
an SSL/TLS certificate in order to enable `https`.  Using the AWS Certificate Manager product will allow AWS to do most
of the heavy lifting, free of charge, and get rid of pesky details like making sure your certificates are always up to date.

In the main AWS console, search for Certificate Manager, and select it from the dropdown.  Once you're on the Certificate
Manager, click `Request a certificate`.  In the `Domain name` box, type `*.yourvanitywebsite.com` 
(again, where _`yourvanitywebsite`_ is your domain).  Click the Review and request button, then on the subsequent page, 
the Confirm and request button.

Watch your inbox, you should have an e-mail that will ask you to confirm your ownership of that domain.  Once you
confirm ownership, you will be able to use this certificate across most of AWS' services.

![ssl tls config](https://assets.timgrowney.com/post-content/ssl-tls-config.png =90%x* "Forwarding Domain Emails")

###Configure an AWS CloudFront Instance
CloudFront is the AWS Content Delivery Network (CDN) product. Think of it as an analog to a water heater.  If you had to
wait for water to flow from your public water supply, heat up, then be delivered to your shower, you'd be waiting a
frustrating amount of time.  With the introduction of a water heater, you have a giant tank that heats your water, and
keeps it ready for on-demand use.  A CDN collects your `index.html` from S3 and holds it in memory, ready to serve at
a moment's notice.  

[S3 is _okay_](https://deliciousbrains.com/shouldnt-serve-assets-s3/) at storing and serving content from a single 
region.  But it isn't distributed, so someone from the east coast of the continental United States requesting data from your west coast 
S3 bucket will likely experience longer load times.  CloudFront spreads your content across the United States 
(and optionally, the world) in order to keep it ready to serve to anyone at any time.  CloudFront also comes with the 
added benefit of being able to do request redirects to use HTTPS instead of HTTP, just in case someone tries to visit 
your website without using SSL.

To configure CloudFront, go back to your main AWS Console and search for CloudFront.  Select it from the dropdown.  Click
the Create Distribution button.  We'll want to select "Get Started" under the `Web` option on the next screen.

![select delivery method](https://assets.timgrowney.com/post-content/select-delivery-method.png =90%x* "Selecting a Delivery Method")

Because we're using an S3 bucket configured as a static site, the `Origin Domain Name` won't _quite_ match anything from
the dropdown.  Set the `Origin Domain Name` to `www.yourvanitywebsite.com.s3-website-us-west-1.amazonaws.com`.  Leave
`Origin Path` blank, and `Origin ID` as its default pre-filled content.  Leave `Origin Custom Headers` blank as well.
This configures the CloudFront instance to pull from your S3 bucket.

![origin settings section](https://assets.timgrowney.com/post-content/origin-settings.png =90%x* "Configuring Origin Settings")

Under `Default Cache Behavior Settings`, set the `Viewer Protocol Policy` to `Redirect HTTP to HTTPS`, and 
`Allowed HTTP Methods` to `GET, HEAD, OPTIONS`.  Under `Cached HTTP Methods`, check the box that appeared that says 
`OPTIONS`.  Leave the rest of the options under this section as they are.  This forces your CloudFront instance to 
forward all HTTP traffic to HTTPS, and allows your browser to make a pre-flight `OPTIONS` request as well.

![default cache behavior section](https://assets.timgrowney.com/post-content/default-cache-behavior.png =90%x* "Configuring Default Cache Behavior")

Under `Distribution Settings`, set the `Alternate Domain Names (CNAMEs)` setting to `www.yourvanitywebsite.com`.  Then
set `SSL Certificate` to `Custom SSL Certificate`, then from the dropdown select the SSL certificate that you created in
the SSL/TLS Certificate section of this post.  Leave the rest of the options the same.  

This section configures your CloudFront instance to work with your custom domain name (you'll be assigned a random CloudFront URL in a moment that
you can visit, in lieu of that).  The custom SSL certificate attaches the certificate that you created earlier to this
CloudFront distribution, enabling users to be able to use `HTTPS`, encrypting their traffic.
_Note:  The picture says *.timgrowney.com because it's pulling from my settings.  Yours will have your domain in it._

![distribution settings section](https://assets.timgrowney.com/post-content/distribution-settings.png =90%x* "Configuring Distribution Settings")

Click Create Distribution at the bottom of the page.  You should be returned back to the main CloudFront console, where
you should now have an entry for your new distribution.  The `Domain Name` column should have a URL that you can visit 
(usually of the format randomstringofstuff.cloudfront.net), which should serve `Hello World!` to your browser once the 
distribution has finished provisioning.  This will take anywhere from 10-30 minutes.

![configuration complete](https://assets.timgrowney.com/post-content/cloudfront-config-complete.png =90%x* "Configuring Distribution Settings")

###Attaching Your Domain Name to CloudFront
The final step is to attach your domain name to your CloudFront URL.  This way, your visitors can hit
`www.yourvanitywebsite.com`, which forwards to CloudFront, which grabs content from your S3 bucket, then returns it back
to your users.

Go back to your Google Domains console, then select the icon next to your domain that represents your DNS Configuration.

![dns configuration](https://assets.timgrowney.com/post-content/dns-configuration.png =90%x* "Configuring DNS Settings")

Under the `Synthetic Records` section, leave the dropdown as `Subdomain forward`, then put an `@` in the `Subdomain`
input field.  For the `Destination URL` field, put `www.yourvanitywebsite.com`.  Select the radio button that says 
`Permanent Redirect (301)` and select the radio button that says `Forward Path`.  This allows someone to type 
`yourvanitywebsite.com` in their URL bar, which then will forward them to `http://www.yourvanitywebsite.com`, which will
then get redirected to `https://www.yourvanitywebsite.com` on the CloudFront side.

![synthetic records configuration](https://assets.timgrowney.com/post-content/synthetic-records-configuration.png =90%x* "Synthetic Records Configuration")

Under the `Custom resource records` section, type `www` in the `@` input, change the dropdown to `CNAME`, type `1H` in the
`1H` input, and set the `Domain Name` input to the CloudFront Distribution URL from the prior section.  This digitally
attaches `www.yourvanitywebsite.com` to the CloudFront distribution, allowing people to make requests from `www.yourvanitywebsite.com`
to see `Hello World!`

![custom resource records configuration](https://assets.timgrowney.com/post-content/custom-resource-records-configuration.png =90%x* "Custom Resource Records Configuration")

_Note: The image above shows a couple of additional entries for the custom resource records.  You don't need these, I
just like to have a non-production version of my work where I can test, and a place to store assets that both non-production
and production can look at for assets._

###Complete!
Congratulations!  You should now be able to visit `www.yourvanitywebsite.com` and see `Hello World!`.  Play around with
that file and adding additional HTML files to make a functional website.

_Note: CloudFront caches your content.  If you make a change to `home.html`, you'll have to go to the `Invalidations`
section of your CloudFront distribution, and invalidate `*` in order to see changes._

 

 
