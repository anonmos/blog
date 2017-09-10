#On Static Blogging: Part 1

When I set out to create a blog, I wanted to find a platform where I the ability to _really_ tinker.  After reviewing a few, 
I decided to write my own, mostly because I'm a sucker for over-engineering my side projects as a vehicle for learning.

I had a couple of loose goals for this:
- Be completely static (no "back-end")
- Simplicity (emphasis on _loose goals_)
- Easy to deploy
- Use a technology or three that I haven't worked with extensively
- Open source the whole thing!

The site you're visiting now, and the post that you're reading, is the first evolution of that effort.  This first series
of posts will detail how I set this all up, and how the underlying code repository for this blog works

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
![aws console][]

While this _may_ seem a bit daunting with all of the [different AWS products](http://awskids.club/) that are available, 
they do a pretty nice job of making everything searchable.  Click the "Search" bar at the top, and type `S3`.  The click
on `S3` within the dropdown of results.

To add a sort of taxonomy to your files, AWS requires you to create a "bucket" to store your files.

  

[aws console]: https://assets.timgrowney.com/post-content/aws-console.png