import { Icon, Text } from 'native-base';
import React from 'react';
import { Image, TouchableOpacity, View, Platform, Switch, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';

import CONSTANTS from '../common/PeertalConstants';
import { refreshDiscoverPosts } from "../actions/postActions";

const routes = ['Home', 'Chat', 'Profile'];
class SideMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      incognitoKey: Math.random()
    };
    this.handleLogout = this.handleLogout.bind(this);
    this._renderItem = this._renderItem.bind(this);
    this._renderFooter = this._renderFooter.bind(this);
    this._renderIncognitoMode = this._renderIncognitoMode.bind(this);
  }
  componentDidMount() {
  }
  componentWillUnmount() {
  }
  handleLogout() {
      this.props.dispatch(
          refreshDiscoverPosts(
              this.props.user.accessToken,
              false,
              false,
              this.props.sortType,
              this.props.user.longitude,
              this.props.user.latitude,
          ),
      );
    this.props.dispatch({ type: 'LOGOUT_MENU' });
    this.props.navigation.navigate('Discover');
    this.props.dispatch({ type: 'USER_LOGOUT' });
    this.props.navigation.navigate('Welcome');
  }
  _renderItem() {
    return this.props.data.map((item, index) => {
      /* Hide wallet and money transfer feature for ios */
      if (item.name != 'Wallet' || CONSTANTS.IS_HIDE_WALLET_FEATURE == false) {
        // just added if clause...
        return (
          <TouchableOpacity
            accessibilityLabel={item.name}
            onPress={() => this.props.navigation.navigate(item.screen, item.param)}
            key={index}
            style={{
              marginLeft: 22,
              backgroundColor: 'white',
              flexDirection: 'row',
              marginTop: 25,
              alignItems: 'center',
            }}>
            <View style={{ flexDirection: 'row' }}>
              <Icon
                name={item.icon}
                type={item.iconType}
                style={{ fontSize: 20, width: 20, color: '#414042' }}
              />
              <Text
                style={{
                  marginLeft: 10,
                  fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
                  fontSize: 14,
                  color: '#414042'
                }}>
                {(item.name === 'Message') ? item.name + 's' : item.name}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }
    });
  }

  _renderFooter() {
    return (
      <TouchableOpacity
        onPress={this.handleLogout}
        style={{
          flexDirection: 'row',
          justitfyContent: 'flex-start',
          marginLeft: 22,
          alignItems: 'center',
        }}>
        <Icon name="logout" type="MaterialCommunityIcons" style={{ fontSize: 20, width: 20, color: '#414042' }} />
        <Text
          style={{
            marginLeft: 10,
            fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
            fontSize: 14,
            color: '#414042'
          }}>
          Log out
        </Text>
      </TouchableOpacity>
    );
  }
  _renderIncognitoMode() {
    return (
      <View
        style={{
          bottom: 40,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '80%',
          marginLeft: 22,
        }}>
        <View style={{ flexDirection: 'row' }}>
          <Icon name="incognito" type="MaterialCommunityIcons" style={{ fontSize: 20, width: 20, color: this.props.user.incognitoMode ? CONSTANTS.MY_BLUE : '#414042', }} />
          <Text style={{
            fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
            fontSize: 14,
            color: this.props.user.incognitoMode ? CONSTANTS.MY_BLUE : '#414042',
            marginLeft: 10,
          }}>Incognito mode</Text>
        </View>
        <Switch
          trackColor={{ false: CONSTANTS.MY_GRAYBG, true: CONSTANTS.MY_BLUE }}
          // thumbColor={CONSTANTS.MY_BLUE}
          value={this.props.user.incognitoMode}
          onValueChange={value => {
            value && this.setState({ incognitoKey: Math.random() });
            this.props.dispatch({
              type: 'UPDATE_INCOGNITOMODE_PROPS',
              data: {
                incognitoMode: value,
              },
            });
          }}
        />
      </View>
    );
  }

  render() {
    const { data } = this.props;
    const headerHeight = CONSTANTS.SPARE_HEADER + 250;
    const footerHeight = CONSTANTS.SPARE_FOOTER + 62;
    const mainHeight = CONSTANTS.HEIGHT - headerHeight - footerHeight;
    const backgroundUrl = this.props.user.backgroundUrl || CONSTANTS.DEFAULT_BG;
    const avatarUrl = this.props.user.avatarUrl || CONSTANTS.DEFAULT_AVATAR;
    return (
      <SafeAreaView
        testID="app-root"
        accessibilityLabel="app-root"
        style={{
          flexDirection: 'column',
          height: '100%',
          width: '100%',
        }}>
        <View
          style={{
            flex: headerHeight,
            backgroundColor: 'white',
            height: headerHeight,
            width: '100%',
          }}>
          <Image
            style={{ height: headerHeight - 120, width: '100%' }}
            source={{ uri: backgroundUrl }}
          />
          <Image
            source={{ uri: avatarUrl }}
            style={{
              height: 100,
              width: 100,
              borderRadius: 50,
              borderWidth: 4,
              borderColor: 'white',
              marginTop: -50,
              marginLeft: 16,
            }}
          />
          <Text
            accessibilityLabel="user-name"
            style={{
              marginLeft: 22,
              marginTop: 8,
              fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD,
              fontSize: 18,
              color: '#414042',
            }}>
            {this.props.user.fullName}
          </Text>
        </View>
        <View
          style={{
            flex: mainHeight,
            backgroundColor: 'white',
            marginTop: 16,
            justifyContent: 'space-between',
          }}>
          <View>
            {this._renderItem()}
          </View>
          {Platform.OS === 'android' ? (
            <View
              useNativeDriver
              duration={800}
              animation={'pulse'}
              key={this.state.incognitoKey}
            >
              {this.props.user.loggedStatus !== 'guest' ? this._renderIncognitoMode() : null}
            </View>
          ) : (
            <Animatable.View
              useNativeDriver
              duration={800}
              animation={'pulse'}
              key={this.state.incognitoKey}
            >
              {this.props.user.loggedStatus !== 'guest' ? this._renderIncognitoMode() : null}
            </Animatable.View>
          )}
        </View>

        <View
          style={{
            flex: footerHeight,
            backgroundColor: 'white',
            borderTopColor: 'gray',
            borderTopWidth: 1,
            height: footerHeight,
            flexDirection: 'row',
            justitfyContent: 'cetner',
            alignItems: 'center',
            paddingBottom: CONSTANTS.SPARE_FOOTER,
          }}>
          {this.props.user.loggedStatus !== 'guest' ? this._renderFooter() : null}
        </View>
      </SafeAreaView>
    );
  }
}

const MapStateToProps = store => ({
  data: store.sideMenu,
  user: store.user,
});

const SideMenuLive = connect(MapStateToProps)(SideMenu);
export default SideMenuLive;
