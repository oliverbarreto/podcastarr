# iTunes XML Feed

For creating podcast RSS/XML feeds compatible with iTunes, there are several good options. Let me recommend the best one.

## podcast

This is one of the most modern and well-maintained libraries specifically designed for podcast feeds:

Resources:

- https://www.npmjs.com/package/podcast
- https://github.com/maxnowack/node-podcast

Install the library:
`npm i podcast`

## Recommendation

I would recommend using podcast-feed-builder because:

- It's more modern and actively maintained
- Has better TypeScript support
- Follows current iTunes podcast feed specifications
- Has better validation for required fields
- Produces cleaner, more compliant XML
- Has better documentation and examples

## Implementation Example for Your Project

Here's how you could implement it in your NextJS project:

- Create a service to generate the XML feed called `podcastFeed.tsx`
- Then you can use it in your API route:
- This will create a valid iTunes podcast feed at /api/feed that you can submit to iTunes. Make sure your feed URL is accessible via HTTPS as iTunes requires secure feeds.

---

# Documentation

Podcast RSS for Node Build Status Greenkeeper badge
Fast and simple Podcast RSS generator/builder for Node projects. Supports enclosures and GeoRSS.

## Install

`$ npm install podcast`

## Usage

### Create a new feed:

```typescript
import { Podcast } from "podcast"

const feed = new Podcast(feedOptions)
```

### Feed Options

- feedOptions
- title string Title of your site or feed
- description optional string A short description of the feed.
- generator optional string Feed generator.
- feedUrl url string Url to the rss feed.
- siteUrl url string Url to the site that the feed is for.
- imageUrl optional \*url string Small image for feed readers to use.
- docs optional url string Url to documentation on this feed.
- author string Who owns this feed.
- managingEditor optional string Who manages content in this feed.
- webMaster optional string Who manages feed availability and technical support.
- copyright optional string Copyright information for this feed.
- language optional string The language of the content of this feed.
- categories optional array of strings One or more categories this feed belongs to.
- pubDate optional Date object or date string The publication date for content in the feed
- ttl optional integer Number of minutes feed can be cached before refreshing from source.
- itunesAuthor optional string (iTunes specific) author of the podcast
- itunesSubtitle optional string (iTunes specific) subtitle for iTunes listing
- itunesSummary optional string (iTunes specific) summary for iTunes listing
- itunesOwner optional object (iTunes specific) owner of the podcast ( {name:String, email:String} )
- itunesExplicit optional boolean (iTunes specific) specifies if the podcast contains explicit content
- itunesCategory optional array of objects (iTunes specific) Categories for iTunes ( [{text:String, subcats:[{text:String, subcats:Array}]}] )
- itunesImage optional string (iTunes specific) link to an image for the podcast
- itunesType optional string (iTunes specific) type of podcast (episodic or serial)
- customNamespaces optional object Put additional namespaces in element (without 'xmlns:' prefix)
- customElements optional array Put additional elements in the feed (node-xml syntax)

### Add items to a feed

An item can be used for a blog entry, project update, log entry, etc. Your RSS feed an have any number of items. Most feeds use 20 or fewer items.

```typescript
feed.addItem(itemOptions)
```

### itemOptions

