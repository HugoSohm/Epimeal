import React, { Component } from 'react';
import { GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
// import Link from '@material-ui/core/Link';
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';
import CurrentLocation from './Map';

export class MapContainer extends Component {
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {}
  };

  onStyle = (theme => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }));

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  render() {
    return (
      <CurrentLocation centerAroundCurrentLocation google={this.props.google}>
        {/* <makeStyles><div className={this.onStyle.root}>
            <AppBar position="static">
              <Toolbar>
                <Link href="https://github.com/HugoSohm/Epimeal" color="inherit">
                <IconButton edge="start" className={this.onStyle.menuButton} color="inherit" aria-label="Menu">
                  <MenuIcon/>
                </IconButton>
                </Link>
                <Typography variant="h6" className={this.onStyle.title}>Epimeal</Typography>
              </Toolbar>
            </AppBar>
          </div>
        </makeStyles> */}
        <Marker onClick={this.onMarkerClick} name={'Vous êtes ici'} />
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}>
          <div>
            <h4>{this.state.selectedPlace.name}</h4>
          </div>
        </InfoWindow>
      </CurrentLocation>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDO9xJgM4adK1KN8J7gCLDQHAwZnlVXtEM'
})(MapContainer);
