import React, { Component } from 'react';
import './App.css';
import Particles from 'react-particles-js';
import Navigation from './components/navigation/Navigation.js';
import Logo from './components/logo/Logo.js';
import ImageLinkForm from './components/imagelinkform/ImageLinkForm.js';
import Rank from './components/rank/Rank.js';
import FaceRecognition from './components/facerecognition/FaceRecognition.js';
import SignIn from './components/signin/SignIn.js';
import Register from './components/register/Register.js';

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state =initialState;
  }


  loadUser=(data) => {
    this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
    }})
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

  onInputChange = (event) => {
    this.setState({input:event.target.value});                        /*xy.target.value gibt direkt die Eingabewerte wieder*/
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
      fetch('https://safe-bayou-17743.herokuapp.com/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if(response) {
          fetch('https://safe-bayou-17743.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))  /*??ndert nur die angegebene User-Angabe, nicht das gesamte User Objekt*/
            })
            .catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(response)) /*Weg zur Bounding Box f??r Gesichtserkennung in API-output*/
        })        
      .catch(err=> console.log(err));                       /*there was an error*/
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route=== 'home'
          ? <div>
              <Logo />
              <Rank 
                name={this.state.user.name} 
                entries={this.state.user.entries} 
              />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}                       // this. ben??tigt, um den Aspekt innerhalb des Codes aufrufen zu k??nnen
              />   
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          : (
            route==='signin'
            ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          )
      }
      </div>
    );
  }
}

export default App;
