import React, { useState, useEffect, useRef, useContext } from 'react';
import { Text } from 'native-base';
import { Image } from 'react-native';
import { Callout, Marker } from 'react-native-maps';
import { connect } from 'react-redux';

import DefaultErrorContext from '../../context/DefaultError/DefaultErrorContext';
import PopupContext from '../../context/Popup/PopupContext';
import { getCurrentLocation } from '../../actions/commonActions';
import { getNearbyPosts } from '../../actions/postActions';
import { getNearbyPeople } from '../../actions/peopleActions';
import { goToProfile, } from '../../actions/userActions';
import CONSTANTS from '../../common/PeertalConstants';
import UserObject from '../../models/UserObject';
import MapViewComponent from './MapViewComponent';
import NoLocationComponent from './NoLocationComponent';
import MapViewHeaderTab from './MapViewHeaderTab';
import MapViewScreen from './MapViewScreen';
import ReloadButton from './ReloadButton';

const MapViewScreenContainer = (props) => {
  const { defaultError } = useContext(DefaultErrorContext);
  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;

  const myMapView = useRef();

  const [posts, setPosts] = useState([]);
  const [people, setPeople] = useState([]);
  const [selectedTab, setSelectedTab] = useState('conversation');
  const [isLoading, setIsLoading] = useState(false);
  const [longitudeDelta, setLongitudeDelta] = useState(0.0922);
  const [latitudeDelta, setLatitudeDelta] = useState(0.0421);
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [isReloadButton, setIsReloadButton] = useState(false);

  useEffect(() => {
    getCurrentLocation(position => {
      setLongitude(position.coords.longitude)
      setLatitude(position.coords.latitude)
      handleLoadData(
        position.coords.longitude,
        position.coords.latitude,
      )
      props.dispatch({
        type: 'UPDATE_LONG_LAT',
        data: {
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        },
      });
      props.dispatch({
        type: 'UPDATE_HAVELOCATION_PROPS',
        data: {
          haveLocation: true,
        },
      });
    }, (err) => defaultError(err));
  }, [])

  const _selectTab = (tab = 'conversation') => {
    setSelectedTab(tab);
    handleLoadData(longitude, latitude, tab);
  }

  const _goBackToCurrentRegion = () => {
    myMapView.current.animateToRegion({
      longitude: props.user.longitude,
      latitude: props.user.latitude,
      longitudeDelta: 0.0922,
      latitudeDelta: 0.0421,
    });
  }

  const _renderHeaderTab = () => {
    return (
      <MapViewHeaderTab
        {...props}
        _selectTab={_selectTab}
        selectedTab={selectedTab}
      />
    );
  }

  const renderMapViewComponent = () => {
    if (props.user.haveLocation) {
      return (
        <MapViewComponent
          {...props}
          selectedTab={selectedTab}
          longitude={longitude}
          latitude={latitude}
          myMapView={myMapView}
          _goBackToCurrentRegion={_goBackToCurrentRegion}
          handleRegionChange={handleRegionChange}
          handleLoadData={handleLoadData}
          _renderPeopleMarkers={_renderPeopleMarkers}
          _renderPostMarkers={_renderPostMarkers}
          renderReloadButton={renderReloadButton}
        />
      )
    } else {
      return (
        <NoLocationComponent
          {...props}
          setPopup={setPopup}
          defaultError={defaultError}
          handleLoadData={handleLoadData}
        />
      )
    }
  }

  const handleRegionChange = (region) => {
    setLongitude(region.longitude);
    setLatitude(region.latitude);
    setLongitudeDelta(region.longitudeDelta);
    setLatitudeDelta(region.latitudeDelta);
    if (region.longitudeDelta > 40) {
      setIsReloadButton(true);
      return;
    }
    if (Math.abs(region.latitude - latitude) < 0.0018 && Math.abs(region.longitude - longitude) < 0.0018) {
      setIsReloadButton(true);
      return;
    }
    handleLoadData(
      region.longitude,
      region.latitude,
      selectedTab,
    )
  }

  const renderReloadButton = () => {
    if (isReloadButton) {
      return (
        <ReloadButton
          handleLoadData={handleLoadData}
          longitude={longitude}
          latitude={latitude}
          selectedTab={selectedTab}
        />
      );
    }
  }

  const handleLoadData = (lon, lat, tab = 'conversation') => {
    if (isLoading == false) {
      setIsLoading(true);
      if (tab === 'conversation') {
        getNearbyPosts(
          props.user.accessToken,
            props.user.subscribeToAdultContent,
            props.user.over18,
          undefined,
          undefined,
          undefined,
          lon || longitude || props.user.longitude,
          lat || latitude || props.user.latitude,
          30,
          undefined,
          res => {
            let postsSortedById = res.data.data.posts;
            postsSortedById.sort(function (a, b) {
              return a.id > b.id ? -1 : a.id < b.id ? 1 : 0;
            });
            setPosts(postsSortedById);
            setIsLoading(false);
            setIsReloadButton(false);
          },
          err => {
            alert(err.response?.data?.message ?? err?.message);
            setIsLoading(false);
          },
        );
      } else {
        getNearbyPeople(
          props.user.accessToken,
          props.user.userId,
          lon || props.user.longitude,
          lat || props.user.latitude,
          props.user.filterFriends,
          0,
          20,
          res => {
            setPeople(res.data.data);
            setIsLoading(false);
            setIsReloadButton(false);
          },
          err => {
            setIsLoading(false)
            defaultError(err);
          },
        );
      }
    }
  }

  const _renderPeopleMarkers = () => {
    if (people == null || posts.length < 1) return null;
    return people.map((item, index) => {
      let location = item.location;
      if (location == null) location = { lon: 174, lat: -41 };
      let user = item || new UserObject();
      const name = user.fullName;
      let imageUrl = user.avatarUrl || CONSTANTS.DEFAULT_AVATAR;
      const { introduction, occupation } = item;
      let lon = parseFloat(location.lon.toFixed(14));
      let lat = parseFloat(location.lat.toFixed(14));
      return (
        <Marker
          key={index}
          title={name}
          description={introduction}
          // pinColor="red"
          // draggable
          coordinate={{ latitude: lat, longitude: lon }}>
          <Image
            style={{
              height: 50,
              width: 50,
              borderRadius: 25,
              backgroundColor: 'white',
            }}
            source={{ uri: imageUrl }}
          />
          <Callout
            onPress={() => {
              goToProfile(props.navigation, item.id);
            }}
            style={{
              width: 104,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{ fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD }}>
              {name}
            </Text>
            <Text>{occupation}</Text>
          </Callout>
        </Marker>
      );
    });
  }

  _renderPostMarkers = () => {
    if (posts == null || posts.length < 1) return null;
    return posts.map((item, index) => {
      let location = item.location;
      if (location == null) location = { lon: 174, lat: -41 };
      let user = item.user || new UserObject();
      const name = user.fullName;
      let imageUrl = user.avatarUrl || CONSTANTS.DEFAULT_AVATAR;
      const content = item.content;
      let lon = parseFloat(location.lon.toFixed(14));
      let lat = parseFloat(location.lat.toFixed(14));
      let mediaUrl = CONSTANTS.RANDOM_IMAGE;
      if (item.media != [] && item.media.length > 0) {
        mediaUrl = item.media[0].url;
      }
      return (
        <Marker
          key={index}
          title={name}
          description={content}
          // pinColor="red"
          // draggable
          coordinate={{ latitude: lat, longitude: lon }}>
          <Image
            style={{
              height: 50,
              width: 50,
              borderRadius: 25,
              backgroundColor: 'white',
            }}
            source={{ uri: imageUrl }}
          />
          <Callout
            onPress={() => {
              props.navigation.navigate('PostDetails', {
                postId: item.id,
              });
            }}
            style={{
              width: 104,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={{ uri: mediaUrl }}
              style={{
                height: 50,
                backgroundColor: 'red',
                width: 100,
                resizeMode: 'cover',
              }}
            />
            <Text>{content}</Text>
          </Callout>
        </Marker>
      );
    });
  }

  return (
    <MapViewScreen
      {...props}
      isLoading={isLoading}
      _renderHeaderTab={_renderHeaderTab}
      renderMapViewComponent={renderMapViewComponent}
    />
  );
}

const mapStateToProps = store => ({
  posts: store.posts.posts,
  postLen: store.posts.postLen,
  isLoading: store.posts.isLoading,
  sortType: store.posts.sortType,
  user: store.user,
});
const MapViewScreenContainerWrapper = connect(mapStateToProps)(MapViewScreenContainer);
export default MapViewScreenContainerWrapper;