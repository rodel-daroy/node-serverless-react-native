import React, { useState, memo, useMemo } from "react";
import { View } from "react-native";
import Carousel from "react-native-snap-carousel";
import {Icon} from "native-base";
import YoutubePlayer from 'react-native-youtube-iframe';

import checkUrlForm from "../../common/includes/checkUrlForm";
import PeertalPlayer from "./PeertalMediaPlayer";
import CONSTANTS from "../../common/PeertalConstants";

const PeertalMediaCarousel = (props) => {

    const [activeSlide, setActiveSlide] = useState(0);

    let data = props.data;

    props.youtubeAddress && data.push({url: 'youtube'});

    if (data == null) return <View/>;

    let imgArray = data.map(item => {
        if (!checkUrlForm(item.url)) {
            return "https://" + item.url;
        }

        return item.url;
    });

  const mediaContent = useMemo(() => {
    return (
      <Carousel
        data={imgArray}
        itemHeight={375}
        sliderHeight={375}
        itemWidth={CONSTANTS.WIDTH}
        sliderWidth={CONSTANTS.WIDTH}
        onSnapToItem={index => setActiveSlide(index)}
        layout={"default"}
        renderItem={({ item, index }) => {
          if (item && (item === 'https://youtube' || item === 'youtube')) {
            return (
              <View>
                <YoutubePlayer
                  height={230}
                  play={false}
                  videoId={props.youtubeAddress}
                />
              </View>
            );
          } else if (item) {
            return <PeertalPlayer key={index} isPhoto={item?.search('mp4') < 0} source={{ uri: item }} data={data} />;
          } else {
            return <View></View>;
          }
        }}
      />
    );
  }, [imgArray, PeertalPlayer, setActiveSlide, YoutubePlayer, props.youtubeAddress])

  const dots = useMemo(() => {
    if (data.length > 1) {
      return (
        data.map((item, index) => {
          if (index === activeSlide)
            return (
              <Icon
                key={index}
                name="dot-single"
                type="Entypo"
                style={{
                  alignSelf: "center",
                  marginLeft: -22,
                  color: CONSTANTS.MY_BLUE,
                  fontSize: 40
                }}
              />
            );
          else
            return (
              <Icon
                key={index}
                name="dot-single"
                type="Entypo"
                style={{
                  alignSelf: "center",
                  marginLeft: -22,
                  color: "gray",
                  fontSize: 30
                }}
              />
            );
        }));
    }

    return <View style={{ width: CONSTANTS.WIDTH, height: 20 }} />;
  }, [data.length, activeSlide]);



    return (
        <View>
            {mediaContent}
            <View
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row"
                }}
            >
                {dots}
            </View>
        </View>
    );
}

export default memo(PeertalMediaCarousel);
