import React, {memo, useState, useEffect} from 'react';

import SuccessMessageObject from '../../models/SuccessMessageObject';
import SuccessActionScreen from './SuccessActionScreen';

const SuccessActionScreenContainer = (props) => {
  const [data, setData] = useState(
    props.navigation.getParam('data', new SuccessMessageObject()),
  );

  return (
    <SuccessActionScreen
      {...props}
      title={data.title}
      headline={data.headline}
      firstLine={data.firstLine}
      mainNumber={data.mainNumber}
      mainCurrency={data.mainCurrency}
      secondLine={data.secondLine}
      message={data.message}
    />
  );
};

export default memo(SuccessActionScreenContainer);
