import React, { useState, useContext } from 'react';
import { Image } from 'react-native';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';

import DefaultErrorContext from '../../context/DefaultError/DefaultErrorContext';
import PopupContext from '../../context/Popup/PopupContext';
import { uploadMediaToPeertal, } from '../../actions/userActions';
import CONSTANTS from '../../common/PeertalConstants';
import SuccessMessageObject from '../../models/SuccessMessageObject';
import { reportAProblem } from '../../actions/commonActions';
import ReportProblemScreen from './ReportProblemScreen';

const ReportProblemScreenContainer = (props) => {
  const { defaultError} = useContext(DefaultErrorContext);
  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;

  const [isLoading, setIsLoading] = useState(false);
  const [media, setMedia] = useState([]);
  const [description, setDescription] = useState("")
  const [topic, setTopic] = useState("posting");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [problem, setProblem] = useState("");
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [isSelectCountryModal, setIsSelectCountryModal] = useState(false);
  const [country, setCountry] = useState('Australia');
  const [currentCode, setCurrentCode] = useState('+61');
  const [focusedInput, setFocusedInput] = useState('');

  const _submitProblem = () => {
    const contactData = {
      description: description,
      topic: topic,
      email: email,
      phone: phone,
      problem: problem,
      media: media.map(item => item.id),
    };
    setIsLoading(true);
    reportAProblem(
      props.user.accessToken,
      contactData,
      res => {
        const mess = new SuccessMessageObject(
          'Report',
          undefined,
          '',
          '',
          '',
          '',
          'Thank you for your feedback. We will review your problems and revert to you ASAP.',
        );
        setIsLoading(false);
        props.navigation.navigate('SuccessAction', { data: mess });
      },
      err => {
        setIsLoading(false);
        defaultError(err);
      },
    );
  }

  const _renderMedia = () => {
    return media.map(item => (
      <Image source={{ uri: item.url }} style={styles.screenshot} key={item.id} />
    ));
  }

  const _handleUploadPhoto = (mediaType = 'photo') => {
    ImagePicker.openPicker({
      width: 800,
      height: 800,
      includeExif: true,
      compressImageQuality: 0.8,
      compressImageMaxHeight: 800,
      compressImageMaxWidth: 800,
      cropping: true, //this should be removed if want to use videos
      cropperCircleOverlay: false,
      freeStyleCropEnabled: true,
      // mediaType: mediaType,
      includeBase64: true,
      cropperToolbarTitle: 'Edit Photo Before Uploading',
    })
      .then(image => {
        setIsLoading(true);
        uploadMediaToPeertal(
          props.user.accessToken,
          `data:${image.mime};base64,` + image.data,
          'post',
          res => {
            let response = res.data;
            if (response.status === 200) {
              setIsLoading(false);
              setMedia(media.concat(response.data));
            } else {
              alert(response.message);
            }
          },
          err => {
            alert(err.response?.data?.message ?? 'error some where');
            setIsLoading(false);
          },
          event => setLoadingPercent(event),
        );
      })
      .catch(err => { alert(err.response?.data?.message ?? 'error some where'); });
  }

  const title = 'REPORT A PROBLEM';
  const pageName1 = 'Report';
  const pageName2 = 'A Problem';
  const listIssues = [
    'send money',
    'install app',
    'update app',
    'posting',
    'top up money',
    'cash out',
    'others',
  ];
  const summary = "We love feedback. That's how we know we're doing right or wrong. Feel free to tell us what you like what you dislike";
  return (
    <ReportProblemScreen
      {...props}
      isLoading={isLoading}
      description={description}
      setDescription={setDescription}
      topic={topic}
      email={email}
      setEmail={setEmail}
      phone={phone}
      setPhone={setPhone}
      _submitProblem={_submitProblem}
      _renderMedia={_renderMedia}
      _handleUploadPhoto={_handleUploadPhoto}
      title={title}
      pageName1={pageName1}
      pageName2={pageName2}
      listIssues={listIssues}
      summary={summary}
      setProblem={setProblem}
      isSelectCountryModal={isSelectCountryModal}
      setIsSelectCountryModal={setIsSelectCountryModal}
      country={country}
      setCountry={(countryName) => setCountry(countryName)}
      currentCode={currentCode}
      setCurrentCode={(code) => setCurrentCode(code)}
      focusedInput={focusedInput}
      setFocusedInput={setFocusedInput}
    />
  );
}

const mapStateToProps = store => ({
  user: store.user
});
const ReportProblemScreenContainerWrapper = connect(mapStateToProps)(ReportProblemScreenContainer);
export default ReportProblemScreenContainerWrapper;

const styles = {
  lineContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    marginTop: 20,
  },
  textCaption: {
    marginLeft: 10,
  },
  inputContainer: {
    marginTop: 10,
    padding: 15,
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: CONSTANTS.MY_GREY,
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
    borderColor: CONSTANTS.MY_GREY,
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
