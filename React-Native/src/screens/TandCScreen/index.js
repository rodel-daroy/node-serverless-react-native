import React, { useState, useEffect, useContext } from 'react';

import PopupContext from '../../context/Popup/PopupContext';
import { getPageInfo } from '../../actions/commonActions';
import TandCScreen from './TandCScreen';

const TandCScreenContainer = (props) => {
  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;

  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getPageInfo(
      'tc',
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

  const title = 'Terms & Conditions';
  const pageName1 = 'Terms';
  const pageName2 = '& Conditions';
  const bodyData =
    pageData != null
      ? pageData.body
      : '<body>no data</body>';
  let body = mounted && bodyData.toString().split('</style>')[1];

  body = mounted && body.replace('<h3><strong>', '<h3>');
  body = mounted && body.replace('</strong></h3>', '</h3>');

  return (
    <TandCScreen
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

export default TandCScreenContainer;