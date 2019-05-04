import React, { Component } from "react";
import Front from "./Front";
import Gallery from "./Gallery";
import Footer from "./Footer";
import withSizes from 'react-sizes'
import { fetchFrontData, fetchImages } from "../api";

const sizeToProps = ({ width }) => {
  return { deviceWidth: width };
}

class App extends Component {

  state = {
    dataList: [],
    photos: []
  };

  componentDidMount() {
    fetchFrontData()
      .then(dataList => this.setState({ dataList }))
      .catch(() => console.error("Front page information could not be loaded"));
  }

  _loadGallery = item => {
    this._resetPhotos();
    this._loadPhotos(item);
  };

  _hideGallery = () => this._resetPhotos();

  _loadPhotos(item) {
    const data = this.state.dataList[item];
    fetchImages(data.title)
      .then(photos => this.setState({ photos }))
      .catch(() => {
        this.setState({ photos: [] });
        console.error("Gallery images could not be loaded");
      });
  }

  _resetPhotos(){
    this.setState({ photos: [] });
  }

  _columns = () => {
    const width = this.props.deviceWidth;
    return width < 1000 ? (width < 700 ? 2 : 3) : 5;
  }

  //TODO: Select image size based on device resolution
  _photoUrls = () => this.state.photos.map(photo => photo.src["medium"]);

  render() {
    const { dataList, photos } = this.state;
    const deviceWidth = this.props.deviceWidth;

    return (
      <div>
        <main>
          <Front
            dataList={dataList}
            onSelect={this._loadGallery}
            onDeselect={this._hideGallery}
            isMobile={deviceWidth < 600}
          />

          {photos && photos.length > 0 && (
            <Gallery 
              photos={this._photoUrls()} 
              columns={this._columns()}
            />
          )}
        </main>
        <Footer />
      </div>
    );
  }
}

export default withSizes(sizeToProps)(App);