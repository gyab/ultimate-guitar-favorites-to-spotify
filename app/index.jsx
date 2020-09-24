import UGtoSpotifyModal from './UGtoSpotifyModal.jsx'
let React = require('react');
let ReactDOM = require('react-dom');
import ReactModal from "react-modal";

let $divSpotify = document.createElement('div');
$divSpotify.id = 'block';
document.body.insertBefore($divSpotify, document.body.firstChild);

const rootElement = document.getElementById("block");
ReactModal.setAppElement(rootElement);

const props = {};

ReactDOM.render(<UGtoSpotifyModal {...props} />, document.getElementById('block'));