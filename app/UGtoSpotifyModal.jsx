require("./style.css");
let React = require('react');
let spotify = require('./spotify');
let ReactDOM = require('react-dom');
let ReactModal = require('react-modal')
let Loader = require('halogen/ClipLoader');

export default class UGtoSpotifyModal extends React.Component {
  constructor () {
    super();
    this.state = {
      showModal: false,
      inProgress: false,
      playlistCreationSuccess: false,
      inputValue: ''
    };
    
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.spotifyInit = this.spotifyInit.bind(this);
    this.onSuccessUGtoSpotify = this.onSuccessUGtoSpotify.bind(this)
  }
  
  handleOpenModal () {
    this.setState({showModal: true});
  }
  
  handleCloseModal () {
    this.setState({showModal: false, playlistCreationSuccess: false});
  }

  onInputChange(event) {
    this.setState({inputValue: event.target.value});
  }

  spotifyInit() {
    spotify.init(this.state.inputValue, this.onSuccessUGtoSpotify);
    this.setState({inProgress: true});
  }

  onSuccessUGtoSpotify() {
    this.setState({playlistCreationSuccess: true, inProgress: false});
  }

  render () {

    let modal = {
      content: {
        'top': 'calc(50% - 150px)',
        'left': 'calc(50% - 200px)',
        'boxSizing': 'border-box',
        'textAlign': 'center',
        'display': 'flex',
        'flexDirection': 'column',
        'justifyContent': 'space-around',
        'backgroundColor': 'white',
        'borderRadius': '10px',
        'width': '400px',
        'height': '300px',
        'padding': '20px',
        'border': '1px solid #6BC100'
      }
    }

    let modalTitle = {
      'margin': 0,
      'padding': 0,
      'fontSize': '25px',
      'color': '#6BC100',
      'textDecoration': 'underline'
    }

    let modalInput = {
      'width': '310px',
      'height': '56px',
      'margin': '0 auto',
      'textAlign': 'center',
      'fontSize': '15px',
      'borderRadius': '5px',
      'border': '1px solid #979797'
    }

    let modalText = {
      'color': '#979797',
      'fontSize': '20px'
    }

    let modalButton = {
      'width': '200px',
      'height': '60px',
      'margin': '0 auto',
      'border': 0,
      'backgroundColor': '#6BC100',
      'color': 'white',
      'borderRadius': '5px',
      'fontSize': '30px',
      'textTransform': 'uppercase'
    }

    let button = null;
    let input = null;
    let loader = null;
    let text = null;

    if(this.state.playlistCreationSuccess) {
      text = <p style={modalText}>Your playlist has been created.</p>
      button = <button style={modalButton} onClick={this.handleCloseModal}>Close</button>;
    }
    else if(this.state.inProgress) {
      loader = <Loader color="#6BC100" size="60px"/>
      button = <button className="modal__button-disabled" style={modalButton} disabled>Creating...</button> 
    }
    else {
      input = <input autoFocus style={modalInput} onChange={this.onInputChange} placeholder="Enter your new playlist's name"/>
      button = <button className="modal__button-disabled" style={modalButton} disabled={!this.state.inputValue} onClick={this.spotifyInit}>Start</button>
    }

    return (
      <div className="modal">
        <button className="modal__open-button" onClick={this.handleOpenModal}></button>
        <ReactModal 
          isOpen={this.state.showModal}
          style={modal}
          contentLabel="UGtoSpotify Modal"
        >
          <h1 style={modalTitle}>UG Favorites to Spotify</h1>
          {text}
          {input}
          {loader}
          {button}
        </ReactModal>
      </div>
    );
  }
}