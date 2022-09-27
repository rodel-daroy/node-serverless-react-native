import React from 'react';
import {
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Icon } from 'native-base';

import SelectCountryModal from '../../components/SelectCountryModal';
import CONSTANTS from '../../common/PeertalConstants';
import {
  OverlayLoading,
  Text,
  RoundButton,
} from '../../components/CoreUIComponents';

const ReportProblemScreen = (props) => {

  const {
    isLoading,
    description,
    setDescription,
    topic,
    email,
    setEmail,
    phone,
    setPhone,
    _submitProblem,
    _renderMedia,
    _handleUploadPhoto,
    title,
    pageName1,
    pageName2,
    listIssues,
    summary,
    setProblem,
    isSelectCountryModal,
    setIsSelectCountryModal,
    country,
    setCountry,
    currentCode,
    setCurrentCode,
    focusedInput,
    setFocusedInput,
  } = props;

  return (
    <View style={{ flexDirection: 'column', height: '100%' }}>
      <View
        style={{
          height: 48,
          marginTop: CONSTANTS.SPARE_HEADER,
          alignItems: 'center',
          shadowColor: '#000',
          borderBottomWidth: 1,
          borderBottomColor: 'white',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          ...CONSTANTS.TOP_SHADOW_STYLE
        }}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Icon name="arrowleft" type="AntDesign" style={{ marginLeft: CONSTANTS.MARGIN_LEFT_FOR_BACK_ICON }} />
        </TouchableOpacity>
        <View
          style={{
            marginLeft: 0,
            width: CONSTANTS.WIDTH - 15 - 30 - 30,
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
              color: '#414042',
              marginLeft: -CONSTANTS.MARGIN_LEFT_FOR_BACK_ICON
            }}>
            {title}
          </Text>
        </View>
      </View>

      <ImageBackground
        style={{
          width: '100%',
          height: 200,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        source={require('../../assets/xd/header/contact_header.png')}>
        <Text
          style={{
            fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD,
            alignSelf: 'center',
            color: 'white',
            fontSize: CONSTANTS.MY_FONT_HEADER_1_SIZE,
          }}>
          {pageName1}
        </Text>
        <Text
          style={{
            fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
            alignSelf: 'center',
            color: 'white',
            fontSize: CONSTANTS.MY_FONT_HEADER_1_SIZE,

          }}>
          {pageName2}
        </Text>
      </ImageBackground>
      <ScrollView style={{ paddingHorizontal: 15, marginTop: 20 }}>
        <Text style={{
          color: "#414042",
          fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT
        }}>{summary}</Text>
        <View>
          <View style={styles.lineContainer}>
            <Icon
              name="email"
              type="MaterialCommunityIcons"
              style={{ ...styles.iconStyle }}
            />
            <Text style={{ ...styles.textCaption }}>Your Email</Text>
          </View>
          <TextInput
            autoFocus={true}
            style={{
              ...styles.inputContainer, borderColor: focusedInput == 'email' ? CONSTANTS.MY_FOCUSED_BORDER_COLOR : CONSTANTS.MY_UNFOCUSED_BORDER_COLOR
            }}
            onFocus={e => {
              setFocusedInput('email');
            }}
            onBlur={e => {
              setFocusedInput('');
            }}
            placeholder={'Enter your email'}
            value={email}
            onChangeText={value => setEmail(value)}
          />
        </View>
        <View>
          <View style={styles.lineContainer}>
            <Icon
              name="phone"
              type="MaterialCommunityIcons"
              style={{ ...styles.iconStyle }}
            />
            <Text style={{ ...styles.textCaption }}>Your Phone</Text>
          </View>
        </View>
        <View>
          <View
            style={{
              marginTop: 10,
              borderColor: CONSTANTS.MY_UNFOCUSED_BORDER_COLOR,
              borderWidth: 1,
              alignItems: 'center',
              borderRadius: 10,
              flexDirection: 'row',
              height: 50
            }}>
            <TouchableOpacity
              onPress={() => {
                props.setIsSelectCountryModal(true);
              }}
              style={{
                width: '100%',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <View style={{
                width: '85%',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
                <Text style={{ alignSelf: 'center', marginLeft: 10, fontSize: 16, fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT }}>
                  {country}
                </Text>
              </View>
              <View
                style={{
                  fontSize: 14,
                  marginVertical: 10,
                  marginHorizontal: 10,
                  width: '100%',
                  fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
                }}>
                <Icon name="arrow-down" style={{ fontSize: 19, fontWeight: 'bold' }} />
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: 17,
              height: 50,
              borderColor: focusedInput == 'phone' ? CONSTANTS.MY_FOCUSED_BORDER_COLOR : CONSTANTS.MY_UNFOCUSED_BORDER_COLOR,
              borderWidth: 1,
              alignItems: 'center',
              borderRadius: 10,
              flexDirection: 'row',
            }}>
            <Text style={{ alignSelf: 'center', marginLeft: 10, fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT, }}>
              {currentCode}
            </Text>
            <TextInput
              onFocus={e => {
                setFocusedInput('phone');
              }}
              onBlur={e => {
                setFocusedInput('');
              }}
              textContentType={'telephoneNumber'}
              keyboardType={'phone-pad'}
              placeholder="your phone number"
              style={{
                fontSize: 14,
                marginVertical: 10,
                marginHorizontal: 10,
                width: CONSTANTS.WIDTH - 120,
                fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
              }}
              onChangeText={value => setPhone(value)}
              value={phone}
            />
          </View>
        </View>



        {/*  <View>
          <View style={styles.lineContainer}>
            <Icon
              name="bug-report"
              type="MaterialIcons"
              style={{ ...styles.iconStyle }}
            />
            <Text style={{ ...styles.textCaption }}>Category</Text>
          </View>

          <DropdownSelect
            data={listIssues.map(item => ({ label: item, value: item }))}
            value={topic}
            onChangeValue={text => setProblem(text)}
            style={styles.dropdown}
          />
        </View> */}
        <View>
          <View style={styles.lineContainer}>
            <Icon
              name="message"
              type="MaterialCommunityIcons"
              style={{ ...styles.iconStyle, }}
            />
            <Text style={{ ...styles.textCaption }}>What's on your mind?</Text>
          </View>
          <TextInput
            style={{ ...styles.inputWithMultiLinesContainer, borderColor: focusedInput == 'desc' ? CONSTANTS.MY_FOCUSED_BORDER_COLOR : CONSTANTS.MY_UNFOCUSED_BORDER_COLOR, }}
            onFocus={e => {
              setFocusedInput('desc');
            }}
            onBlur={e => {
              setFocusedInput('');
            }}
            placeholder={'Enter your message here...'}
            value={description}
            multiline={true}
            onChangeText={value => setDescription(value)}
          />
        </View>
        <View>
          {/* <TouchableOpacity
            style={styles.lineContainer}
            onPress={_handleUploadPhoto}>
            <Icon
              name="camera"
              type="MaterialIcons"
              style={{ ...styles.iconStyle }}
            />
            <Text style={{ ...styles.textCaption }}>Attached screenshots:</Text>
            {_renderMedia()}
          </TouchableOpacity> */}
        </View>
        <RoundButton
          text="Submit"
          style={{ marginTop: 20 }}
          onPress={_submitProblem}
        />
        <View style={{ height: 100 }} />
        {isLoading ? <OverlayLoading /> : null}
      </ScrollView>
      <SelectCountryModal
        enabled={isSelectCountryModal}
        onClose={() => { setIsSelectCountryModal(false) }}
        listCountries={listCountries}
        country={props.country}
        setCountry={props.setCountry}
        setCurrentCode={props.setCurrentCode}
      />
    </View>
  );
}

export default ReportProblemScreen;

const listCountries = [
  {
    country: 'Australia',
    phoneCode: '+61',
    code: 'AU',
  },
  {
    country: 'New Zealand',
    phoneCode: '+64',
    code: 'NZ',
  },
  {
    country: 'Vietnam',
    phoneCode: '+84',
    code: 'NZ',
  },
];

const styles = {
  lineContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    marginTop: 20,
  },
  textCaption: {
    marginLeft: 12,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
    color: '#414042'
  },
  inputContainer: {
    marginTop: 10,
    padding: 15,
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT
  },
  inputWithMultiLinesContainer: {
    minHeight: 100,
    marginTop: 10,
    padding: 15,
    borderWidth: 1,
    backgroundColor: 'white',
    textAlignVertical: 'top',
    borderRadius: 10,
  },
  iconStyle: {
    fontSize: 18,
  },
  lineHalfContainer: {
    flexDirection: 'row',
    width: 160 * CONSTANTS.WIDTH_RATIO,
    justifyContent: 'flex-start',
    marginTop: 20,
  },
  dropdown: {
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  image: { height: 12, width: 42 },
  screenshot: { height: 20, width: 20, marginLeft: 10 },
};
