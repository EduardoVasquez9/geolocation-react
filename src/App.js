import './App.css';
import React from 'react';
require('dotenv').config();

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      lat: null,
      long: null,
      userAddress: null,
    };
    this.getLocation = this.getLocation.bind(this);
    this.getCoord = this.getCoord.bind(this);
    this.geolocationError = this.geolocationError.bind(this);
    this.reverseGeoCode = this.reverseGeoCode.bind(this);
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.getCoord, this.geolocationError);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  getCoord(position){
    this.setState({
      lat: position.coords.latitude,
      long: position.coords.longitude
    });
    this.reverseGeoCode();
  }

  reverseGeoCode(){
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.lat},${this.state.long}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`)
    .then(response => response.json())
    .then(data => this.setState({
      userAddress : data.results[0].formatted_address
    }))
    .catch(error => alert(error))
  }

  geolocationError(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.")
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.")
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.")
        break;
      case error.UNKNOWN_ERROR:
        alert("An unknown error occurred.")
        break;
      default:
        alert("An unknown error occurred.")
    }
  }

  render(){
    return (
      <div className="App">
        <div className='containerLoc'>
            <h7 style={{marginBottom:'8px'}}>React Geolocation</h7>
            <button onClick={this.getLocation} className='btnCoordinates'>Get coordinates</button>

            {
                this.state.lat && this.state.long ?
                  <div className='innerLoc'>
                    <h4 style={{marginBottom:'-4px'}}>Coordinates</h4>
                      <div>
                        <p>Latitude: {this.state.lat}</p>
                        <p>Longitude: {this.state.long}</p>
                      </div>
                  </div>
                : 
                null
              }
            
            <h4 style={{marginBottom:'-8px'}}>Address:</h4>
            <p>{this.state.userAddress}</p>

            <div>
              {/* MAPA */}
              {
                this.state.lat && this.state.long ?
                <img src={`https://maps.googleapis.com/maps/api/staticmap?center=${this.state.lat},${this.state.long}&zoom=18&size=600x600&markers=color:red%7C${this.state.lat},${this.state.long}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`} alt=''/>
                : 
                null
              }
            </div>
        </div>
      </div>
    );
  }
  
}

export default App;
