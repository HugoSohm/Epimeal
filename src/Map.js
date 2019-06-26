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
      var styles = {
        epimealstyle: [
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.business",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          }
        ]
      };
      this.map.setOptions({styles: styles['epimealstyle']});

      var infowindow = new google.maps.InfoWindow();
      var locations = [
        ["Au Gubernatis", 43.699099, 7.273928, "8 Rue Gubernatis, 06000 Nice", "/img/guber.jpeg"],
        ["BonTà", 43.695990, 7.273516, "1 Rue Louis Gassin, 06300 Nice", "/img/bonta.jpg"],
        ["Pizza Pili", 43.696674, 7.276664, "24 Rue Benoît Bunico, 06300 Nice", "/img/pizza.jpg"],
        ["Bref. Burger Factory", 43.696073, 7.270141, "2 Rue Desboutin, 06000 Nice", "/img/bref.jpg"],
        ["Olim", 43.696834, 7.271662, "54 Boulevard Jean Jaurès, 06300 Nice", "/img/olim.jpg"],
        ["Subway", 43.696409, 7.271233, "8 Plassa Carlou Aubert, 06300 Nice", "/img/subway.jpg"],
        ["Pokawa", 43.697404, 7.265242, "1 Place Grimaldi, 06000 Nice", "/img/pokawa.jpg"],
        ["McDonalds", 43.695162, 7.265964, "1 Prom. des Anglais, 06000 Nice", "/img/mcdo.png"],
        ["So Green", 43.698222, 7.270116, "11 Place Massena, 06000 Nice", "/img/so-green.jpg"],
        ["Chez René Socca", 43.700214, 7.278889, "2 Rue Miralheti, 06300 Nice", "/img/socca.png"]
      ];
      var myLatLng;
      var marker, i;
      for (i = 0; i < locations.length; i++) {
        myLatLng = {lat: locations[i][1], lng: locations[i][2]};
        marker = new google.maps.Marker({
          position: myLatLng,
          map: this.map,
          icon: "/img/marker.png"
        });
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
          return function() {
            var html = '<b><center>' + locations[i][0] + '</center></b><br>';
            html += '<center> <img src="' + locations[i][4] + '" align="center" /><center><br>'
            html += '<div id="bodyContent">' + locations[i][3];
            infowindow.setContent(html);
            infowindow.open(this.map, marker);
          }
        })(marker, i));
      }
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
          Chargement de la carte...
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
