import React from 'react';
import Carousel from 'react-native-snap-carousel';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import LinearGradient from 'react-native-linear-gradient';
import {
  ImageBackground,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';

import CONSTANTS from '../../common/PeertalConstants';
import {
  GenderSelect,
  OverlayLoading,
  StatusSelect,
  Text,
} from '../../components/CoreUIComponents';

const FilterProfileScreen = (props) => {

  const {
    isLoading,
    setSelectingCharacter,
    gender,
    setGender,
    maritalStatus,
    setMaritalStatus,
    skillValue,
    setSkillValue,
    characterArray,
    _selectSuggestedAddress,
    _applyAction,
    _addSkillAction,
    _renderSkillTags,
    _renderItem,
    loadingData,
    backgroundRes
  } = props;

  return (
    <View style={{ height: '100%', width: '100%' }}>
      <View keyboardShouldPersistTaps="handled" style={{ flexDirection: 'column', height: '100%' }}>
        <NavigationEvents
          onWillFocus={() => {
            loadingData();
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: CONSTANTS.SPARE_HEADER,
            height: 48,
          }}>
          <TouchableOpacity
            onPress={() => props.navigation.goBack(null)}>
            <Text
              style={{
                fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
                marginLeft: 15,
                color: CONSTANTS.MY_GREY,
              }}>
              Cancel
              </Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 14,
              fontWeight: 'bold',
            }}>
            FILTER
            </Text>
          <TouchableOpacity onPress={() => _applyAction()}>
            <Text
              style={{
                marginRight: 15,
                color: CONSTANTS.MY_BLUE,
                fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
              }}>
              Apply
              </Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <LinearGradient
            colors={['#EBEAEA', '#FFFFFF']}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              height: 58,
            }}>
            <Text
              style={{
                fontSize: 18,
                marginLeft: 13,
                color: 'black',
                fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
              }}>
              Location
            </Text>
          </LinearGradient>

          <ImageBackground
            style={{
              width: '100%',
              height: 215,
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginBottom: 15,
              backgroundColor: CONSTANTS.MY_GRAYBG,
            }}
            source={backgroundRes}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 25,
                marginHorizontal: 15,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <GooglePlacesAutocomplete
                placeholder="Enter Location"
                query={{
                  // available options: https://developers.google.com/places/web-service/autocomplete
                  key: CONSTANTS.GOOGLE_API_KEY,
                  language: 'en', // language of the results
                  types: "(cities)" // default: 'geocode'
                }}
                currentLocation={true}
                currentLocationLabel="Current location"
                minLength={2}
                onPress={_selectSuggestedAddress}
                autoFocus={false}
                returnKeyType={'default'}
                fetchDetails={true}
                listViewDisplayed="auto"
                styles={{
                  textInputContainer: {
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                  },
                  textInput: {
                    marginLeft: 0,
                    marginRight: 0,
                    height: 38,
                    color: '#5d5d5d',
                    fontSize: 16,
                    fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
                  },
                  listView: {
                    backgroundColor: 'white',
                  },
                  predefinedPlacesDescription: {
                    color: '#1faadb',
                  },
                }}
                currentLocation={false}
              />
            </View>
          </ImageBackground>
          <StatusSelect
            titleFontSize={{ fontSize: 18 }}
            //initVal={true}
            value={maritalStatus}
            onChangeValue={value => setMaritalStatus(value)}
          />

          <View>
            <Text style={styles.title}>Skills</Text>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                height: 40,
                borderRadius: 20,
                alignItems: 'center',
                marginHorizontal: 15,
              }}>
              <TextInput
                style={{
                  width: CONSTANTS.WIDTH - 100 - 30,
                  backgroundColor: CONSTANTS.MY_GRAYBG,
                  fontSize: 14,
                  color: CONSTANTS.MY_GREY,
                  height: 40,
                  borderTopLeftRadius: 20,
                  borderBottomLeftRadius: 20,
                  paddingLeft: 15,
                  fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
                }}
                value={skillValue}
                placeholder="Add strengths"
                onChangeText={value => setSkillValue(value)}
              />
              <TouchableOpacity
                onPress={() => _addSkillAction()}
                style={{
                  backgroundColor: CONSTANTS.MY_BLUE,
                  width: 100,
                  padding: 5,
                  height: 40,
                  borderTopRightRadius: 20,
                  borderBottomRightRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                  }}>
                  Add skill
              </Text>
              </TouchableOpacity>
            </View>
          </View>
          {_renderSkillTags()}
          <GenderSelect
            titleFontSize={{ fontSize: 18 }}
            //initVal={true}
            value={gender}
            onChangeValue={gender => setGender(gender)}
          />
          <Text style={styles.title}>Personality</Text>

          <Carousel
            data={characterArray}
            renderItem={_renderItem}
            sliderWidth={CONSTANTS.WIDTH}
            itemWidth={CONSTANTS.WIDTH - 130}
            onSnapToItem={slideIndex =>
              setSelectingCharacter(slideIndex)
            }
          />

          {/* //render content under tab here */}
        </ScrollView>
      </View>
      {isLoading ? <OverlayLoading /> : null}
    </View>
  );
}

export default FilterProfileScreen;

const styles = {
  title: {
    marginVertical: 15,
    marginLeft: 15,
    fontSize: 18,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
    color: 'black',
  },
};