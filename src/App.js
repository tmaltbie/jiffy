import React, {Component} from 'react';
import loader from './images/loader.svg'
import apiKey from './config'

const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length)
  return arr[randIndex]
}

const Header = () => (
  <div className="header grid">
    <h1 className="title">Jiffy</h1>
  </div>
)

const UserHint = ({loading, hintText}) => (
  <div className='user-hint'>
    { loading ? <img className='block mx-auto' src={loader} alt=''/> : hintText }
  </div>
)

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      hintText: '',
      gif: null
    }
  }

  searchGiphy = async searchTerm => {
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=Jdy7gzrGdpzy81JdQ54HQiZGZxOlgVKR&q=${
          searchTerm
        }&limit=89&offset=0&rating=g&lang=en`
      );
      const {data} = await response.json()
      
      const randomGif = randomChoice(data)
      console.log(randomGif)

      this.setState((prevState, props) => ({
        ...prevState,
        gif: randomGif,
        gifs: [...prevState.gifs, randomGif]
      }))
    } catch (error) {

    }
  }

  handleChange = (event) => {
    // const value = event.target.value; & for brevity:
    const {value} = event.target
    this.setState((prevState, props) => ({
      // we take our old props and "spread" them out here
      // then we overwrite the ones we want
      // overwrite searchTerm with the value in real time
      ...prevState,
      searchTerm: value,
      hintText: value.length > 2 ? `Hit enter to search ${value}` : ''
    }))
  }

  handleKeyPress = (event) => {
    const {value} = event.target

    if (value.length > 2 && event.key === 'Enter')
      event.preventDefault()
      this.searchGiphy(value)
  }

  render() { 
    const {searchTerm, gif} = this.state
    return (
      <div className="page">
        <Header />
        
        <div className='search grid'>
          {/* stack of images */}
          
          {this.state.gifs.map(gif => (
            <video 
              className='grid-item video' autoPlay loop src={gif.images.original.mp4}
            />
          ))}

          <input 
            className='input grid-item' 
            placeholder='Type something'
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            value={searchTerm}
          />
        </div>
        {/* here we pass our userHint all of our state using a spread  */}
        <UserHint {...this.state} />
      </div>
    );
  }
}

export default App;