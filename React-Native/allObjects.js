let UserObject = {
  fullName: "Trinh Le", //can be Incognito -> if it is incognito
  avatarUrl: "https://www.kuky.com/xxx.jpg",
  location: location, // {lat:11, long:11} geo-point type
  distance: 11, // KM optional in case use for another purpose
  score: 1,
  id: 11,
  occupation: "Engineer" // anything in the list of DB: engineer, architect, doctor
};
let userProfileObject = {
  fullName: "Trinh Le", //can be Igconito -> if it is igconito
  avatarUrl: "https://www.kuky.com/xxx.jpg",
  location: location, // {lat:11, long:11} geo-point type
  distance: 11, // KM optional in case use for another purpose
  score: 1,
  id: 11,
  occupation: "Engineer",
  friends: [userObject, userObject],
  introduction: "I am a good guy",
  skills: [skillObject],
  characterData: {
    summary: "Debater",
    introvert: {
      total: 10,
      active: true
    },
    extrovert: {
      total: 10,
      active: false
    },
    observant: {
      total: 10,
      active: false
    },
    intuitive: {
      total: 10,
      active: false
    },
    thinking: {
      total: 10,
      active: false
    },
    felling: {
      total: 10,
      active: false
    },
    judging: {
      total: 10,
      active: false
    },
    prospecting: {
      total: 10,
      active: false
    }
  }
};
let skillObject = {
  name: "Html",
  totalLikes: 100,
  totalDislikes: 200,
  likeActive: true,
  dislikeActive: false,
  votedList: [userObject]
};
let mediaObject = {
  url: "https://s3.xx.ss/1.jpg",
  description: "nice cat", //can be null or ''
  height: 110,
  width: 200,
  length: 20, //seconds if it is video
  type: "photo" // can be video
};
let voteDataObject = {
  VOTE_LIKE_POST: {
    total: 0,
    LIKE: {
      total: 10,
      active: false
    },
    DISLIKE: {
      total: 10,
      active: true
    },
    voted_list: [userObject, userObject]
  },
  REPORT_POST: {
    total: 0,
    active: true,
    reported_list: [userObject]
  },
  NSFW_POST: {
    total: 0,
    active: false,
    NSFW_list: [userObject]
  }
};

let commentObject = {
  user: UserObject,
  id: 11,
  media: [mediaObject, mediaObject],
  children: [commentObject],
  voteData: voteDataObject,
  isPublic: true,
  isIncognito: false,
  createdAt: DateTime,
  content: "dddd",
  taggedUsers: [userObject]
};
let moneyObject = {
  blockchainID: "ddx2434343", //transaction id,
  totalCoin: "0.222", //LTC or BTC value,
  createdAt: dateTime
};
let postObject = {
  user: UserObject,
  id: 11,
  media: [mediaObject, mediaObject],
  comments: [commentObject],
  voteData: voteDataObject,
  location: location, //geo-point type
  distance: 11, // optional, if user request with location, the distance can be calculated, if not, -> -1
  locationAddress: "22 Leloi, HCM, VN",
  isPublic: true,
  isIncognito: false,
  createdAt: DateTime,
  content: "dddd",
  taggedUsers: [userObject],
  moneyReceivers: [userObject],
  money: moneyObject
};
