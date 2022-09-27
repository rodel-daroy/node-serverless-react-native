const afterLogin = [
  {
    name: "Profile",
    screen: "UserProfile",
    icon: "md-person",
    iconType: "Ionicons",
    param: {
      // userId: 1
    }
  },
  {
    screen: "ChatControl",
    name: "Message",
    icon: "message-processing",
    iconType: "MaterialCommunityIcons"
  },
  {
    screen: "Wallet",
    name: "Wallet",
    icon: "md-wallet",
    iconType: "Ionicons"
  },
  {
    screen: "Settings",
    name: "Settings",
    icon: "md-settings",
    iconType: "Ionicons"
  }
];

const beforeLogin = [
  {
    name: "Login",
    screen: "Welcome",
    icon: "home",
    iconType: "MaterialCommunityIcons"
  },
  {
    screen: "Settings",
    name: "Settings",
    icon: "md-settings",
    iconType: "Ionicons"
  }
];

const sideMenu = (state = beforeLogin, action) => {
  switch (action.type) {
    case "RESET_MENU":
      return beforeLogin;
    case "LOGGED_MENU":
      return afterLogin;
    case "LOGOUT_MENU":
      return beforeLogin;
    default:
      return state;
  }
};
export default sideMenu;
