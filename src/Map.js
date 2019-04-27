import React from 'react';
import ReactDOM from 'react-dom';

const mapStyles = {
  map: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  }
};
export class CurrentLocation extends React.Component {
  constructor(props) {
    super(props);

    const { lat, lng } = this.props.initialCenter;
    this.state = {
      currentLocation: {
        lat: lat,
        lng: lng
      }
    };
  }
  componentDidMount() {
    if (this.props.centerAroundCurrentLocation) {
      if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          const coords = pos.coords;
          this.setState({
            currentLocation: {
              lat: coords.latitude,
              lng: coords.longitude
            }
          });
        });
      }
    }
    this.loadMap();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.google !== this.props.google) {
      this.loadMap();
    }
    if (prevState.currentLocation !== this.state.currentLocation) {
      this.recenterMap();
    }
  }

  loadMap(listener) {
    if (this.props && this.props.google) {
      const {google} = this.props;
      const maps = google.maps;

      const mapRef = this.refs.map;

      const node = ReactDOM.findDOMNode(mapRef);

      let {zoom} = this.props;
      const {lat, lng} = this.state.currentLocation;
      const center = new maps.LatLng(lat, lng);
      const mapConfig = Object.assign(
          {},
          {
            center: center,
            zoom: zoom
          }
      );
      this.map = new maps.Map(node, mapConfig);

      var infowindow = new google.maps.InfoWindow();
      var locations = [
        ["Au Gubernatis", 43.699099, 7.273928, "https://github.com/HugoSohm/Epimeal/blob/master/img/bonta.jpg"],
        ["BonTà", 43.695990, 7.273516]
      ];
      var mapElement = document.getElementById('map');
      var myLatLng;
      var marker, i;
      for (i = 0; i < locations.length; i++) {
        myLatLng = {lat: locations[i][1], lng: locations[i][2]};
        marker = new google.maps.Marker({
          position: myLatLng,
          map: this.map,
          icon: "https://github.com/HugoSohm/Epimeal/blob/master/img/marker.jpg"
        });
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
          return function() {
            infowindow.setContent('<div id="content">'+
                '<div id="siteNotice">'+
                '</div>'+
                '<h1 id="firstHeading" class="firstHeading">'+
                locations[i][0]+
                '</h1>'+
                '<div id="bodyContent">'+
                '</div>'+
                '</div>');
            infowindow.open(this.map, marker);
          }
        })(marker, i));
      }
      var styles = {
        hide: [
          {
            featureType: 'poi.business',
            stylers: [{visibility: 'off'}]
          },
          {
            featureType: 'transit',
            elementType: 'labels.icon',
            stylers: [{visibility: 'off'}]
          }
        ]
      };
      this.map.setOptions({styles: styles['hide']});
    }
  }

  recenterMap() {
    const map = this.map;
    const current = this.state.currentLocation;

    const google = this.props.google;
    const maps = google.maps;

    if (map) {
      let center = new maps.LatLng(current.lat, current.lng);
      map.panTo(center);
    }
  }

  renderChildren() {
    const { children } = this.props;

    if (!children) return;

    return React.Children.map(children, c => {
      if (!c) return;
      return React.cloneElement(c, {
        map: this.map,
        google: this.props.google,
        mapCenter: this.state.currentLocation
      });
    });
  }

  render() {
    const style = Object.assign({}, mapStyles.map);

    return (
      <div>
        <div style={style} ref="map">
          Loading map...
        </div>
        {this.renderChildren()}
      </div>
    );
  }
}
export default CurrentLocation;

CurrentLocation.defaultProps = {
  zoom: 16,
  initialCenter: {
    lat: 43.695806,
    lng: 7.270094
  },
  centerAroundCurrentLocation: false,
  visible: true
};
