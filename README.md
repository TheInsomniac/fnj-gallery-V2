#Flickr-NodeJS-JQuery (FNJ Gallery)

*Note: This is my first attempt at **anything** javascript / NODE.js*  
This, appearance wise, is identical to my "Flickr-Python-JQuery" gallery but is based  
entirely on node.js and does not use static JSON files.  

This gallery connects via the Flickr API (using oauth) and retreives Photosets  
and photos on the fly.  

###Installation:  
    git clone git://github.com/manxam/fnj-gallery.git
    npm install

###Configuration:  
edit config.json to suit your needs. 
(You can skip the oauth parts at this time)  

If '"node_env": "development"' then json files will be written for the data received from
Flickr to 'tmp' for inspection purposes and the JS files served will be non-minified for easier debugging. 
If '"runServer": "false" as well then the webserver will not start either. The photoset/collection data will be written and then the app
will exit.  

Else, set to "production" to disable this behavior. JSON files will not be written and JS files served will be the minified versions.    

If your photos are arranged in sets this will produce a "flat" gallery where
all albums are at the root of the listings.  

If your photosets on flickr are arranged into sets then change "use" to collections.  
This will enable recursive listings such that the Collection name is the Album
root and the collections beneath are the sub-albums.  

"title" sets the title of the photo gallery's index page.  
"quote" is the inspirational quote displayed on the index page.  
"quoteAuthor" is the author of the above quote.  

_e.g. "My Trip to Italy" -> "Day 1"_
    
    {
        "api_key": "YourApiKeyHere", 
        "api_secret": "YourApiSecretHere", 
        "user_id": "YourUserIdHere", 
        "oauth_token": "YourOauthTokenHere", 
        "oauth_secret": "YourOauthSecretHere", 
        "use": "sets",
        "title": "My Photo Gallery",
        "quote": "“My Inspirational Quote Here”",
        "quoteAuthor": "Unknown",
        "host": "127.0.0.1", 
        "port": "8080", 
        "node_env": production, 
        "runServer": true
    }  

###Getting auth tokens for Flickr (from flickr-oauth):  
#####Here Goes:
######Try this first:  
run node REPL:

    node
    > .load ./lib/flickr_tokens.js
    > getTokens();
*If you receive the oauth, userID, and oauth_secret from this then just place the resultant parameters into config.json*  

######Else: 

    node
    > .load ./lib/flickr_tokens.js
    > getRequestToken();

*Copy the returned "oauth_token", "oauth_secret", and "oauth_verifier" for the next step*  

    > getAccessToken(yourOauthToken, yourSecretToken, yourOauthVerifier);

*Copy the returned oauth_token, userID, and oauth_secret for the next step.*  

*Place the resultant parameters into config.json*

###Running:  
    node app.js
**Voila!**

###Flickr sets/collections changes:  
*The album data is generated upon the startup of node and is kept in memory as-is. If changes are made to your photosets on Flickr then either restart the app or go to **http://server.url/albums?update=true** to force a regeneration*  

##API:  
####Obtain list of photosets:  
    /albums?request=photosets  
####Obtain list of collections:  
    /albums?request=collections  
####Update photoset and collections cache:  
    /albums?update=true  
####Obtain photos from a photoset/collection:  
    /photos?album=FLICKR_ALBUM_ID  
