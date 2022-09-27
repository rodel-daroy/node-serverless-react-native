const notification = (
  state = { notificationList: [], isLoading: false },
  action
) => {
  switch (action.type) {
    case "RESET_NOTIFICATION_LIST":
      return { notificationList: [], isLoading: true };
    case "REQUEST_NOTIFICATION_LIST":
      return { ...state, isLoading: true };
    case "RECEIVE_NOTIFICATION_LIST": {
      return {
        ...state,
        notificationList: state.notificationList.concat(action.data),
        isLoading: false
      };
    }
    default:
      return state;
  }
};
export default notification;
