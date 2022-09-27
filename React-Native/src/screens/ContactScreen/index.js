import React, { useState, useEffect, useContext } from 'react';

import PopupContext from '../../context/Popup/PopupContext';
import { getPageInfo } from "../../actions/commonActions";
import ContactScreen from "./ContactScreen";

const ContactScreenContainer = (props) => {
  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;

  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getPageInfo(
      'contact',
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

  const title = "Contact";
  const pageName = "Contact";
  const bodyData =
    pageData != null
      ? pageData.body
      : '<body>no data</body>';
  const body = mounted && bodyData.toString().split('</style>')[1] || `<header>We are updating ${title} Page.</header>`

  return (
    <ContactScreen
      {...props}
      isLoading={isLoading}
      title={title}
      pageName={pageName}
      body={body}
      mounted={mounted}
    />
  );
}

export default ContactScreenContainer;