- title string Title of this particular item.
- description string Content for the item. Can contain html but link and image urls must be absolute path including hostname.
- url url string Url to the item. This could be a blog entry.
- guid unique string A unique string feed readers use to know if an item is new or has already been seen. If you use a guid never change it. If you don't provide a guid then your item urls must be unique.
- categories optional array of strings If provided, each array item will be added as a category element
- author optional string If included it is the name of the item's creator. If not provided the item author will be the same as the feed author. This is typical except - on multi-author blogs.
- date Date object or date string The date and time of when the item was created. Feed readers use this to determine the sort order. Some readers will also use it to - determine if the content should be presented as unread.
- lat optional number The latitude coordinate of the item.
- long optional number The longitude coordinate of the item.
- enclosure optional object Attach a multimedia file to this item.
- url string Url to the related file.
- file optional string Path to the related file on the filesystem. Used to fill out size and mime information.
- size optional number Number of bytes in the file. The length field will defualt to 0 if the size or file fields have not been set.
- type optional string Mime type of the file. Will be guessed from the url if this parameter is not set.
- content optional string Long html content for the episode
- itunesAuthor optional string (iTunes specific) author of the podcast
- itunesExplicit optional boolean (iTunes specific) specifies if the podcast contains explicit content
- itunesSubtitle optional string (iTunes specific) subtitle for iTunes listing
- itunesSummary optional string (iTunes specific) summary for iTunes listing
- itunesDuration optional number (iTunes specific) duration of the podcast item in seconds
- itunesImage optional string (iTunes specific) link to an image for the item
- itunesSeason optional number (iTunes specific) season number (non-zero integer)
- itunesEpisode optional number (iTunes specific) episode number (non-zero integer)
- itunesTitle optional string (iTunes specific) episode title
- itunesEpisodeType optional string (iTunes specific) the type of episode (full (default), trailer, bonus)
- itunesNewFeedUrl optional string (iTunes specific) The new podcast RSS Feed URL.
- customElements optional array Put additional elements in the item (node-xml syntax)

### Feed XML

const xml = feed.buildXml(indent);
This returns the XML as a string.

indent optional string What to use as a tab. Defaults to no tabs (compressed). For example you can use '\t' for tab character, or ' ' for two-space tabs.

## Example usage

```typescript
import { Podcast } from "podcast"

/_ lets create an rss feed _/
const feed = new Podcast({
title: "title",
description: "description",
feedUrl: "http://example.com/rss.xml",
siteUrl: "http://example.com",
imageUrl: "http://example.com/icon.png",
docs: "http://example.com/rss/docs.html",
author: "Dylan Greene",
managingEditor: "Dylan Greene",
webMaster: "Dylan Greene",
copyright: "2013 Dylan Greene",
language: "en",
categories: ["Category 1", "Category 2", "Category 3"],
pubDate: "May 20, 2012 04:00:00 GMT",
ttl: 60,
itunesAuthor: "Max Nowack",
itunesSubtitle: "I am a sub title",
itunesSummary: "I am a summary",
itunesOwner: { name: "Max Nowack", email: "max@unsou.de" },
itunesExplicit: false,
itunesCategory: [
{
text: "Entertainment",
subcats: [
{
text: "Television"
}
]
}
],
itunesImage: "http://example.com/image.png"
})

/_ loop over data and add to feed _/
feed.addItem({
title: "item title",
description: "use this for the content. It can include html.",
url: "http://example.com/article4?this&that", // link to the item
guid: "1123", // optional - defaults to url
categories: ["Category 1", "Category 2", "Category 3", "Category 4"], // optional - array of item categories
author: "Guest Author", // optional - defaults to feed author property
date: "May 27, 2012", // any format that js Date can parse.
lat: 33.417974, //optional latitude field for GeoRSS
long: -111.933231, //optional longitude field for GeoRSS
enclosure: { url: "...", file: "path-to-file" }, // optional enclosure
itunesAuthor: "Max Nowack",
itunesExplicit: false,
itunesSubtitle: "I am a sub title",
itunesSummary: "I am a summary",
itunesDuration: 12345,
itunesNewFeedUrl: "https://newlocation.com/example.rss"
})

// cache the xml to send to clients
const xml = feed.buildXml()

```

## Notes

You do not need to escape anything. This module will escape characters when necessary.
This module is very fast but you might as well cache the output of buildXml() and serve it until something changes.
Contributing
Contributions to the project are welcome. Feel free to fork and improve. I do my best accept pull requests in a timely manor, especially when tests and updated docs are included.

## License

(The MIT License)

Copyright (c) 2018 Max Nowack max@unsou.de

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
