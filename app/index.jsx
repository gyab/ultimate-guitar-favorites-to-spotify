import UGtoSpotifyModal from './UGtoSpotifyModal.jsx'
var React = require('react');
var ReactDOM = require('react-dom');

var $divSpotify = document.createElement('div');
$divSpotify.id = 'block';
document.body.insertBefore($divSpotify, document.body.firstChild);

const props = {};

ReactDOM.render(<UGtoSpotifyModal {...props} />, document.getElementById('block'))