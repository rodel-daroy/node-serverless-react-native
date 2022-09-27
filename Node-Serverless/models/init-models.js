var DataTypes = require("sequelize").DataTypes;
var _SequelizeMeta = require("./SequelizeMeta");
var _admin_user_tokens = require("./admin_user_tokens");
var _admin_users = require("./admin_users");
var _api_logs = require("./api_logs");
var _app_settings = require("./app_settings");
var _cache_entry = require("./cache_entry");
var _comments = require("./comments");
var _contract = require("./contract");
var _edm_templates = require("./edm_templates");
var _es_logs = require("./es_logs");
var _files = require("./files");
var _geo_datas = require("./geo_datas");
var _ips = require("./ips");
var _notification_logs = require("./notification_logs");
var _post_files = require("./post_files");
var _post_users = require("./post_users");
var _posts = require("./posts");
var _promotion = require("./promotion");
var _promotion_setting = require("./promotion_setting");
var _sendbird_logs = require("./sendbird_logs");
var _skills = require("./skills");
var _static_pages = require("./static_pages");
var _stripe_connected_account = require("./stripe_connected_account");
var _stripe_customer = require("./stripe_customer");
var _transaction_history = require("./transaction_history");
var _transactions = require("./transactions");
var _user_access_tokens = require("./user_access_tokens");
var _user_actions = require("./user_actions");
var _user_bank_account = require("./user_bank_account");
var _user_friends = require("./user_friends");
var _user_locations = require("./user_locations");
var _user_login_codes = require("./user_login_codes");
var _user_money_request_details = require("./user_money_request_details");
var _user_money_requests = require("./user_money_requests");
var _user_notifications = require("./user_notifications");
var _user_passbase_verification = require("./user_passbase_verification");
var _user_payment_method = require("./user_payment_method");
var _user_profiles = require("./user_profiles");
var _user_skills = require("./user_skills");
var _user_stripe_customer = require("./user_stripe_customer");
var _user_verification_request = require("./user_verification_request");
var _users = require("./users");

function initModels(sequelize) {
  var SequelizeMeta = _SequelizeMeta(sequelize, DataTypes);
  var admin_user_tokens = _admin_user_tokens(sequelize, DataTypes);
  var admin_users = _admin_users(sequelize, DataTypes);
  var api_logs = _api_logs(sequelize, DataTypes);
  var app_settings = _app_settings(sequelize, DataTypes);
  var cache_entry = _cache_entry(sequelize, DataTypes);
  var comments = _comments(sequelize, DataTypes);
  var contract = _contract(sequelize, DataTypes);
  var edm_templates = _edm_templates(sequelize, DataTypes);
  var es_logs = _es_logs(sequelize, DataTypes);
  var files = _files(sequelize, DataTypes);
  var geo_datas = _geo_datas(sequelize, DataTypes);
  var ips = _ips(sequelize, DataTypes);
  var notification_logs = _notification_logs(sequelize, DataTypes);
  var post_files = _post_files(sequelize, DataTypes);
  var post_users = _post_users(sequelize, DataTypes);
  var posts = _posts(sequelize, DataTypes);
  var promotion = _promotion(sequelize, DataTypes);
  var promotion_setting = _promotion_setting(sequelize, DataTypes);
  var sendbird_logs = _sendbird_logs(sequelize, DataTypes);
  var skills = _skills(sequelize, DataTypes);
  var static_pages = _static_pages(sequelize, DataTypes);
  var stripe_connected_account = _stripe_connected_account(sequelize, DataTypes);
  var stripe_customer = _stripe_customer(sequelize, DataTypes);
  var transaction_history = _transaction_history(sequelize, DataTypes);
  var transactions = _transactions(sequelize, DataTypes);
  var user_access_tokens = _user_access_tokens(sequelize, DataTypes);
  var user_actions = _user_actions(sequelize, DataTypes);
  var user_bank_account = _user_bank_account(sequelize, DataTypes);
  var user_friends = _user_friends(sequelize, DataTypes);
  var user_locations = _user_locations(sequelize, DataTypes);
  var user_login_codes = _user_login_codes(sequelize, DataTypes);
  var user_money_request_details = _user_money_request_details(sequelize, DataTypes);
  var user_money_requests = _user_money_requests(sequelize, DataTypes);
  var user_notifications = _user_notifications(sequelize, DataTypes);
  var user_passbase_verification = _user_passbase_verification(sequelize, DataTypes);
  var user_payment_method = _user_payment_method(sequelize, DataTypes);
  var user_profiles = _user_profiles(sequelize, DataTypes);
  var user_skills = _user_skills(sequelize, DataTypes);
  var user_stripe_customer = _user_stripe_customer(sequelize, DataTypes);
  var user_verification_request = _user_verification_request(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  admin_user_tokens.belongsTo(admin_users, { as: "admin_user", foreignKey: "admin_user_id"});
  admin_users.hasMany(admin_user_tokens, { as: "admin_user_tokens", foreignKey: "admin_user_id"});

  return {
    SequelizeMeta,
    admin_user_tokens,
    admin_users,
    api_logs,
    app_settings,
    cache_entry,
    comments,
    contract,
    edm_templates,
    es_logs,
    files,
    geo_datas,
    ips,
    notification_logs,
    post_files,
    post_users,
    posts,
    promotion,
    promotion_setting,
    sendbird_logs,
    skills,
    static_pages,
    stripe_connected_account,
    stripe_customer,
    transaction_history,
    transactions,
    user_access_tokens,
    user_actions,
    user_bank_account,
    user_friends,
    user_locations,
    user_login_codes,
    user_money_request_details,
    user_money_requests,
    user_notifications,
    user_passbase_verification,
    user_payment_method,
    user_profiles,
    user_skills,
    user_stripe_customer,
    user_verification_request,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
