import { Icon } from 'native-base';
import React, { memo } from 'react';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationEvents } from 'react-navigation';

import CONSTANTS from '../../common/PeertalConstants';
import { Text } from '../../components/CoreUIComponents';
import ProgressBar from '../../components/CoreUIComponents/ProgressBar';
import SendMoneyPostModal from '../../components/SendMoneyPostModal';
import { getAddressFromLocation, getCurrentLocation } from "../../actions/commonActions";

const UpdatePostScreen = (props) => {
  const {
    content,
    setContent,
    taggedUsersData,
    isLoading,
    loadingPercent,
    isIncognito,
    setIsIncognito,
    sendMoneyPostModal,
    setSendMoneyPostModal,
    openSendMoneyPostModal,
    setPayment,
    updatetaggedUsers,
    handleSharePost,
    handleCamera,
    handleUploadVideo,
    handleUploadPhoto,
    _renderPhotos,
    _onShow,
    modalFooterHeight,
    avatar,
    fullName,
    timeAgo,
    locationAddress,
    postMoney,
    isLocation,
    setIsLocation,
    canSetIsLocation,
    alert
  } = props;

  return (
    <View>
      <View
        style={{
          flexDirection: 'column',
          marginHorizontal: 16,
        }}>
        <NavigationEvents onWillFocus={_onShow} />
        <View
          style={{
            marginTop: CONSTANTS.SPARE_HEADER,
            flexDirection: 'row',
            height: 48,
            backgroundColor: 'white',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <Text style={{ fontSize: 12, color: 'gray' }}>{!isLoading && 'Cancel'}</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 17, fontWeight: 'bold' }}>EDIT POST</Text>
          <TouchableOpacity onPress={handleSharePost}>
            <Text
              style={{
                fontSize: 12,
                color: CONSTANTS.MY_BLUE,
              }}>
              {!isLoading && 'Update'}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'column',
            backgroundColor: 'white',
            borderBottomColor: '#F3F4F4',
            shadowColor: 'blue',
          }}>
          <View style={{ flexDirection: 'row', marginTop: CONSTANTS.TOP_PADDING }}>
            <Image
              source={typeof avatar == 'string' ? { uri: avatar } : avatar}
              style={{
                width: 48,
                height: 48,
                borderRadius: 48 / 2,
                backgroundColor: 'gray',
                alignSelf: 'flex-start',
              }}
            />
            <View
              style={{
                width: CONSTANTS.WIDTH - 86,
                paddingLeft: 12,
                backgroundColor: 'white',
                paddingTop: 6,
                flexDirection: 'column',
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 14,
                }}>
                {fullName}
              </Text>
              <Text
                style={{
                  fontWeight: '200',
                  fontSize: 12,
                  color: '#BCBEC0',
                }}>
                {timeAgo}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'column',
              marginTop: 5,
              marginLeft: 36,
              borderStyle: 'dashed',
              borderColor: 'gray',
              borderWidth: 1,
              minHeight: 40,
            }}>
            <View
              style={{
                flexDirection: 'column',
                backgroundColor: 'white',
                minHeight: 43,
                marginRight: -1,
                marginBottom: -1,
                marginTop: -1,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginLeft: 12,
                  marginTop: 5,
                }}>
                <Image
                  source={require('../../assets/xd/Icons/users.png')}
                  style={{ width: 14, height: 14 }}
                />
                <Text
                  style={{
                    fontSize: 12,
                    textAlignVertical: 'center',
                    marginLeft: 10,
                  }}>
                  {taggedUsersData}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginLeft: 12,
                  marginTop: 5,
                }}>
                <Image
                  source={require('../../assets/xd/Icons/post_location.png')}
                  style={{ width: 14, height: 14 }}
                />
                <Text
                  style={{
                    fontSize: 12,
                    textAlignVertical: 'center',
                    marginLeft: 10,
                  }}>
                  {locationAddress
                    ? locationAddress
                    : 'Oops, we could not access your location information.'}
                </Text>
              </View>
              {/* Hide wallet and money transfer feature for ios */}
              {CONSTANTS.IS_HIDE_WALLET_FEATURE ? null : (
                <View
                  style={{
                    flexDirection: 'row',
                    marginLeft: 12,
                    marginTop: 5,
                  }}>
                  <Image
                    source={require('../../assets/xd/Icons/post_money.png')}
                    style={{ width: 14, height: 14 }}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      textAlignVertical: 'center',
                      marginLeft: 10,
                    }}>
                    {postMoney}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View
            style={{
              backgroundColor: CONSTANTS.MY_GRAYBG,
              marginTop: 20,
              borderRadius: CONSTANTS.CARD_BORDER_RADIUS,
            }}>
            <TextInput
              multiline
              value={content}
              onChangeText={text => setContent(text)}
              placeholder="post your content here"
              style={{
                minHeight: 40,
                margin: 10,
                maxHeight: 60,
                fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
              }}
            />
            {_renderPhotos()}
          </View>
          {isLoading ? (
            <ProgressBar
              data={
                loadingPercent.total
                  ? (
                    (loadingPercent.loaded * 100) /
                    loadingPercent.total
                  ).toFixed(0)
                  : 5
              }
            />
          ) : null}
        </View>
        {!isLoading && (
          <View style={{ backgroundColor: 'white', height: modalFooterHeight }}>
            {/* Hide wallet and money transfer feature for ios */}
            {CONSTANTS.IS_HIDE_WALLET_FEATURE ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginTop: 16,
                }}>
                <TouchableOpacity
                  onPress={() => props.navigation.navigate('TagPeople', {
                    callback: updatetaggedUsers,
                    peopleList: props.peopleList,
                    withDone: true
                  })}
                  style={{
                    borderColor: 'gray',
                    flexDirection: 'row',
                    borderWidth: 1,
                    width: '30%',
                    height: 34,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                  }}>
                  <Icon
                    name="tag"
                    type="FontAwesome5"
                    style={{
                      color: 'gray',
                      fontSize: 14,
                      marginRight: 5,
                    }}
                  />
                  <Text style={{ fontSize: 12, color: 'gray' }}>Tag Friends</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    borderColor: 'gray',
                    flexDirection: 'row',
                    borderWidth: 1,
                    width: '30%',
                    height: 34,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                  }}>
                  <Icon
                    name="lock"
                    type="FontAwesome5"
                    style={{
                      color: 'gray',
                      fontSize: 14,
                      marginRight: 5,
                    }}
                  />
                  <Text style={{ fontSize: 12, color: 'gray' }}>Only Us</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginTop: 16,
                }}>
                <TouchableOpacity
                  onPress={() => props.navigation.navigate('TagPeople', {
                    callback: updatetaggedUsers,
                    peopleList: props.peopleList,
                    withDone: true
                  })}
                  style={{
                    borderColor: 'gray',
                    flexDirection: 'row',
                    borderWidth: 1,
                    width: '30%',
                    height: 34,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                  }}>
                  <Icon
                    name="tag"
                    type="FontAwesome5"
                    style={{
                      color: 'gray',
                      fontSize: 14,
                      marginRight: 5,
                    }}
                  />
                  <Text style={{ fontSize: 12, color: 'gray' }}>Tag Friends</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => openSendMoneyPostModal()}
                  style={{
                    borderColor: 'gray',
                    flexDirection: 'row',
                    borderWidth: 1,
                    width: '30%',
                    height: 34,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                  }}>
                  <Icon
                    name="wallet"
                    type="FontAwesome5"
                    style={{
                      color: 'gray',
                      fontSize: 14,
                      marginRight: 5,
                    }}
                  />
                  <Text style={{ fontSize: 12, color: 'gray' }}>Send Money</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    borderColor: 'gray',
                    flexDirection: 'row',
                    borderWidth: 1,
                    width: '30%',
                    height: 34,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                  }}>
                  <Icon
                    name="lock"
                    type="FontAwesome5"
                    style={{
                      color: 'gray',
                      fontSize: 14,
                      marginRight: 5,
                    }}
                  />
                  <Text style={{ fontSize: 12, color: 'gray' }}>Only Us</Text>
                </TouchableOpacity>
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: 15,
              }}>
              <TouchableOpacity onPress={handleCamera}>
                <Image source={require('../../assets/xd/Icons/camera.png')} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleUploadPhoto('any')}>
                <Image source={require('../../assets/xd/Icons/photo.png')} />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleUploadVideo}>
                <Image source={require('../../assets/xd/Icons/play_button.png')} />
              </TouchableOpacity>

              {canSetIsLocation ?? (
                <TouchableOpacity onPress={() => setIsLocation(!isLocation)}>
                    <Image
                        source={require('../../assets/xd/Icons/tag_button.png')}
                        style={{opacity: props.isLocation ? 1 : 0.2}}
                    />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => {
                  setIsIncognito(!isIncognito);
                }}>
                <Image
                  source={require('../../assets/xd/Icons/incognito_button.png')}
                  style={{ opacity: isIncognito ? 1 : 0.2 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      <SendMoneyPostModal
        enabled={sendMoneyPostModal}
        onClose={() => setSendMoneyPostModal(false)}
        callback={(coin, dollar, currency) => {
          const value = {
            coinAmount: coin,
            currency: currency,
            dollarAmount: dollar,
          };
          setPayment(value);
        }}
      />
    </View>
  );
}

export default memo(UpdatePostScreen);
