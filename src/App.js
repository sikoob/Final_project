import React, { Component } from 'react';
import './App.css';
import Navigation from './components/navigation/Navigation.js';
import Logo from './components/logo/Logo.js';
import ImageLinkForm from './components/imagelinkform/ImageLinkForm.js';
import Rank from './components/rank/Rank.js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/facerecognition/FaceRecognition.js';

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
    }
  }

  onInputChange = (event) => {
    this.setState({input:event.target.value});                        /*xy.target.value gibt direkt die Eingabewerte wieder*/
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

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
    .then(response =>this.displayFaceBox(this.calculateFaceLocation(response))) /*Weg zur Bounding Box für Gesichtserkennung in API-output*/
    .catch(err=> console.log(err));                       /*there was an error*/
  }

  render() {
    return (
      <div className="App">
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm 
        onInputChange={this.onInputChange} 
        onSubmit={this.onButtonSubmit} />    {/*this. benötigt, um den Aspekt innerhalb des Codes aufrufen zu können*/}

        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />

      </div>
    );
  }
}

export default App;
