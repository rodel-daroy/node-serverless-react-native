import React, { useState, useEffect, useContext } from 'react';

import PopupContext from '../../context/Popup/PopupContext';
import { getPageInfo } from '../../actions/commonActions';
import PrivacyPolicyScreen from './PrivacyPolicyScreen';

const PrivacyPolicyScreenContainer = (props) => {
  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;

  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getPageInfo(
      'pp',
      res => {
        setPageData(res.data.data)
        setIsLoading(false);
        setMounted(true);
      },
      (err) => alert(err.response?.data?.message ?? 'Error')
    );
    return () => {
      setMounted(false);
    }
  }, []);

  const title = 'Privacy Policy';
  const pageName1 = 'Privacy';
  const pageName2 = 'Policy';
  const bodyData =
    pageData != null
      ? pageData.body
      : '<body>no data</body>';
  const body = mounted && bodyData.toString().split('</style>')[1] || `<header>We are updating ${title} Page.</header>`

  return (
    <PrivacyPolicyScreen
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

export default PrivacyPolicyScreenContainer;
