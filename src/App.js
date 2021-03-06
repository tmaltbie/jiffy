import React, {Component} from 'react';
import loader from './images/loader.svg';
import clearButton from './images/close-icon.svg';
import Gif from './Gif';

const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length)
  return arr[randIndex]
}

// pick out our props inside the header component
// pass down functions as props as well as things like,
// numbers, strings, arrays, and/or objects
const Header = ({clearSearch, hasResults}) => (
  <div className="header grid">
    {hasResults ? (
      <button onClick={clearSearch}>
        <img src={clearButton}  alt='' /> 
      </button>
    ) : (
      <h1 className="title"> Jiffy </h1> 
    )}
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
    this.textInput = React.createRef();
    this.state = {
      loading: false,
      searchTerm: '',
      hintText: '',
      gifs: []
    }
  }

  searchGiphy = async searchTerm => {
    // turn on loading svg spinner
    this.setState({
      loading: true
    })
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=Jdy7gzrGdpzy81JdQ54HQiZGZxOlgVKR&q=${
          searchTerm
        }&limit=50&offset=0&rating=g&lang=en`
      );
      // convert raw response into json data
      // const {data} gets the .data part of our response
      const {data} = await response.json();

      if(!data.length) {
        throw `Nothing found for ${searchTerm}`
      }


      // grab a random result from our images
      const randomGif = randomChoice(data);

      this.setState((prevState, props) => ({
        ...prevState,
        // here we use spread to take the previous gifs and
        // spread them out, then add new randomGif onto the end
        gifs: [...prevState.gifs, randomGif],
        // turn off loading svg spinner again
        loading: false,
        hintText: `Hint enter to see more ${searchTerm}`
      }))
    } catch (error) {
      this.setState((prevState, props)=> ({
        ...prevState,
        hintText: error,
        loading: false,
      }))
      console.log(error)
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
    }));
  };

  handleKeyPress = (event) => {
    const {value} = event.target

    if (value.length > 2 && event.key === 'Enter')
      // event.preventDefault()
      this.searchGiphy(value)
  }

  clearSearch = () => {
    this.setState((prevState, props)=> ({
      ...prevState,
      loading: false,
      searchTerm: '',
      hintText: '',
      gifs: []
    }))
    // grab input and then set focus
    this.textInput.current.focus();
  }

  render() { 
    const {searchTerm, gif} = this.state;
    const hasResults = this.state.gifs.length
    return (
      <div className="page">
        <Header clearSearch={this.clearSearch} hasResults={hasResults}/>
        
        <div className="search grid">
          {/* stack of images */}
          
          {this.state.gifs.map((gif, index) => (
            // spread out all the gif properties into the Gif component
            <Gif {...gif} key={index}/>
          ))}

          <input 
            className='input grid-item' 
            placeholder='Type something'
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            value={searchTerm}
            ref={this.textInput}
          />
        </div>
        {/* here we pass our userHint all of our state using a spread  */}
        <UserHint {...this.state} />
      </div>
    );
  }
}

export default App;
