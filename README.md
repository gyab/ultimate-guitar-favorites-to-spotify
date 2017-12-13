# Utimate Guitar Favorites to Spotify

Easily export your Ultimate Guitar favorite songs to your Spotify.


[Download on Chrome Store](https://chrome.google.com/webstore/detail/utimate-guitar-favorites/jhadlgfdcpedmbohiknkbnfmpiaccocl)

#### To run locally

```
$ npm install
```

then

```
$ npm run build
```

Once is done, all you'll need to do is adding all the files located in the **build** folder to Chrome
([detailed explanations](https://developer.chrome.com/extensions/getstarted#unpacked)).

Please, use your own [Spotify API key](https://beta.developer.spotify.com/dashboard/).

#### To Do List
- [ ] If the playlist has already been created, get all the songs and compute the delta with the current content of the UG favorites webpage
- [x] Supports UG favorites webpage with over 100 tabs
- [x] Add to Chrome Store
- [ ] Remove duplicates
