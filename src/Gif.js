import React, {Component} from 'react';

class Gif extends Component {

  // when our video has loaded we add a loadded classname
  // otherwise the video stays hidden
  constructor(props) {
    super(props)
    this.state = {
      loaded: false
    }
  }

  render() {
    const {loaded} = this.state
    const {images} = this.props
    return (
      <video 
        // when loaded state is true, add loaded class
        className={`grid-item video ${loaded && 'loaded'}`}
        autoPlay
        muted
        playsInline
        loop 
        src={images.original.mp4}
        onLoadedData={() => this.setState({loaded: true})}
      />
    )
  }
}

export default Gif