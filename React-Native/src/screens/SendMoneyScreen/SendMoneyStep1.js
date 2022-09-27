import React, {memo} from 'react';
import {View, TouchableOpacity, TextInput} from 'react-native';
import {Icon} from 'native-base';
import {ScrollView} from 'react-native-gesture-handler';

import {Text, Avatar, RoundButton} from '../../components/CoreUIComponents';
import CONSTANTS from '../../common/PeertalConstants';

const SendMoneyStep1 = (props) => {
  const {
    description,
    setDescription,
    tagList,
    checkSteps,
    updateTagList,
    focusedInput,
    setFocusedInput,
  } = props;

  return (
    <View style={{marginLeft: 20, marginRight: 15}}>
      <Text style={{marginTop: 40, color: CONSTANTS.MY_BLUE}}>Step 1</Text>
      <Text
        style={{
          marginTop: 0,
          fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
          color: CONSTANTS.MY_BLUE,
          fontSize: 18,
        }}>
        Recipient Info
      </Text>
      <View
        style={{
          width: '100%',
          borderBottomColor: '#D1D3D4',
          borderBottomWidth: 1,
          height: 20,
        }}
      />
      <View style={{marginTop: 22.5, marginBottom: 16}}>
        <Text>Send To</Text>
      </View>
      <ScrollView
        horizontal
        style={{flexDirection: 'row', alignContent: 'center'}}>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate('TagPeople', {
              callback: updateTagList,
              withDone: true,
            })
          }
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            margin: 10,
            borderColor: CONSTANTS.MY_BLUE,
            borderWidth: 1,
            backgroundColor: 'white',
            width: 50,
            height: 50,
            borderRadius: 25,
          }}>
          <Icon
            name="plus"
            type="AntDesign"
            style={{fontSize: 25, color: CONSTANTS.MY_BLUE}}
          />
        </TouchableOpacity>
        {tagList.map((item, index) => (
          <Avatar
            source={{uri: item.avatarUrl}}
            text={item.fullName.split(' ')[0]}
            key={index}
          />
        ))}
      </ScrollView>
      {/* <View
                style={{ flexDirection: "row", marginTop: 10, alignItems: "center" }}
            >
                <Icon style={{ fontSize: 16 }} name="md-person" type="Ionicons" />
                <Text style={{ marginLeft: 10, fontSize: 12 }}>Recipient</Text>
            </View>
            <TextInput
                style={{ ...styles.textInput }}
                editable={false}
                value={tagList.map(item => " " + item.fullName).toString()}
                placeholder="Click plus icon to choose"
            /> */}
      <View style={{flexDirection: 'row', marginTop: 19, alignItems: 'center'}}>
        <Icon style={{fontSize: 16}} name="file-invoice" type="FontAwesome5" />
        <Text style={{marginLeft: 10, fontSize: 12}}>Payment Info</Text>
      </View>
      <TextInput
        style={{
          ...styles.textInput,
          height: 90,
          textAlignVertical: 'top',
          borderColor:
            focusedInput == 'desc'
              ? CONSTANTS.MY_FOCUSED_BORDER_COLOR
              : CONSTANTS.MY_UNFOCUSED_BORDER_COLOR,
          padding: 10,
        }}
        onFocus={(e) => {
          setFocusedInput('desc');
        }}
        onBlur={(e) => {
          setFocusedInput('');
        }}
        multiline
        value={description}
        onChangeText={(text) => setDescription(text)}
        placeholder=" Message..."
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginHorizontal: 0,
          marginTop: 20,
          width: '100%',
          justifyContent: 'space-between',
        }}>
        <RoundButton
          text="Cancel"
          type="gray"
          style={{width: '47%'}}
          onPress={() => props.navigation.goBack()}
        />
        <RoundButton
          text="Next"
          style={{width: '47%'}}
          onPress={() => checkSteps(1)}
        />
      </View>
    </View>
  );
};

export default memo(SendMoneyStep1);

const styles = {
  step: {
    marginVertical: 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: CONSTANTS.MY_BLUE,
    marginLeft: -40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    color: 'white',
    marginLeft: 35,
    fontSize: 22,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
  },
  stepNoActive: {
    marginVertical: 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: CONSTANTS.MY_GRAYBG,
    marginLeft: -40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNoActiveText: {
    color: CONSTANTS.MY_GREY,
    marginLeft: 35,
    fontSize: 22,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
  },
  textInput: {
    padding: 5,
    width: '100%',
    borderRadius: 10,
    minHeight: 50,
    backgroundColor: 'white',
    borderWidth: 1,
    marginTop: 10,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
  },
  dollarInput: {
    // padding: 5,
    width: '50%',
    textAlign: 'right',
    // marginTop: 10
  },
  dollarBox: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    borderRadius: 5,
    justifyContent: 'space-between',
    borderRadius: 5,
    minHeight: 50,
    backgroundColor: 'white',
    borderWidth: 1,
    borderBottomColor: 'black',
    paddingHorizontal: 10,
  },
  blueTitle: {
    fontSize: 12,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
    color: CONSTANTS.MY_BLUE,
    marginTop: 10,
  },
};
