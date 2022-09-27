import React, { useState, useEffect, useContext } from 'react';

import PopupContext from '../../context/Popup/PopupContext';
import { getPageInfo } from "../../actions/commonActions";
import CONSTANTS from '../../common/PeertalConstants';
import FAQScreen from "./FAQScreen";

const FAQScreenContainer = (props) => {
  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;

  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getPageInfo(
      "faqs",
      res => {
        setPageData(res.data.data)
        setIsLoading(false);
        setMounted(true);
      },
      (err) => alert(err.response?.data?.message ?? 'Error')
    );
  }, []);

  const title = "FAQs";
  const pageName = "FAQs";
  const bodyData =
    pageData != null
      ? pageData.body
      : '<body>no data</body>';
  let body = mounted && bodyData;
  body = mounted && CONSTANTS.replaceAll(body, '<p>&nbsp;</p>', '');
  body = mounted && CONSTANTS.replaceAll(body, /(?:\r\n|\r|\n)/g, '<br>');
  body = mounted && CONSTANTS.replaceAll(body, '<br>', '');

  return (
    <FAQScreen
      {...props}
      isLoading={isLoading}
      title={title}
      pageName={pageName}
      body={body}
      mounted={mounted}
    />
  );
}

export default FAQScreenContainer;
