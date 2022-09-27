import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';

import AboutScreen from '../screens/AboutScreen';
import ActivationCodeScreen from '../screens/ActivationCodeScreen';
import AddPersonalInformationScreen from '../screens/AddPersonalInformationScreen';
import BankAccountScreen from '../screens/BankAccountScreen';
import CardScreen from '../screens/CardScreen';
import CashOutActionScreen from '../screens/CashOutActionScreen';
import CashOutStep1Screen from '../screens/CashOutStep1Screen';
import ChatControlScreen from '../screens/ChatControlScreen';
import CONSTANTS from './PeertalConstants';
import ContactScreen from '../screens/ContactScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import FilterProfileScreen from '../screens/FilterProfileScreen';
import FirstTimeUserScreen from '../screens/FirstTimeUserScreen';
import HashTagPostScreen from '../screens/HashTagPostScreen';
import PeopleListScreen from '../screens/PeopleListScreen';
import ListTransactionsScreen from '../screens/ListTransactionsScreen';
import LoginViaEmailScreen from '../screens/LoginViaEmailScreen';
import LoginViaSMSScreen from '../screens/LoginViaSMSScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TandCScreen from '../screens/TandCScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import FAQScreen from '../screens/FAQScreen';
import ReportProblemScreen from '../screens/ReportProblemScreen';
import MapViewScreen from '../screens/MapViewScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import NotificationScreen from '../screens/NotificationScreen';
import WalletScreen from '../screens/WalletScreen';
import MainChatScreen from '../screens/MainChatScreen';
import SearchScreen from '../screens/SearchScreen';
import PostDetailsScreen from '../screens/PostDetailsScreen';
import LinkNewBankScreen from '../screens/LinkNewBankScreen';
import RequestMoneyScreen from '../screens/RequestMoneyScreen';
import SendMoneyScreen from '../screens/SendMoneyScreen';
import SuccessActionScreen from '../screens/SuccessActionScreen';
import UpdatePostScreen from '../screens/UpdatePostScreen';
import SendRequestMoneyScreen from '../screens/SendRequestMoneyScreen';
import SendPersonalInformationScreen from '../screens/SendPersonalInformationScreen';
import SideMenuLive from '../components/SideMenu';
import TagPeopleScreen from '../screens/TagPeopleScreen';
import TopUpStep1Screen from '../screens/TopUpStep1Screen';
import TopUpStep2Screen from '../screens/TopUpStep2Screen';
import LinkCreditCardScreen from '../screens/LinkCreditCardScreen';
import WalletInformationScreen from '../screens/WalletInformationScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

import LandingPincodeScreen from '../screens/Pincode/Landing';
import SetPincodeScreen from '../screens/Pincode/Set';
import EnterPincodeScreen from '../screens/Pincode/Enter';
import InvalidPincodeScreen from '../screens/Pincode/Invalid';
import ScanFaceScreen from '../screens/Pincode/Scan';

const MainDrawer = createDrawerNavigator(
  {
    Discover: {
      screen: DiscoverScreen,
    },
    PeopleList: {
      screen: PeopleListScreen,
    },
    ChatControl: {
      screen: ChatControlScreen,
    },
    Settings: {
      screen: SettingsScreen,
    },
    Notification: {
      screen: NotificationScreen
    },
    PrivacyPolicy: {
      screen: PrivacyPolicyScreen,
    },
    MapView: {
      screen: MapViewScreen,
    },
    FAQ: {
      screen: FAQScreen,
    },
    Contact: {
      screen: ContactScreen,
    },
    BackToLogin: {
      screen: WelcomeScreen,
    },
    UserProfile: {
      screen: UserProfileScreen,
    },
    EditProfile: {
      screen: EditProfileScreen,
    },
    Wallet: {
      screen: WalletScreen,
    },
    SetPincode: {
      screen: SetPincodeScreen
    }
  },
  {
    initialRouteName: 'Discover',
    headerMode: 'none',
    contentComponent: SideMenuLive,
    drawerWidth: (305 * CONSTANTS.WIDTH) / 375, // 80% of screen Width
  },
);

// Main Stack is here.....:) -> change the initial RouteName below
const LoginStack = createStackNavigator(
  {
    About: {
      screen: AboutScreen,
    },
    AddPersonalInformation: {
      screen: AddPersonalInformationScreen,
    },
    SendPersonalInformation: {
      screen: SendPersonalInformationScreen,
    },
    BankAccount: {
      screen: BankAccountScreen,
    },
    Card: {
      screen: CardScreen,
    },
    HashTagPost: {
      screen: HashTagPostScreen,
    },
    Welcome: {
      screen: WelcomeScreen,
    },
    LoginViaEmail: {
      screen: LoginViaEmailScreen,
    },
    LoginViaSMS: {
      screen: LoginViaSMSScreen,
    },
    ActivationCode: {
      screen: ActivationCodeScreen,
    },
    LandingPincode: {
      screen: LandingPincodeScreen
    },
    EnterPincode: {
      screen: EnterPincodeScreen
    },
    InvalidPincode: {
      screen: InvalidPincodeScreen
    },
    ScanFace: {
      screen: ScanFaceScreen
    },
    CreatePost: {
      screen: CreatePostScreen,
    },
    FirstTimeUser: {
      screen: FirstTimeUserScreen,
    },
    MainFlow: {
      screen: MainDrawer,
    },
    UserProfile: {
      screen: UserProfileScreen,
    },
    MainChat: {
      screen: MainChatScreen,
    },
    ChatControl: {
      screen: ChatControlScreen,
    },
    PostDetails: {
      screen: PostDetailsScreen,
    },
    Search: {
      screen: SearchScreen,
    },
    LinkNewBank: {
      screen: LinkNewBankScreen,
    },
    CashOutStep1: {
      screen: CashOutStep1Screen,
    },
    CashOutAction: {
      screen: CashOutActionScreen,
    },
    TopUpStep1: {
      screen: TopUpStep1Screen,
    },
    TopUpStep2: {
      screen: TopUpStep2Screen,
    },
    WalletInformation: {
      screen: WalletInformationScreen,
    },
    LinkCreditCard: {
      screen: LinkCreditCardScreen,
    },
    ListTransactions: {
      screen: ListTransactionsScreen,
    },
    RequestMoney: {
      screen: RequestMoneyScreen,
    },
    SendMoney: {
      screen: SendMoneyScreen,
    },
    SendRequestMoney: {
      screen: SendRequestMoneyScreen,
    },
    SuccessAction: {
      screen: SuccessActionScreen,
    },
    TagPeople: {
      screen: TagPeopleScreen
    },
    UpdatePost: {
      screen: UpdatePostScreen,
    },
    TandC: {
      screen: TandCScreen,
    },
    ReportProblem: {
      screen: ReportProblemScreen,
    },
    FilterProfile: {
      screen: FilterProfileScreen,
    },
  },
  {
    initialRouteName: 'MainFlow',  // Change here to test.....!!!-> set to "MainFlow" to post direct
    headerMode: 'none',
    defaultNavigationOptions: {
      gesturesEnabled: true,       // make sure only happen in few screen
    },
  },
);
const LoginContainer = createAppContainer(LoginStack);

// export default RootStack;
export default LoginContainer;
