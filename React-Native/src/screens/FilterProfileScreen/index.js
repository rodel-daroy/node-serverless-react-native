import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import CONSTANTS from '../../common/PeertalConstants';
import FilterFriendsObject from '../../models/FilterFriendsSetting';
import SkillTags from './SkillTags';
import PersonalityItem from './PersonalityItem';
import FilterProfileScreen from './FilterProfileScreen';

const FilterProfileScreenContainer = (props) => {

  const [isLoading, setIsLoading] = useState(false);
  const [suggestedGoogleAddress, setSuggestedGoogleAddress] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState(0);
  const [selectingCharacter, setSelectingCharacter] = useState(0);
  const [gender, setGender] = useState('any');
  const [maritalStatus, setMaritalStatus] = useState('any');
  const [skillValue, setSkillValue] = useState('');
  const [skillList, setSkillList] = useState([]);
  const [characterArray, setCharacterArray] = useState(getPersonalityData());
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
  }, [])

  const _selectSuggestedAddress = (data, details = null) => {
    setSuggestedGoogleAddress({ lat: details.geometry.location.lat, lon: details.geometry.location.lng });
  };

  const _applyAction = () => {
    let tempSetting = {
      ...new FilterFriendsObject(),
      gender: gender,
      maritalStatus: maritalStatus,
      selectedCharacter: selectedCharacter,
      skills: skillList,
      location: suggestedGoogleAddress
    };
    props.dispatch({
      type: 'UPDATE_FILTER_FRIENDS_SETTINGS',
      data: tempSetting,
    });
    setTimeout(() => {
      props.navigation.goBack();
    }, 100);

  }

  const _addSkillAction = () => {
    const temp = skillValue;
    if (skillList.indexOf(temp) === -1 && temp != '') {
      setSkillList(skillList.concat(temp));
      setSkillValue('');
    } else setSkillValue('')
  }

  const _renderSkillTags = () => {
    return (
      <SkillTags
        skillList={skillList}
        setSkillList={setSkillList}
      />
    );
  }

  const _renderItem = ({ item, index }) => {
    return (
      <PersonalityItem
        {...props}
        item={item}
        index={index}
        selectedCharacter={selectedCharacter}
        setSelectedCharacter={setSelectedCharacter}
      />
    );
  }

  const loadingData = () => {
    const globalFilterSettings = props.user.filterFriends;
    setSkillList(globalFilterSettings.skills ? globalFilterSettings.skills : skillList);
    setGender(globalFilterSettings.gender ? globalFilterSettings.gender : gender)
    setMaritalStatus(globalFilterSettings.maritalStatus ? globalFilterSettings.maritalStatus : maritalStatus)
    setSelectedCharacter(globalFilterSettings.selectedCharacter ? globalFilterSettings.selectedCharacter : selectedCharacter)
  }

  const backgroundRes = require('../../assets/xd/background/map_bg.png');

  return (
    <FilterProfileScreen
      {...props}
      setSelectingCharacter={setSelectingCharacter}
      gender={gender}
      setGender={setGender}
      maritalStatus={maritalStatus}
      setMaritalStatus={setMaritalStatus}
      skillValue={skillValue}
      setSkillValue={setSkillValue}
      characterArray={characterArray}
      _selectSuggestedAddress={_selectSuggestedAddress}
      _applyAction={_applyAction}
      _addSkillAction={_addSkillAction}
      _renderSkillTags={_renderSkillTags}
      _renderItem={_renderItem}
      loadingData={loadingData}
      backgroundRes={backgroundRes}
      isLoading={isLoading}
    />
  );
}

const mapStateToProps = store => ({
  user: store.user,
});
const FilterProfileContainerWrapper = connect(mapStateToProps)(FilterProfileScreenContainer);
export default FilterProfileContainerWrapper;

