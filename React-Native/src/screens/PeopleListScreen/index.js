import React, { useState, useEffect, useContext } from "react";
import { ImageBackground, Text, TouchableOpacity } from "react-native";
import { connect } from "react-redux";

import DefaultErrorContext from '../../context/DefaultError/DefaultErrorContext';
import { useAsyncState } from '../../common/Hooks';
import { getCurrentLocation } from "../../actions/commonActions";
import { getListOfFriends, getListOfSuggestedFriends } from "../../actions/peopleActions";
import CONSTANTS from "../../common/PeertalConstants";
import PersonRowItem from "../../components/PersonRowItem";
import PeopleListScreen from './PeopleListScreen';

const PeopleListScreenContainer = (props) => {
  const { defaultError } = useContext(DefaultErrorContext);

  const [filterType, setFilterType] = useAsyncState("friend");
  const [people, setPeople] = useState([]);
  const [isEndOfList, setIsEndOfList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getCurrentLocation(position => {
      props.dispatch({
        type: "UPDATE_LONG_LAT",
        data: {
          longitude: position.coords.longitude,
          latitude: position.coords.latitude
        }
      });
    }, (err) => { defaultError(err) });
  }, []);

  const _loadingData = () => {
    _refreshData();
  }

  const _refreshData = async (tab) => {
    let curTab = tab ? tab : filterType;
    setIsLoading(true);
    setPeople([]);
    const currentFilterType = await setFilterType(curTab);
    if (curTab == "friend") {
      getListOfFriends(
        props.user.accessToken,
        props.user.userId,
        curTab,
        0,
        20,
        res => {
          if (curTab === currentFilterType) {
            setPeople(res.data.data);
            setIsLoading(false);
          } else { setIsLoading(false); }
        },
        err => {
          setIsLoading(false);
          defaultError(err);
        }
      );
    } else {
      getListOfSuggestedFriends(
        props.user.accessToken,
        props.user.userId,
        props.user.longitude,
        props.user.latitude,
        props.user.filterFriends,
        0,
        20,
        res => {
          if (curTab === currentFilterType) {
            setPeople(res.data.data);
            setIsLoading(false);
          } else { setIsLoading(false); }
        },
        err => {
          setIsLoading(false);
          defaultError(err);
        }
      );
    }
  }

  const _renderFilterHeader = () => {
    const headerPhoto = require("../../assets/xd/background/people_suggested_header.png");
    let title1 = "Here you go!";
    let title2 = "Here’s the best results based on your selected interests.";
    return (
      <ImageBackground
        source={headerPhoto}
        style={{
          flexDirection: "column",
          justifyContent: "center",
          height: 180
        }}
      >
        <Text
          style={{
            fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
            alignSelf: 'center',
            color: 'white',
            fontSize: CONSTANTS.MY_FONT_HEADER_1_SIZE,
          }}
        >
          {title1}
        </Text>
        <Text style={{
          fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
          alignSelf: 'center',
          color: 'white',
          fontSize: CONSTANTS.MY_FONT_SIZE_NORMAL
        }}>{title2}</Text>
        <TouchableOpacity
          onPress={() => props.navigation.navigate("FilterProfile")}
          style={{
            marginTop: 20,
            height: 50,
            borderRadius: 25,
            justifyContent: "center",
            alignSelf: "center",
            flexDirection: "column",
            backgroundColor: "white"
          }}
        >
          <Text
            style={{
              color: CONSTANTS.MY_BLUE,
              textAlign: "center",
              fontSize: 14,
              fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
              marginHorizontal: 25
            }}
          >
            Filter Now!
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    );
  }

  const _renderHeader = () => {
    if (props.user.loggedStatus != "guest" && filterType == "suggest") {
      return _renderFilterHeader();
    }

    let headerPhoto = require("../../assets/xd/background/people_bg.png");
    let title1 = "Hello!";
    let title2 = "Keep in touch with all of your friends!";
    if (props.sortType == "POPULAR") {
      headerPhoto = require("../../assets/xd/background/discover_popular_header.png");
      title1 = "Welcome";
      title2 = "Discover trending conversations and people";
    }
    if (props.sortType == "LOCATION") {
      headerPhoto = require("../../assets/xd/background/dicover_location_bg.png");
      title1 = "Discover";
      title2 = "local conversations and people";
    }

    return (
      <ImageBackground
        source={headerPhoto}
        style={{
          flexDirection: "column",
          justifyContent: "center",
          height: 180
        }}
      >
        <Text
          style={{
            fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
            alignSelf: 'center',
            color: 'white',
            fontSize: CONSTANTS.MY_FONT_HEADER_1_SIZE,
          }}>
          {title1}
        </Text>
        <Text style={{
          fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
          alignSelf: 'center',
          color: 'white',
          fontSize: CONSTANTS.MY_FONT_SIZE_NORMAL
        }}>{title2}</Text>
      </ImageBackground>
    );
  }

  const handleLoadMore = () => {
    if (people.length < 20 || isEndOfList) return;
    const currentPeople = people;
    const count = currentPeople.length;
    setIsLoading(true);
    getListOfFriends(
      props.user.accessToken,
      props.user.userId,
      filterType,
      count,
      20,
      res => {
        if (res.data.data.length === 0) {
          setIsEndOfList(true);
          setIsLoading(false);
          return;
        }
        setPeople(currentPeople.concat(res.data.data));
        setIsLoading(false);
      },
      err => {
        setIsLoading(false);
        defaultError(err);
      }
    );
  }

  const _renderItem = ({ item, index }) => <PersonRowItem user={props.user} data={item} navigation={props.navigation} />;

  const _keyExtractor = (item, index) => item.id.toString() + index.toString() + item.fullName;

  return (
    <PeopleListScreen
      {...props}
      filterType={filterType}
      people={people}
      isLoading={isLoading}
      _loadingData={_loadingData}
      _refreshData={_refreshData}
      _renderHeader={_renderHeader}
      handleLoadMore={handleLoadMore}
      _renderItem={_renderItem}
      _keyExtractor={_keyExtractor}
    />
  );
}

const mapStateToProps = store => ({
  user: store.user
});
const PeopleListScreenContainerWrapper = connect(mapStateToProps)(PeopleListScreenContainer);
export default PeopleListScreenContainerWrapper;
