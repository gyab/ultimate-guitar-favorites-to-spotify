import UGtoSpotifyModal from './UGtoSpotifyModal.jsx'
let React = require('react');
let ReactDOM = require('react-dom');

let $divSpotify = document.createElement('div');
$divSpotify.id = 'block';
document.body.insertBefore($divSpotify, document.body.firstChild);

const props = {};

ReactDOM.render(<UGtoSpotifyModal {...props} />, document.getElementById('block'));