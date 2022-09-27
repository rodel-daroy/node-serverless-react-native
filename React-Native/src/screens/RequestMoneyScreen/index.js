import React, { memo, useState, useContext } from "react";
import { connect } from "react-redux";
import { Text, View } from 'react-native';
import { Icon } from 'native-base';

import CONSTANTS from "../../common/PeertalConstants";
import DefaultErrorContext from '../../context/DefaultError/DefaultErrorContext';
import RequestMoneyItem from "./RequestMoneyItem";
import { getMoneyRequest } from "../../actions/userActions";
import RequestMoneyScreen from "./RequestMoneyScreen";

const RequestMoneyScreenContainer = (props) => {
  const { defaultError } = useContext(DefaultErrorContext);

  const [myRequestTab, setMyRequestTab] = useState(true);
  const [requestList, setRequestList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("All");

  const _loadData = () => {
    setIsLoading(true);
    getMoneyRequest(
      props.user.accessToken,
      0,
      20,
      res => {
        setRequestList(res.data.data.list);
        setIsLoading(false);
      },
      err => {
        defaultError(err);
        setIsLoading(false);
      }
    );
  }

  const _selectTab = (value) => {
    setMyRequestTab(value);
  }

  const _renderItems = () => {
    const exchangeRate = props.user.settings.exchangeRate || 100;
    const tabType = myRequestTab ? "send" : "receive";
    let data = requestList.filter(item => item.type == tabType);
    return data.map((item, index) => (
      <RequestMoneyItem key={index} data={{ ...item, exchangeRate }} user={props.user} />
    ));
  }

  const options = [
    <View style={{ width: '100%', paddingLeft: 18 * CONSTANTS.WIDTH_RATIO, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Icon name="sort-variant" type="MaterialCommunityIcons" style={{ fontSize: 20 }} />
      <Text style={{ marginLeft: 12, color: "#414042", fontSize: 14 }}>All</Text>
    </View>,
    <View style={{ width: '100%', paddingLeft: 18 * CONSTANTS.WIDTH_RATIO, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Icon name="check-circle" type="FontAwesome" style={{ fontSize: 20 }} />
      <Text style={{ marginLeft: 12, color: "#414042", fontSize: 14 }}>Completed</Text>
    </View>,
    <View style={{ width: '100%', paddingLeft: 18 * CONSTANTS.WIDTH_RATIO, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Icon name="md-time" type="Ionicons" style={{ fontSize: 20 }} />
      <Text style={{ marginLeft: 12, color: "#414042", fontSize: 14 }}>Pending</Text>
    </View>,
    <View style={{ width: '100%', paddingLeft: 18 * CONSTANTS.WIDTH_RATIO, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Icon style={{ fontSize: 20, color: "#414042" }} name="x" type="Feather" />
      <Text style={{ marginLeft: 12, color: "#414042", fontSize: 14 }}>Cancel</Text>
    </View>,
  ];

  return (
    <RequestMoneyScreen
      {...props}
      myRequestTab={myRequestTab}
      _loadData={_loadData}
      _selectTab={_selectTab}
      _renderItems={_renderItems}
      isLoading={isLoading}
      sortBy={sortBy}
      setSortBy={setSortBy}
      options={options}
    />
  );
}

const mapStateToProps = store => ({ user: store.user });
const RequestMoneyContainerWrapper = connect(mapStateToProps)(RequestMoneyScreenContainer);
export default memo(RequestMoneyContainerWrapper);
