import {Icon} from 'native-base';
import React from 'react';
import {View} from 'react-native';

import CONSTANTS from '../../common/PeertalConstants';
import {Text} from '../../components/CoreUIComponents';

const About = () => {
    return (
        <View style={{marginHorizontal: 15, paddingHorizontal: 20}}>
            <Text
                style={{
                    lineHeight: 20,
                    fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
                    fontSize: 14,
                    color: "#414042",
                    marginTop: 20,
                }}>
                Incognito profiles exist as a way to enable expression of ideas and
                opinions with Protection against retaliation. What you post will
                protect your identity but you will be held accountable by our amazing
                community.
            </Text>
            <Text/>
            <Text
                style={{
                    lineHeight: 20,
                    fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
                    fontSize: 14,
                    color: "#414042",
                }}>
                We ask you to always be respectful & follow these rules guidelines
                when acting under a incognito profile:
            </Text>
            <View
                style={{marginTop: 15, flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                    name="dot-single"
                    type="Entypo"
                    style={{
                        paddingTop: 3,
                        color: '#0B75FF',
                        fontSize: 25,
                        marginLeft: 15,
                    }}
                />
                <Text
                    style={{
                        lineHeight: 20,
                        fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
                        fontSize: 14,
                        color: "#414042",
                    }}>
                    Good words
                </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                    name="dot-single"
                    type="Entypo"
                    style={{
                        paddingTop: 3,
                        color: '#0B75FF',
                        fontSize: 25,
                        marginLeft: 15,
                    }}
                />
                <Text
                    style={{
                        lineHeight: 20,
                        fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
                        fontSize: 14,
                        color: "#414042",
                    }}>
                    Good thoughts
                </Text>
            </View>
            <View
                style={{
                    marginBottom: 15,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                <Icon
                    name="dot-single"
                    type="Entypo"
                    style={{
                        paddingTop: 3,
                        color: '#0B75FF',
                        fontSize: 25,
                        marginLeft: 15,
                    }}
                />
                <Text
                    style={{
                        lineHeight: 20,
                        fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
                        fontSize: 14,
                        color: "#414042",
                    }}>
                    Good deeds
                </Text>
            </View>
            <Text
                style={{
                    lineHeight: 20,
                    fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
                    fontSize: 14,
                    color: "#414042",
                }}>
                If you see something you don’t like, be sure to report it or down vote
                it. Kuky will be as good as what we make of it in a community.
            </Text>
        </View>
    );
}

export default About;