import styles from "../styles/Modal.module.css";
import React, { Component } from "react";
import AriaModal from 'react-aria-modal';
import PropTypes from "prop-types";
import Loading from "./Loading";
import placeholder from "../images/placeholder.png";

class Modal extends Component {
  static propTypes = {
    photos: PropTypes.array.isRequired,
    selected: PropTypes.number.isRequired,
    onExit: PropTypes.func.isRequired,
    resolution: PropTypes.string
  };

  static defaultProps = {
    resolution: "original"
  }

  state = {
    current: this.props.selected,
    loaded: false,
    error: false
  };

  _update = current => {
    if (current > -1 && current < this.props.photos.length) {
      this.setState({ current, loaded: false, error: false });
    }
  }

  _next = () => this._update(this.state.current + 1);
  _previous = () => this._update(this.state.current - 1);

  _photoLoaded = () => this.setState({ loaded: true });

  _photoLoadError = () => {
    this.setState({ loaded: true, error: true });
    console.error("Photo could not be loaded");
  };

  _handleKey = e => {
    switch (e.keyCode) {
      case 37: //Left arrow
        e.preventDefault();
        this._previous();
        break;
      case 39: //Right arrow
      e.preventDefault();
        this._next();
        break;
      default:
        break;
    }
  };

  render() {
    const { photos, resolution, onExit } = this.props;
    const { current, loaded, error } = this.state;

    const photo = photos[current];
    const photoUrl = photo.src[resolution];

    const showPrevious = current > 0;
    const showNext = current < photos.length - 1;

    return (
      <div
        className={styles.modal}
        onKeyDown={this._handleKey}
      >
        <AriaModal
          titleText="Modal image"
          onExit={onExit}
          focusDialog={true}
          verticallyCenter={true}
          includeDefaultStyles="width: auto"
        >
          <div className={styles.content}>

            <button
              className={styles.close}
              onClick={onExit}
              title="Close"
            >&times;</button>

            <div className={styles.container}>

              {showPrevious && (
                <button
                  className={styles.control}
                  onClick={this._previous}
                  title="Previous"
                >&#10094;</button>
              )}

              {!loaded && (
                <span className={styles.loading}>
                  <Loading type="spinner" />
                </span>
              )}

              <figure className={styles.information}>
                <img
                  className={styles.photo}
                  src={error? placeholder : photoUrl}
                  alt={error? "Default" : ""}
                  onLoad={this._photoLoaded}
                  onError={this._photoLoadError}
                />
                <figcaption><p>Photo by <a href={photo.photographer_url}>{photo.photographer}</a> on <a href={photo.url}>Pexels</a></p></figcaption>
              </figure>

              {showNext && (
                <button
                  className={styles.control}
                  onClick={this._next}
                  title="Next"
                >&#10095;</button>
              )}
            </div>
          </div>
        </AriaModal>
      </div>
    );
  }
}

export default Modal;