const styles = {
  title: {
    marginVertical: 15,
    marginLeft: 15,
    fontSize: 18,
    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
    color: 'black',
  },
};
const getPersonalityData = (gender = 'man') => {
  let $personalityData = [];
  $personalityData.push({
    code: '',
    name: 'None',
    summary: 'Unselected...',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/istj.png',
    app_image_src: require('../../assets/character/man-Logistician.png'),
  });
  $personalityData.push({
    code: 'istj',
    name: 'Logistician',
    summary:
      'Practical and fact-minded individuals, whose reliability cannot be doubted.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/istj.png',
    app_image_src: require('../../assets/character/man-Logistician.png'),
  });
  $personalityData.push({
    code: 'istp',
    name: 'Virtuoso',
    summary: 'Bold and practical experimenters, masters of all kinds of tools.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/istp.png',
    app_image_src: require('../../assets/character/man-Virtuoso.png'),
  });
  $personalityData.push({
    code: 'isfj',
    name: 'Defender',
    summary:
      'Very dedicated and warm protectors, always ready to defend their loved ones.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/isfj.png',
    app_image_src: require('../../assets/character/man-Defender.png'),
  });
  $personalityData.push({
    code: 'isfp',
    name: 'Adventurer',
    summary:
      'Flexible and charming artists, always ready to explore and experience something new.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/isfp.png',
    app_image_src: require('../../assets/character/man-Adventurer.png'),
  });
  $personalityData.push({
    code: 'intj',
    name: 'Architect',
    summary:
      'Bold, imaginative and strong-willed leaders, always finding a way – or making one.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/intj.png',
    app_image_src: require('../../assets/character/man-Architect.png'),
  });
  $personalityData.push({
    code: 'intp',
    name: 'Logician',
    summary: 'Innovative inventors with an unquenchable thirst for knowledge.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/intp.png',
    app_image_src: require('../../assets/character/man-Logician.png'),
  });
  $personalityData.push({
    code: 'infj',
    name: 'Advocate',
    summary: 'Quiet and mystical, yet very inspiring and tireless idealists.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/infj.png',
    app_image_src: require('../../assets/character/man-Advocate.png'),
  });
  $personalityData.push({
    code: 'infp',
    name: 'Mediator',
    summary:
      'Poetic, kind and altruistic people, always eager to help a good cause.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/infp.png',
    app_image_src: require('../../assets/character/man-Mediator.png'),
  });
  $personalityData.push({
    code: 'estj',
    name: 'Executive',
    summary:
      'Excellent administrators, unsurpassed at managing things – or people.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/estj.png',
    app_image_src: require('../../assets/character/man-Executive.png'),
  });
  $personalityData.push({
    code: 'estp',
    name: 'Entrepreneur',
    summary:
      'Smart, energetic and very perceptive people, who truly enjoy living on the edge.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/estp.png',
    app_image_src: require('../../assets/character/man-Entrepreneur.png'),
  });
  $personalityData.push({
    code: 'esfj',
    name: 'Consul',
    summary:
      'Extraordinarily caring, social and popular people, always eager to help.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/esfj.png',
    app_image_src: require('../../assets/character/man-Consul.png'),
  });
  $personalityData.push({
    code: 'esfp',
    name: 'Entertainer',
    summary:
      'Spontaneous, energetic and enthusiastic people – life is never boring around them.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/esfp.png',
    app_image_src: require('../../assets/character/man-Entertainer.png'),
  });
  $personalityData.push({
    code: 'entj',
    name: 'Commander',
    summary:
      'Bold, imaginative and strong-willed leaders, always finding a way – or making one.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/entj.png',
    app_image_src: require('../../assets/character/man-Commander.png'),
  });
  $personalityData.push({
    code: 'entp',
    name: 'Debater',
    summary:
      'Smart and curious thinkers who cannot resist an intellectual challenge.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/entp.png',
    app_image_src: require('../../assets/character/man-Debater.png'),
  });
  $personalityData.push({
    code: 'enfj',
    name: 'Protagonist',
    summary:
      'Charismatic and inspiring leaders, able to mesmerize their listeners.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/enfj.png',
    app_image_src: require('../../assets/character/man-Protagonist.png'),
  });
  $personalityData.push({
    code: 'enfp',
    name: 'Campaigner',
    summary:
      'Enthusiastic, creative and sociable free spirits, who can always find a reason to smile.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/enfp.png',
    app_image_src: require('../../assets/character/man-Campaigner.png'),
  });
  return $personalityData;
};
