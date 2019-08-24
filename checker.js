let cheerio = require('cheerio'),
    request = require('request'),
    Crawler = require('simplecrawler');

module.exports = {
    load: function(url, callback) {
        if (url.indexOf('http://') < 0 && url.indexOf('https://') < 0) { // TODO: Turn this into its own function
            url = 'http://' + url;
        }

        request.get(url.toLowerCase(), function(error, response, body) {
            if (!error && response.statusCode === 200) {
                return callback(body);
            }

            return callback(false);
        });
    },

    meta: function(body) {
        let $     = cheerio.load(body),
            page  = {};

        page.title = $('title').text() || null;
        page.description = $('meta[name=description]').attr('content') || null;
        page.author = $('meta[name=author]').attr('content') || null;
        page.keywords = $('meta[name=keywords]').attr('content') || null;

        let h1s = 0;
        $('h1').each(function() {
            h1s++;
        });
        page.heading1 = $('body h1:first-child').text().trim().replace('\n', '');
        page.totalHeadings = h1s;

        let totalImgs       = 0,
            accessibleImgs  = 0;
        $('img').each(function(index) {
            totalImgs++;
            if ($(this).attr('alt') || $(this).attr('title')) {
                accessibleImgs++;
            }
        });
        page.imgAccessibility = (accessibleImgs / totalImgs) * 100;
        return page;
    },

    crawl: function(url, options, callback) {
        let crawler       = Crawler.crawl(url.toLowerCase()),
            opts          = options || {},
            maxPages      = opts.maxPages || 10,
            parsedPages   = [],         // Store parsed pages in this array
            seoParser     = this.meta,  // Reference to `meta` method to call during crawl
            crawlResults  = [];         // Store results in this array and then return it to caller

        // Crawler settings
        crawler.interval            = opts.interval || 250;         // Time between spooling up new requests
        crawler.maxDepth            = opts.depth || 2;              // Maximum deptch of crawl
        crawler.maxConcurrency      = opts.concurrency || 2;        // Number of processes to spawn at a time
        crawler.timeout             = opts.timeout || 1000;         // Milliseconds to wait for server to send headers
        crawler.downloadUnsupported = opts.unsupported || false;    // Save resources by only downloading files Simple Crawler can parse
                                                                    // The user agent string to provide - Be cool and don't trick people
        crawler.userAgent           = opts.useragent || 'SEO Checker v1 (https://github.com/Clever-Labs/seo-checker)';

        // Only fetch HTML! You should always set this option unless you have a good reason not to
        if (opts.htmlOnly === true) { // Being explicit about truthy values here
            let htmlCondition = crawler.addFetchCondition(function(parsedURL) {
                return !parsedURL.path.match(/\.jpg|jpeg|png|gif|js|txt|css|pdf$/i);
            });
        }

        crawler.on('fetchcomplete', function(queueItem, responseBuffer, response) {
            if (queueItem.stateData.code === 200) {
                crawlResults.push({ url: queueItem.url, body: responseBuffer.toString() });
            }
            if (crawlResults.length >= maxPages) {
                this.stop(); // Stop the crawler
                crawlResults.forEach(function(page, index, results) {
                    parsedPages.push({url: page.url, results: seoParser(page.body)});
                });
                if (!callback) {
                    return parsedPages;
                } else {
                    callback(parsedPages);
                }
            }
        });
    }
};

