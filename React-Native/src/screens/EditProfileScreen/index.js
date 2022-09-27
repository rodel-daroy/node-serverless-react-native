import React, { useState, useEffect, useContext } from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import { connect } from 'react-redux';

import DefaultErrorContext from '../../context/DefaultError/DefaultErrorContext';
import PopupContext from '../../context/Popup/PopupContext';
import {
  getMySettings,
  updateMyAvatar,
  updateMyBackground,
  updateMySettings,
} from '../../actions/userActions';
import CONSTANTS from '../../common/PeertalConstants';
import SettingsObject from '../../models/SettingsObject';
import EditProfileScreen from "./EditProfileScreen";

const EditProfileScreenContainer = (props) => {
  const { defaultError } = useContext(DefaultErrorContext);
  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;

  const [isLoading, setIsLoading] = useState(true);
  const [defaultTab, setDefaultTab] = useState("Posts");
  const [accountType, setAccountType] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [backgroundUrl, setBackgroundUrl] = useState("");
  const [contactType, setContactType] = useState("email");
  const [country, setCountry] = useState("");
  const [exchangeRate, setExchangeRate] = useState();
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("")
  const [introduction, setIntroduction] = useState("");
  const [language, setLanguage] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [over18, setOver18] = useState(1);
  const [preferredCurrency, setPreferredCurrency] = useState("");
  const [subscribeToAdultContent, setSubscribeToAdultContent] = useState();
  const [allowPeopleToSeeMe, setAllowPeopleToSeeMe] = useState(true);
  const [focused, setFocused] = useState('');

  useEffect(() => {
    if (props.user.loggedStatus === 'logged') {
      getMySettings(props.user.accessToken, props.user.userId, res => {
        let settings;
        res == null ? (settings = new SettingsObject()) : (settings = res.data.data);
        settings.accountType = settings.accountType || 'individual';
        settings.language = settings.language || 'english';
        settings.country = settings.country || 'australia';
        settings.gender = settings.gender || 'male';
        settings.maritalStatus = settings.maritalStatus || 'any';
        setAccountType(settings.accountType);
        setAccounts(settings.accounts);
        setAvatarUrl(settings.avatarUrl);
        setBackgroundUrl(settings.backgroundUrl);
        setContactType(settings.contactType);
        setCountry(settings.country);
        setExchangeRate(settings.exchangeRate);
        setFullName(settings.fullName);
        setGender(settings.gender);
        setIntroduction(settings.introduction);
        setLanguage(settings.language);
        setMaritalStatus(settings.maritalStatus);
        setOver18(settings.over18);
        setPreferredCurrency(settings.preferredCurrency);
        setSubscribeToAdultContent(settings.subscribeToAdultContent);
        setAllowPeopleToSeeMe(settings.allowPeopleToSeeMe);
        setIsLoading(false);
      }, (err) => {
        defaultError(err);
        props.navigation.goBack();
      });
    }
  }, [props.user.userId, props.user.accessToken, props.user.loggedStatus]);

  const handleUpdateBackground = () => {
    ImagePicker.openPicker({
      width: 800,
      height: 400,
      cropping: true,
      cropperChooseText: 'Choose',
      cropperToolbarTitle: 'Crop your background here',
      includeExif: true,
      mediaType: 'any',
      forceJpg: true,
      compressImageQuality: 0.5,
      compressImageMaxWidth: 800,
      compressImageMaxHeight: 400,
      includeBase64: true,
    }).then(image => {
      setBackgroundUrl(image.path);
      updateMyBackground(
        props.user.accessToken,
        props.user.userId,
        image.data,
        res => {
          alert({ title: 'Message', main: 'Your background has been updated' });
          setBackgroundUrl(res.data.data.url);
        }, (err) => {
          defaultError(err);
          props.navigation.goBack();
        }
      );
    });
  };

  const onCameraButtonPress = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      cropperChooseText: 'Choose',
      cropperToolbarTitle: 'Crop your photo here',
      includeExif: true,
      mediaType: 'any',
      forceJpg: true,
      compressImageQuality: 0.5,
      compressImageMaxWidth: 800,
      compressImageMaxHeight: 800,
      includeBase64: true,
    }).then(image => {
      // setAvatarUrl(image.path);
      updateMyAvatar(
        props.user.accessToken,
        props.user.userId,
        image.data,
        res => {
          setAvatarUrl(res.data.data.url);
        },
        (err) => {
          defaultError(err);
          props.navigation.goBack();
        }
      );
    });
  };

  const _updateData = () => {
    let settings = {
      accountType: accountType,
      accounts: accounts,
      avatarUrl: avatarUrl,
      backgroundUrl: backgroundUrl,
      contactType: contactType,
      country: country,
      exchangeRate: exchangeRate,
      fullName: fullName,
      gender: gender,
      introduction: introduction,
      language: language,
      maritalStatus: maritalStatus,
      over18: over18,
      preferredCurrency: preferredCurrency,
      subscribeToAdultContent: subscribeToAdultContent,
    };

    setIsLoading(true);

    updateMySettings(
      props.user.accessToken,
      props.user.userId,
      settings,
      res => {
        setIsLoading(false);
        const settings = res.data.data;
        props.dispatch({
          type: 'UPDATE_MY_SETTINGS',
          data: { ...settings },
        });
        setAccountType(settings.accountType);
        setAccounts(settings.accounts);
        setAvatarUrl(settings.avatarUrl);
        setBackgroundUrl(settings.backgroundUrl);
        setContactType(settings.contactType);
        setCountry(settings.country);
        setExchangeRate(settings.exchangeRate);
        setFullName(settings.fullName);
        setGender(settings.gender);
        setIntroduction(settings.introduction);
        setLanguage(settings.language);
        setMaritalStatus(settings.maritalStatus);
        setOver18(settings.over18);
        setPreferredCurrency(settings.preferredCurrency);
        setSubscribeToAdultContent(settings.subscribeToAdultContent);
        setAllowPeopleToSeeMe(settings.allowPeopleToSeeMe);
        setIsLoading(false);
        // props.navigation.navigate('Discover');
      }, (err) => {
        setIsLoading(false);
        defaultError(err);
        props.navigation.goBack();
      }
    );
  }

  const loadingData = () => {
    setIsLoading(true);
    getMySettings(props.user.accessToken, props.user.userId, res => {
      let settings = res.data.data;
      settings.accountType = settings.accountType || 'individual';
      settings.language = settings.language || 'english';
      settings.country = settings.country || 'australia';
      settings.gender = settings.gender || 'male';
      settings.maritalStatus = settings.maritalStatus || 'any';
      setAccountType(settings.accountType);
      setAccounts(settings.accounts);
      setAvatarUrl(settings.avatarUrl);
      setBackgroundUrl(settings.backgroundUrl);
      setContactType(settings.contactType);
      setCountry(settings.country);
      setExchangeRate(settings.exchangeRate);
      setFullName(settings.fullName);
      setGender(settings.gender);
      setIntroduction(settings.introduction);
      setLanguage(settings.language);
      setMaritalStatus(settings.maritalStatus);
      setOver18(settings.over18);
      setPreferredCurrency(settings.preferredCurrency);
      setSubscribeToAdultContent(settings.subscribeToAdultContent);
      setAllowPeopleToSeeMe(settings.allowPeopleToSeeMe);
      setIsLoading(false);
    }, (err) => {
      defaultError(err);
      props.navigation.goBack();
    });
  }

  const avatarUrlData = avatarUrl || CONSTANTS.DEFAULT_AVATAR;
  const backgroundUrlData = backgroundUrl || CONSTANTS.RANDOM_IMAGE;

  return (
    <EditProfileScreen
      {...props}
      isLoading={isLoading}
      accountType={accountType}
      setAccountType={setAccountType}
      avatarUrlData={avatarUrlData}
      backgroundUrlData={backgroundUrlData}
      country={country}
      setCountry={setCountry}
      fullName={fullName}
      setFullName={setFullName}
      gender={gender}
      setGender={setGender}
      introduction={introduction}
      setIntroduction={setIntroduction}
      language={language}
      setLanguage={setLanguage}
      maritalStatus={maritalStatus}
      setMaritalStatus={setMaritalStatus}
      over18={over18}
      setOver18={setOver18}
      subscribeToAdultContent={subscribeToAdultContent}
      setSubscribeToAdultContent={setSubscribeToAdultContent}
      handleUpdateBackground={handleUpdateBackground}
      onCameraButtonPress={onCameraButtonPress}
      _updateData={_updateData}
      loadingData={loadingData}
      allowPeopleToSeeMe={allowPeopleToSeeMe}
      setAllowPeopleToSeeMe={setAllowPeopleToSeeMe}
      CONSTANTS={CONSTANTS}
      preferredCurrency={preferredCurrency}
      setPreferredCurrency={setPreferredCurrency}
      focused={focused}
      setFocused={setFocused}
    />
  );
}

const mapStateToProps = store => ({
  user: store.user,
});
const EditProfileScreenContainerWrapper = connect(mapStateToProps)(EditProfileScreenContainer);
export default EditProfileScreenContainerWrapper;
