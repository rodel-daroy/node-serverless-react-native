import React, { Component } from 'react';
import {
    View,
    Image,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ActivityIndicator,
    SafeAreaView,
    Platform
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Video from 'react-native-video';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Icon } from 'native-base';
import CONSTANTS from '../../common/PeertalConstants';

const radiusPixel = 0; //CONSTANTS.WIDTH / 350 * 5
const fadeOut = {
    from: {
        opacity: 1,
    },
    to: {
        opacity: 0.25,
    },
};
const fadeIn = {
    from: {
        opacity: 0.25,
    },
    to: {
        opacity: 1,
    },
};

export default class PeertalMediaPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            modalVisible: false,
            videoModalVisible: false,
            videoRate: 1.0,
            videoPaused: true,
            aspectRatio: 0,
        };
        this.setAspectRatio = this.setAspectRatio.bind(this);
        this.images = this.props.data.map(item => {
            return { url: item.url };
        });

        this.media = this.props.data?.filter(item => item.url === this.props.source.uri)?.[0];
        if (this.media?.data) {
            this.mediaData = JSON.parse(this.media?.data);
        }

        if (this?.mediaData?.width && this?.mediaData?.height) {
            this.allMediaAspectRatioArr = this.props.data.map(item => {
                const height = item?.data ? JSON.parse(item?.data)?.height ?? 0 : 0;
                const width = item?.data ? JSON.parse(item?.data)?.width || 1 : 1;
                return (height / width);
            });
            this.minAspectRatioArr = Math.min.apply(Math, this.allMediaAspectRatioArr);
        }
    }

    componentDidMount() {
        if (Array.isArray(this.props.source)) {
            console.warn(
                'ScaledImage received an array as source instead of local file resource or ImageURISource.',
            );
        } else if (typeof this.props.source === 'number') {
            // Resolve local file resource
            const resolved = Image.resolveAssetSource(this.props.source);

            // We assume 100% width, so we set the aspect ratio we want for it's height
            this.setAspectRatio(resolved?.width / (resolved?.height || 1));
        } else if (this.props.source.uri) {
            if (this?.mediaData?.width && this?.mediaData?.height) {
                this.setAspectRatio(this.mediaData?.height / (this.mediaData?.width || 1));
            } else {
                Image.getSize(
                    this.props.source.uri,
                    (width, height) => {
                        this.setAspectRatio(height / (width || 1));
                    },
                    err => {
                        console.error(err);
                        this.setAspectRatio(1);
                    },
                );
            }
            // Resolve remote resource
        } else {
            console.warn('ScaledImage did not receive a valid source uri.');
        }
        this.setState({ videoModalVisible: false, videoPaused: true });
    }

    componentWillUnmount() {
        this.setState({ videoModalVisible: false, videoPaused: true });
    }

    setAspectRatio(ratio) {
        this.setState({
            aspectRatio: ratio,
        });
    }

    render() {
        if ((!this.state.aspectRatio || this.state.aspectRatio === 0) && this.props.isPhoto) {
            return Platform.OS === 'android' ? (
                <View
                    style={{
                        flex: 1,
                        width: CONSTANTS.WIDTH,
                        height: CONSTANTS.WIDTH,
                        borderRadius: radiusPixel,
                        backgroundColor: CONSTANTS.MY_GRAYBG,
                    }}>
                    <ActivityIndicator
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            zIndex: 1,
                        }}
                        size="large"
                        animating={this.state.loading}
                    />
                </View>
            ) : (
                <Animatable.View
                    useNativeDriver
                    duration={3000}
                    animation={fadeOut}
                    style={{
                        flex: 1,
                        width: CONSTANTS.WIDTH,
                        height: CONSTANTS.WIDTH,
                        borderRadius: radiusPixel,
                        backgroundColor: CONSTANTS.MY_GRAYBG,
                    }}>
                    <ActivityIndicator
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            zIndex: 1,
                        }}
                        size="large"
                        animating={this.state.loading}
                    />
                </Animatable.View>
            )
        };

    return (
      <SafeAreaView>
        <TouchableWithoutFeedback
          onPress={() => {
            if (this.props.isPhoto)
              this.setState({ modalVisible: true });
            else {
              this.setState(
                { videoModalVisible: true, videoPaused: false },
                () => {
                  // this.player.dismissFullscreenPlayer();
                },
              );
            }
          }}>
          {!this.props.isPhoto ? (
            <View>
              <Video
                ref={ref => this._video = ref}
                style={{
                  flex: 1,
                  height: (CONSTANTS.WIDTH * 9) / 16,
                  borderRadius: radiusPixel,
                  backgroundColor: CONSTANTS.OS === 'ios' ? 'black' : 'gray',
                }}
                {...this.props}
                paused={true}
                controls={false}
                resizeMode="contain"
                onLoad={() => {
                  this._video.seek(0);
                }}
              />
              <View
                style={{
                  marginTop: 0 - (CONSTANTS.WIDTH * 9) / 16,
                  height: (CONSTANTS.WIDTH * 9) / 16,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon
                  name="ios-play"
                  style={{
                    fontSize: 70,
                    color: 'white',
                    opacity: this.state.videoPaused ? 0.8 : 0,
                  }}
                />
              </View>
            </View>
          ) : Platform.OS === 'android' ?
            (
              <View
                style={{
                  flex: 1,
                  width: CONSTANTS.WIDTH,
                  height:
                    this.state.aspectRatio > 2
                      ? CONSTANTS.WIDTH
                      : this.media.data && this.mediaData?.width && this.mediaData?.height && this.minAspectRatioArr
                        ? this.minAspectRatioArr * CONSTANTS.WIDTH
                        : CONSTANTS.WIDTH * this.state.aspectRatio,
                  borderRadius: radiusPixel,
                  backgroundColor: CONSTANTS.MY_GRAYBG,
                }}>
                <ActivityIndicator
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 1,
                  }}
                  size="large"
                  animating={this.state.loading}
                />
                <Image
                  style={{
                    flex: 1,
                    width: CONSTANTS.WIDTH,
                    height:
                      this.state.aspectRatio > 2
                        ? CONSTANTS.WIDTH
                        : CONSTANTS.WIDTH * this.state.aspectRatio,
                    borderRadius: radiusPixel,
                    backgroundColor: CONSTANTS.MY_GRAYBG,
                  }}
                  defaultSource={require('../../assets/xd/default-bg.png')}
                  onLoadEnd={() => {
                    this.setState({ loading: false });
                  }}
                  source={this.props.source}
                  resizeMode={this.state.aspectRatio > 2 ? 'contain' : 'contain'}
                />
              </View>
            )
            :
            (
              <Animatable.View
                useNativeDriver
                duration={3000}
                animation={fadeIn}
                style={{
                  flex: 1,
                  width: CONSTANTS.WIDTH,
                  height:
                    this.state.aspectRatio > 2
                      ? CONSTANTS.WIDTH
                      : this.media?.data && this.mediaData?.width && this.mediaData?.height && this.minAspectRatioArr
                        ? this.minAspectRatioArr * CONSTANTS.WIDTH
                        : CONSTANTS.WIDTH * this.state.aspectRatio,
                  borderRadius: radiusPixel,
                  backgroundColor: CONSTANTS.MY_GRAYBG,
                }}>
                <ActivityIndicator
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 1,
                  }}
                  size="large"
                  animating={this.state.loading}
                />
                <Image
                  style={{
                    flex: 1,
                    width: CONSTANTS.WIDTH,
                    height:
                      this.state.aspectRatio > 2
                        ? CONSTANTS.WIDTH
                        : CONSTANTS.WIDTH * this.state.aspectRatio,
                    borderRadius: radiusPixel,
                    backgroundColor: CONSTANTS.MY_GRAYBG,
                  }}
                  defaultSource={require('../../assets/xd/default-bg.png')}
                  onLoadEnd={() => {
                    this.setState({ loading: false });
                  }}
                  source={this.props.source}
                  resizeMode={this.state.aspectRatio > 2 ? 'contain' : 'contain'}
                />
              </Animatable.View>
            )}
        </TouchableWithoutFeedback>
        <Modal
          visible={this.state.modalVisible}
          transparent={true}
          onRequestClose={() => this.setState({ modalVisible: false })}>
          <View style={{ zIndex: 1, flex: 1, backgroundColor: 'black', position: 'relative' }}>
            <ImageViewer
              style={{ flex: 0.9 }}
              imageUrls={this.images.filter(item => item?.url?.search('mp4') < 0)}
              onCancel={() => this.setState({ modalVisible: false })}
              onSwipeDown={() => this.setState({ modalVisible: false })}
              enableSwipeDown={true}
              renderHeader={currentHeader => {
                return (
                  <TouchableOpacity
                    style={{ zIndex: 1, width: 100, height: 80 }}
                    onPress={() => this.setState({ modalVisible: false })}>
                    <Icon
                      name="arrowleft"
                      type="AntDesign"
                      style={{
                        color: 'white',
                        marginHorizontal: 15,
                        marginTop: CONSTANTS.SPARE_HEADER,
                      }}
                    />
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </Modal>
        <Modal
          visible={this.state.videoModalVisible}
          transparent={true}
          onRequestClose={() =>
            this.setState({ videoModalVisible: false, videoPaused: true })
          }>
          <SafeAreaView
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: 'black',
            }}>
            {CONSTANTS.OS === 'android' ? (
              <TouchableOpacity
                style={{
                  flex: 0.2,
                  position: 'absolute',
                  backgroundColor: 'black',
                  top: 10,
                  marginHorizontal: 15,
                  marginTop: CONSTANTS.SPARE_HEADER,
                }}
                onPress={() => {
                  this.setState({ videoModalVisible: false, videoPaused: true });
                }}>
                <View style={{ backgroundColor: 'black' }}>
                  <Icon
                    name="arrowleft"
                    type="AntDesign"
                    style={{ color: 'white', zIndex: 1 }}
                  />
                </View>
              </TouchableOpacity>
            ) : null}
            <Video
              ref={ref => (this.player = ref)}
              allowsExternalPlayback={false}
              style={{
                flex: CONSTANTS.OS === 'ios' ? 1 : 0.8,
                //height: (CONSTANTS.WIDTH * 9) / 16,
                borderRadius: radiusPixel,
                backgroundColor: 'black',
              }}
              {...this.props}
              paused={this.state.videoPaused}
              rate={this.state.videoRate}
              repeat={true}
              //controls={true}
              fullscreen={CONSTANTS.OS === 'android' ? true : false}
              //fullscreenAutorotate={true}
              //fullscreenOrientation={'all'}
              onLoad={() =>
                this.player && this.player.presentFullscreenPlayer()
              }
              onFullscreenPlayerDidDismiss={() => {
                this.setState({ videoPaused: true, videoModalVisible: false });
              }}
              resizeMode="contain"
            />
            {CONSTANTS.OS === 'android' ? (
              <View
                style={{
                  marginTop: 0 - (CONSTANTS.WIDTH * 9) / 16,
                  height: (CONSTANTS.WIDTH * 9) / 16,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon
                  name="ios-play"
                  style={{
                    fontSize: 70,
                    color: 'white',
                    opacity: this.state.videoPaused ? 0.8 : 0,
                  }}
                />
              </View>
            ) : null}
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    );
  }
}
