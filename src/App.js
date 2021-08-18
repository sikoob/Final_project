import React, { Component } from 'react';
import './App.css';
import Navigation from './components/navigation/Navigation.js';
import Logo from './components/logo/Logo.js';
import ImageLinkForm from './components/imagelinkform/ImageLinkForm.js';
import Rank from './components/rank/Rank.js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/facerecognition/FaceRecognition.js';
import SignIn from './components/signin/SignIn.js';
import Register from './components/register/Register.js';

const app = new Clarifai.App({
 apiKey: '08a93ffa3c1d49fb9f137cc4123f6504'
});

class App extends Component {
  constructor() {
    super();
    this.state= {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  onInputChange = (event) => {
    this.setState({input:event.target.value});                        /*xy.target.value gibt direkt die Eingabewerte wieder*/
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response =>this.displayFaceBox(this.calculateFaceLocation(response))) /*Weg zur Bounding Box für Gesichtserkennung in API-output*/
      .catch(err=> console.log(err));                       /*there was an error*/
  }

  onRouteChange = (route) => {
    if(route==='signout'){
      this.setState({isSignedIn:false})
    } else if (route==='home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

    calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col*width,
      topRow: clarifaiFace.top_row*height,
      rightCol: width - (clarifaiFace.right_col*width),
      bottomRow: height - (clarifaiFace.bottom_row*height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route=== 'home'
          ? <div>
              <Logo />
              <Rank />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}                       // this. benötigt, um den Aspekt innerhalb des Codes aufrufen zu können
              />   
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          : (
            this.state.route==='signin'
            ? <SignIn onRouteChange={this.onRouteChange}/>
            : <Register onRouteChange={this.onRouteChange}/>
          )
      }
      </div>
    );
  }
}

export default App;
