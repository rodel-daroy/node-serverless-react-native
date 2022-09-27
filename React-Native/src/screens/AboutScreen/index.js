import React, { useState, useEffect, useContext } from 'react';

import PopupContext from '../../context/Popup/PopupContext';
import { getPageInfo } from '../../actions/commonActions';
import CONSTANTS from '../../common/PeertalConstants';
import AboutScreen from './AboutScreen';

const AboutScreenContainer = (props) => {
  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;

  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getPageInfo(
      'about',
      res => {
        setPageData(res.data.data);
        setIsLoading(false);
        setMounted(true);
      },
      (err) => alert(err.response?.data?.message ?? 'Error')
    );
    return () => {
      setMounted(false);
    }
  }, []);

  const title = 'About Kuky';
  const pageName1 = 'About';
  const pageName2 = 'Kuky';
  const bodyData =
    pageData != null
      ? pageData.body
      : '<body>no data</body>';
  let body = mounted && bodyData.toString().split('</style>')[1] || `<header>We are updating ${title} Page.</header>`
  body = mounted && CONSTANTS.replaceAll(body, '<p>&nbsp;</p>', '');
  body = mounted && CONSTANTS.replaceAll(body, /(?:\r\n|\r|\n)/g, '<br>');
  body = mounted && CONSTANTS.replaceAll(body, '<br>', '');

  return (
    <AboutScreen
      {...props}
      isLoading={isLoading}
      title={title}
      pageName1={pageName1}
      pageName2={pageName2}
      body={body}
      mounted={mounted}
    />
  );
}

export default AboutScreenContainer;
