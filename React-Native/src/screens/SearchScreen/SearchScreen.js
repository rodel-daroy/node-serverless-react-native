import React from 'react';
import { Icon } from 'native-base';
import { css } from '@emotion/native';
import { View, TouchableOpacity, TextInput, FlatList, } from 'react-native';

import { Text, LoadingSpinner, } from '../../components/CoreUIComponents';
import CONSTANTS from '../../common/PeertalConstants';

const SearchScreen = (props) => {
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          marginTop: CONSTANTS.SPARE_HEADER,
          marginHorizontal: 15,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            marginLeft: 10,
            marginRight: 10,
            height: 34,
            backgroundColor: CONSTANTS.MY_GRAYBG,
            width: CONSTANTS.WIDTH_RATIO * 286,
            borderRadius: 17,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: '100%',
              row: '100%',
            }}>
            <TextInput
              onSubmitEditing={() =>
                props._searchAction(props.tabSelected)
              }
              style={{
                fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
                fontSize: 12,
                color: 'gray',
                marginLeft: 14,
              }}
              value={props.text}
              onFocus={() => props.setNoResults(false)}
              autoFocus={true}
              placeholder="Search"
              placeholderTextColor="gray"
              onChangeText={text => props.setText(text)}
              returnKeyType="search"
            />
            <TouchableOpacity
              onPress={() => props._searchAction(props.tabSelected)}>
              <Icon
                name="search"
                type="EvilIcons"
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => props.navigation.goBack()}
          style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text>Cancel</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 15 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginBottom: 15,
          }}>
          <TouchableOpacity
            onPress={() => {
              props.setTabSelected('people');
              props._searchAction('people');
            }}>
            <Text
              style={{
                fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                fontSize: 22,
                color:
                  props.tabSelected !== 'people'
                    ? CONSTANTS.MY_GREY
                    : 'black',
              }}>
              People
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              props.setTabSelected('conversation');
              props._searchAction('conversation');
            }}>
            <Text
              style={{
                fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                fontSize: 22,
                color:
                  props.tabSelected !== 'conversation'
                    ? CONSTANTS.MY_GREY
                    : 'black',
              }}>
              Conversation
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            backgroundColor: CONSTANTS.MY_GRAYBG,
            minHeight: CONSTANTS.HEIGHT - 50,
          }}>
          <View
            style={{
              alignItems: 'center',
            }}>
            <FlatList
              style={flatListStyle}
              refreshing={props.isLoading}
              data={
                props.tabSelected == 'conversation'
                  ? props.posts
                  : props.people
              }
              keyExtractor={props._keyExtractor}
              renderItem={props._renderItem}
              onEndReached={props._loadData}
            />
            {props.isLoading ? <LoadingSpinner /> : null}
            {props.people.length == 0 && !props.isLoading ? (
              <Text style={{ marginTop: 80 }}>
                {props.noResults
                  ? 'No results'
                  : 'Please enter the keyword'}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}

export default SearchScreen;

const flatListStyle = css`
  background-color: ${CONSTANTS.MY_GRAYBG};
  width: 100%;
  margin-bottom: 320px;
`;