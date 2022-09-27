import people from "./people";
import posts from "./posts";
import sideMenu from "./sideMenu";
import user from "./user";
import notification from "./notification";
import { combineReducers } from "redux";

export default combineReducers({
  people: people,
  posts: posts,
  sideMenu: sideMenu,
  user: user,
  notification: notification
});
