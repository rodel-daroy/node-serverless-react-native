import React, { useCallback, useEffect, useContext, useMemo } from 'react';
import { Icon } from 'native-base';
import {
    Image,
    ImageBackground,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { css } from '@emotion/native';
import { NavigationEvents } from 'react-navigation';
import { getAllCountries } from 'react-native-country-picker-modal';
import SelectDropdown from 'react-native-select-dropdown';

import CONSTANTS from "../../common/PeertalConstants";
import {
    GenderSelect,
    OverlayLoading,
    StatusSelect,
} from '../../components/CoreUIComponents';
import PopupContext from '../../context/Popup/PopupContext';
import DefaultErrorContext from '../../context/DefaultError/DefaultErrorContext';
import { getSupportedCurrencies } from '../../actions/userActions';
import { useSetState } from '../../common/Hooks';
import EditProfileCurrencyPicker from './EditProfileCurrencyPicker';
import EditProfileCountryPicker from './EditProfileCountryPicker';

const DEFAULT_STATE = {
    isSelectCurrencyModal: false,
    isSelectCountryModal: false,
    supportedCurrencies: [],
    countryCodes: [],
    currentCurrencyCCA2: '',
    countryCCA2: '',
};

const EditProfileScreen = (props) => {

    const {
        isLoading,
        accountType,
        setAccountType,
        avatarUrlData,
        backgroundUrlData,
        country,
        setCountry,
        fullName,
        setFullName,
        gender,
        setGender,
        introduction,
        setIntroduction,
        language,
        setLanguage,
        maritalStatus,
        setMaritalStatus,
        over18,
        setOver18,
        subscribeToAdultContent,
        setSubscribeToAdultContent,
        handleUpdateBackground,
        onCameraButtonPress,
        _updateData,
        loadingData,
        allowPeopleToSeeMe,
        setAllowPeopleToSeeMe,
        preferredCurrency,
        setPreferredCurrency,
        focused,
        setFocused
    } = props;

    const [state, setState] = useSetState(DEFAULT_STATE);
    const {defaultError} = useContext(DefaultErrorContext);
    const {setPopup} = useContext(PopupContext);
    const alert = setPopup;

    useEffect(() => {
        if (!preferredCurrency) {
            setState({currentCurrencyCCA2: ''});
        }
    }, [preferredCurrency]);

    useEffect(() => {
        getSupportedCurrencies(
            props.user.accessToken,
            res => {
                setState({supportedCurrencies: res.data.data});
            },
            err => {
                defaultError(err);
            }
        );
    }, [getSupportedCurrencies]);

    const handleCurrencyModal = useCallback(state => {
        setState({isSelectCurrencyModal: state});
    }, []);

    const handleCountryModal = useCallback(state => {
        setState({isSelectCountryModal: state});
    }, []);

    useEffect(() => {
        if (!state.supportedCurrencies || !(state.supportedCurrencies.length > 0)) return;

        const supportedCurrenciesUpperCase = state.supportedCurrencies.map(item => item.toUpperCase());
        getAllCountries().then((countries) => {
            countries.some(item => {
                if (item.name === country) {
                    setState({countryCCA2: item.cca2});
                }
            });

            countries.some(item => {
                if ((item.currency.length === 1) && item.currency[0] === preferredCurrency) {
                    setState({currentCurrencyCCA2: item.cca2});
                }
            });

            const countryCodes = new Array();

            countries.forEach(item => {
                if ((item.currency.length === 1) && supportedCurrenciesUpperCase.includes(item.currency[0])) {
                    countryCodes.push(item.cca2);
                }
            });
            setState({countryCodes: countryCodes});
        });
    }, [state.supportedCurrencies, preferredCurrency, country]);

    const duplicatedLanguageArr = CONSTANTS.COUNTRY_LIST.map(item => {
        return item.language;
    });

    const uniqueLanguageArr = duplicatedLanguageArr.reduce(function(acc, curr, index) {
        acc.indexOf(curr) > -1 ? acc : acc.push(curr);
        return acc;
    }, []);

    const languageArr = uniqueLanguageArr.map(item => {
        return {"value": item, "label": item}
    });

    const emptyRadioButton = useMemo(() => {
        return (
            <View style={emptyRadioButtonStyle}/>
        );
    }, []);

    const blueRadioButton = useMemo(()=>{
        return (
            <View style={blueRadioButtonOuterStyle}>
                <View style={blueRadioButtonInnerStyle}/>
            </View>
        );
    },[]);

    if (!state.countryCodes || state.countryCodes?.length < 1) return <></>;
    return (
        isLoading ? <View
                style={{
                    position: 'absolute',
                    left: CONSTANTS.WIDTH / 2,
                    top: '40%',
                }}>
                <OverlayLoading/>
            </View> :
            <View style={{height: '100%', width: '100%'}}>
                <View style={{flexDirection: 'column', height: '100%'}}>
                    <NavigationEvents
                        onWillFocus={() => {
                            loadingData();
                        }}
                    />
                    <View
                        style={{
                            height: 48,
                            marginTop: CONSTANTS.SPARE_HEADER,
                            alignItems: 'center',
                            ...CONSTANTS.MY_SHADOW_STYLE,
                            borderBottomWidth: 1,
                            borderBottomColor: 'white',
                            justifyContent: 'flex-start',
                            flexDirection: 'row',
                        }}>
                        <TouchableOpacity onPress={() => props.navigation.goBack()}>
                            <Icon name="arrowleft" type="AntDesign" style={{marginLeft: 15}}/>
                        </TouchableOpacity>
                        <View
                            style={{
                                width: CONSTANTS.WIDTH - 15 - 30,
                                justifyContent: 'center',
                                flexDirection: 'row',
                                position: 'relative',
                            }}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontFamily: CONSTANTS.MY_FONT_FAMILY_BOLD,
                                    color: 'black',
                                    marginLeft: -45
                                }}>
                                EDIT PROFILE
                            </Text>
                            <TouchableOpacity
                                style={{position: 'absolute', right: 0, top: 0}}
                                onPress={_updateData}
                            >
                                <Text style={{marginRight: 15, color: CONSTANTS.MY_BLUE}}>
                                    Update
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView>
                        <View
                            style={{
                                height: 58,
                                backgroundColor: '#FFFFFF',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                marginTop: CONSTANTS.TOP_PADDING,
                            }}>
                            <Text
                                style={{
                                    fontSize: 18,
                                    marginLeft: 17,
                                    fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD,
                                    color: '#414042'
                                }}>
                                {' '}
                                Overview
                            </Text>
                        </View>
                        <ImageBackground
                            style={{
                                width: '100%',
                                height: 175,
                                justifyContent: 'flex-end',
                                alignItems: 'flex-start',
                                flexDirection: 'row',
                            }}
                            source={{uri: backgroundUrlData}}>
                            <TouchableOpacity
                                TouchableOpacity
                                onPress={handleUpdateBackground}>
                                <Icon
                                    name="camera"
                                    style={{
                                        color: 'white',
                                        marginTop: 10,
                                        marginRight: 10,
                                    }}
                                />
                            </TouchableOpacity>
                        </ImageBackground>
                        <TouchableOpacity onPress={onCameraButtonPress}>
                            <Image
                                source={{uri: avatarUrlData}}
                                style={{
                                    alignSelf: 'center',
                                    height: 158,
                                    width: 158,
                                    marginTop: -79,
                                    borderRadius: 79,
                                    borderWidth: 5,
                                    borderColor: 'white',
                                    backgroundColor: CONSTANTS.MY_GRAYBG,
                                }}
                            />
                            <Icon
                                name="camera"
                                style={{
                                    alignSelf: 'center',
                                    color: 'white',
                                    marginTop: -94,
                                }}
                            />
                        </TouchableOpacity>
                        <View style={{marginTop: 74, marginHorizontal: 15}}>
                            <Text style={{
                                fontSize: 12,
                                color: '#414042',
                                fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM
                            }}>Name</Text>
                            <View
                                style={{
                                    height: 50,
                                    borderRadius: 10,
                                    marginTop: 12,
                                    borderWidth: 1,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    paddingHorizontal: 20,
                                    borderColor: focused == 'name' ? CONSTANTS.MY_FOCUSED_BORDER_COLOR : CONSTANTS.MY_UNFOCUSED_BORDER_COLOR
                                }}>
                                <TextInput
                                    onFocus={e => {
                                        setFocused('name');
                                    }}
                                    onBlur={e => {
                                        setFocused('');
                                    }}
                                    value={fullName}
                                    onChangeText={txt => setFullName(txt)}
                                    textContentType="givenName"
                                    style={{
                                        fontSize: 18,
                                        color: '#414042',
                                        fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD,
                                    }}
                                />
                            </View>
                        </View>
                        <View style={{margin: 15, marginBottom: 40}}>
                            <Text style={{
                                fontSize: 12,
                                color: '#414042',
                                fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM
                            }}>About</Text>
                            <View
                                style={{
                                    borderRadius: 10,
                                    marginTop: 12,
                                    borderWidth: 1,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    paddingHorizontal: 20,
                                    paddingVertical: 10,
                                    borderColor: focused == 'about' ? CONSTANTS.MY_FOCUSED_BORDER_COLOR : CONSTANTS.MY_UNFOCUSED_BORDER_COLOR
                                }}>
                                <TextInput
                                    onFocus={e => {
                                        setFocused('about');
                                    }}
                                    onBlur={e => {
                                        setFocused('');
                                    }}
                                    value={introduction}
                                    onChangeText={txt => setIntroduction(txt)}
                                    textContentType="givenName"
                                    multiline={true}
                                    style={{
                                        fontSize: 14,
                                        fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT,
                                        minHeight: 50,
                                        color: '#414042'
                                    }}
                                />
                            </View>
                        </View>
                        <View style={{marginHorizontal: 15}}>
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontFamily: CONSTANTS.MY_FONT_FAMILY_SEMIBOLD,
                                    color: '#414042'
                                }}>
                                Detail Information
                            </Text>
                        </View>
                        <GenderSelect
                            titleFontSize={{fontSize: 14}}
                            value={gender}
                            onChangeValue={genderValue => setGender(genderValue)}
                        />
                        <StatusSelect
                            value={maritalStatus}
                            onChangeValue={value => setMaritalStatus(value)}
                        />
                        <View style={{marginHorizontal: 15, marginTop: 26}}>
                            <Text style={{
                                marginBottom: 15,
                                fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
                                fontSize: 12,
                                color: '#414042'
                            }}>
                                Country
                            </Text>

                            <EditProfileCountryPicker
                                country={country}
                                isSelectCountryModal={state.isSelectCountryModal}
                                handleCountryModal={handleCountryModal}
                                setCountry={setCountry}
                                countryCCA2={state.countryCCA2}
                            />
                        </View>

                        {/* <View style={{ marginHorizontal: 15, marginTop: 15 }}>
              <Text style={{ marginBottom: 15, fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM, fontSize: 12, color: '#414042' }}>
                Language
              </Text>
              <DropdownSelect
                value={language}
                data={languageArr}
                onChangeValue={value => setLanguage(value)}
              />
            </View> */}

                        <View style={{marginHorizontal: 15, marginTop: 15}}>
                            <Text style={{
                                marginBottom: 15,
                                fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
                                fontSize: 12,
                                color: '#414042'
                            }}>
                                Account Type
                            </Text>
                            <SelectDropdown
                                data={["Individual", "Business"]}
                                onSelect={(selectedItem, index) => {
                                    setAccountType(selectedItem.toLowerCase());
                                }}
                                buttonStyle={{
                                    ...styles.inputContainer,
                                    borderColor: CONSTANTS.MY_FOCUSED_BORDER_COLOR,
                                    width: '100%'
                                }}
                                renderCustomizedButtonChild={(selectedItem, index) => {
                                    return (
                                        <View style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between'
                                        }}>
                                            <Text style={{
                                                color: accountType === '' ? '#BCBEC0' : '#000000',
                                                fontSize: 17
                                            }}>
                                                {accountType ? (accountType.charAt(0).toUpperCase() + accountType.slice(1)) : "Select Account Type"}
                                            </Text>
                                            <Icon
                                                name="chevron-small-down"
                                                type="Entypo"
                                                style={{fontSize: 26, marginTop: -5, marginRight: 0}}
                                            />
                                        </View>
                                    );
                                }}
                                dropdownStyle={{backgroundColor: 'white', borderRadius: 10}}
                                rowStyle={{}}
                                renderCustomizedRowChild={(item, index) => {
                                    return (
                                        <View style={{display: 'flex'}}>
                                            <Text style={{textAlign: 'center'}}>{item}</Text>
                                        </View>
                                    );
                                }}
                            />
                        </View>

                        <View style={{marginHorizontal: 15, marginTop: 15}}>
                            <Text style={{
                                marginBottom: 15,
                                fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
                                fontSize: 12,
                                color: '#414042'
                            }}>
                                Currency
                            </Text>
                            <EditProfileCurrencyPicker
                                isSelectCurrencyModal={state.isSelectCurrencyModal}
                                handleCurrencyModal={handleCurrencyModal}
                                setCurrency={setPreferredCurrency}
                                countryCodes={state.countryCodes}
                                currentCurrencyCCA2={state.currentCurrencyCCA2}
                            />
                        </View>

                        <View
                            style={{
                                marginVertical: 30,
                                borderColor: CONSTANTS.MY_GRAYBG,
                                borderTopWidth: 1,
                            }}
                        />
                        <View
                            style={{
                                marginHorizontal: 15,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}>
                            <View style={{maxWidth: '75%'}}>
                                <Text style={{
                                    fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
                                    fontSize: 12,
                                    color: '#414042'
                                }}>
                                    ALLOW PEOPLE TO SEE ME
                                </Text>
                                <Text style={{
                                    marginTop: 12,
                                    fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
                                    fontSize: 12,
                                    color: allowPeopleToSeeMe ? CONSTANTS.MY_BLUE : '#939598'
                                }}>
                                    Everyone can see your information and what you post
                                </Text>
                            </View>
                            <Switch
                                trackColor={{false: CONSTANTS.MY_GRAYBG, true: CONSTANTS.MY_BLUE}}
                                value={allowPeopleToSeeMe}
                                onValueChange={value =>
                                    setAllowPeopleToSeeMe(value)
                                }
                            />
                        </View>

                        <View
                            style={{
                                marginTop: 30,
                                marginHorizontal: 15,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}>
                            <View style={{maxWidth: '75%'}}>
                                <Text style={{
                                    fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
                                    fontSize: 12,
                                    color: '#414042'
                                }}>OVER 18</Text>
                                <View style={{marginTop: 12, flexDirection: 'row'}}>
                                    {over18 ? blueRadioButton : emptyRadioButton}
                                    <Text style={{
                                        lineHeight: 20.6,
                                        fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
                                        fontSize: 12,
                                        color: over18 ? CONSTANTS.MY_BLUE : '#939598'
                                    }}>
                                        Show me adult content
                                    </Text>
                                </View>
                                <View style={{marginTop: 12, flexDirection: 'row'}}>
                                    {over18 ? emptyRadioButton : blueRadioButton}
                                    <Text style={{
                                        lineHeight: 20.6,
                                        fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
                                        fontSize: 12,
                                        color: !over18 ? CONSTANTS.MY_BLUE : '#939598'
                                    }}>
                                        Keep me away from adult content
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                trackColor={{false: CONSTANTS.MY_GRAYBG, true: CONSTANTS.MY_BLUE}}
                                value={over18 == 1}
                                onValueChange={value => setOver18(value)}
                            />
                        </View>

                        <View
                            style={{
                                marginTop: 30,
                                marginHorizontal: 15,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}>
                            <View style={{maxWidth: '75%'}}>
                                <Text style={{
                                    fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
                                    fontSize: 12,
                                    color: '#414042'
                                }}>NSFW</Text>
                                <View style={{marginTop: 12, flexDirection: 'row'}}>
                                    {subscribeToAdultContent ? blueRadioButton : emptyRadioButton}
                                    <Text style={{
                                        lineHeight: 20.6,
                                        fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
                                        fontSize: 12,
                                        color: subscribeToAdultContent ? CONSTANTS.MY_BLUE : '#939598'
                                    }}>
                                        Show me NSFW content
                                    </Text>
                                </View>
                                <View style={{marginTop: 12, flexDirection: 'row'}}>
                                    {subscribeToAdultContent ? emptyRadioButton : blueRadioButton}
                                    <Text style={{
                                        lineHeight: 20.6,
                                        fontFamily: CONSTANTS.MY_FONT_FAMILY_MEDIUM,
                                        fontSize: 12,
                                        color: !subscribeToAdultContent ? CONSTANTS.MY_BLUE : '#939598'
                                    }}>
                                        Keep me away from NSFW content
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                trackColor={{false: CONSTANTS.MY_GRAYBG, true: CONSTANTS.MY_BLUE}}
                                value={subscribeToAdultContent == 1}
                                onValueChange={value => setSubscribeToAdultContent(value)}
                            />
                        </View>

                        <View style={{height: 60}}/>
                    </ScrollView>
                </View>
            </View>
    );
}

export default EditProfileScreen;

const styles = {
    inputContainer: {
        height: 46,
        paddingTop: 2,
        paddingLeft: -3,
        borderWidth: 1,
        backgroundColor: "white",
        borderRadius: 10,
        fontFamily: CONSTANTS.MY_FONT_FAMILY_DEFAULT
    }
}

const emptyRadioButtonStyle = css`
    width: 20.6px;
    height: 20.6px;
    border-radius: 10.3px;
    border-width: 1px;
    margin-right: 13px;
    border-color: #BCBEC0;
`;

const blueRadioButtonOuterStyle = css`
    width: 20.6px;
    height: 20.6px;
    border-radius: 10.3px;
    margin-right: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${CONSTANTS.MY_BLUE};
`;

const blueRadioButtonInnerStyle = css`
    width: 6.86px;
    height: 6.86px;
    border-radius: 3.43px;
    border-width: 1px;
    border-color: #ffffff;
    background-color: white;
`;