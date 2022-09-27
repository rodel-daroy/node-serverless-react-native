import React from 'react';
import {View} from 'react-native';

import CharacterGroup from '../../components/CharacterGroup';
import {Text} from '../../components/CoreUIComponents';
import SkillListGroup from './SkillListGroup';

const About = (props) => {
    const {userData, userId, handleLoadingData, _handleSkillReport, user} = props;
    const intro = userData
        ? userData.introduction
        : '...';
    const skillDescription =
        'Skills are great way for people to know what makes who you are';
    const skillList = userData ? userData.skills : [];

    return (
        <View style={{marginHorizontal: 15}}>
            <Text style={{...styles.title}}>Introduction</Text>
            <Text style={{marginTop: 10, marginBottom: 20, color: '#414042'}}>{intro}</Text>
            <CharacterGroup
                data={userData ? userData.characterData : null}
                userId={userId}
                onReload={() => handleLoadingData()}
            />
            <View>
                <Text style={{...styles.title, marginTop: 40}}>Skills</Text>
                <Text style={{marginTop: 15}}>{skillDescription}</Text>
                <SkillListGroup
                    onReportAction={() => _handleSkillReport()}
                    data={skillList}
                    callback={() => handleLoadingData()}
                    user={user}
                    userId={userId}
                    profileData={userData}
                />
            </View>
        </View>
    );
}

export default About;

const styles = {
    title: {
        marginTop: 20,
        fontSize: 18,
        fontFamily: 'Montserrat-SemiBold',
        color: '#414042'
    },
};