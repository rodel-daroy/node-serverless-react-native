import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { NavigationEvents } from "react-navigation";

import CONSTANTS from "../../common/PeertalConstants";
import { LoadingSpinner } from "../../components/CoreUIComponents";
import Footer from "../../components/Footer";
import PeopleHeader from "./PeopleHeader";
import SearchBar from "../../components/SearchBar";

const PeopleListScreen = (props) => {

  const {
    filterType,
    people,
    isLoading,
    _loadingData,
    _refreshData,
    _renderHeader,
    handleLoadMore,
    _renderItem,
    _keyExtractor,
  } = props;

  const handleSelectType = (sType) => {
    if (filterType === sType) return;
    _refreshData(sType);
  }

  return (
    <View style={{ flexDirection: "column", flex: 1 }}>
      <NavigationEvents
        onWillFocus={() => {
          _loadingData();
        }}
      />
      <View
        style={{
          flex: 100 + CONSTANTS.SPARE_HEADER,
          flexDirection: "column",
          height: 120,
          backgroundColor: "white"
        }}
      >
        <View style={{ flexDirection: "row", marginTop: CONSTANTS.SPARE_HEADER }}>
          <TouchableOpacity onPress={() => props.navigation.toggleDrawer()}>
            <Image
              source={{ uri: props.user.avatarUrl }}
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                marginLeft: 10
              }}
            />
          </TouchableOpacity>
          <SearchBar navigation={props.navigation} />
        </View>
        <PeopleHeader
          handleSelectType={handleSelectType}
          currentTab={filterType}
        />
      </View>
      <View
        style={{
          // backgroundColor: "gray",
          flex: CONSTANTS.HEIGHT - 55 - 100 - CONSTANTS.SPARE_FOOTER - CONSTANTS.SPARE_HEADER
        }}
      >
        <FlatList
          style={{
            backgroundColor: CONSTANTS.MY_GRAYBG,
            flexDirection: "column"
          }}
          keyboardShouldPersistTaps="handled"
          //onRefresh={_refreshData()}
          refreshing={isLoading}
          data={people}
          initialNumToRender={20}
          keyExtractor={_keyExtractor}
          renderItem={_renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.8}
          ListFooterComponent={() => {
            return (
              isLoading ? <LoadingSpinner /> :
                people.length < 1 ? <View
                  style={{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Text>No one has been found</Text>
                </View> : null
            );
          }}
          ListHeaderComponent={_renderHeader}
        />
      </View>

      <View style={{ flex: 55 + CONSTANTS.SPARE_FOOTER }}>
        <Footer {...props} active="people" />
      </View>
    </View>
  );
}

export default PeopleListScreen;
