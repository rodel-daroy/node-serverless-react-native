const ApiHelper = require('./api-helper');
const DbHelper = require('./db-helper');
const PostHelper = require('./post-helper');
const UserHelper = require('./user-helper');

const ES_USER = process.env.ES_USER;
const ES_PASS = process.env.ES_PASS;
const ES_URL = process.env.ES_URL;
const ES_ENTRY_USER = process.env.ES_ENTRY_USER;
const ES_ENTRY_POST = process.env.ES_ENTRY_POST;


exports.saveUser = async (id) => {

  await DbHelper.dbUpdate('user_profiles', { user_id: id }, { es_synz: 1 });

  let result;

  let profileItem = await UserHelper.getProfileItem(id);
  if (profileItem) {
    let userActionRow = await DbHelper.query('SELECT COUNT(id) AS total FROM user_actions WHERE created_by = :userId', { userId: id }, 1);
    profileItem['actions'] = userActionRow['total'];
    profileItem['latest_update'] = new Date();
    await this.saveObject(ES_ENTRY_USER, id, profileItem);
    result = true;
  } else {
    result = false;
  }

  return result;
};


exports.savePost = async (id) => {

  await DbHelper.dbUpdate('posts', { id }, { es_synz: 1 });
  let postItem = await PostHelper.getPostItem(id);
  postItem['latest_update'] = new Date();
  await this.saveObject(ES_ENTRY_POST, id, postItem);

  return postItem;
};

exports.getObjects = async (url, data) => {

  let header = { 'Content-Type': 'application/json' };
  let basicAuth = ApiHelper.basicAuthEncode(ES_USER, ES_PASS);
  if (basicAuth) {
    header.Authorization = basicAuth;
  }

  return await ApiHelper.apiGetWithBody(url, data, header);
}

exports.saveObject = async (object, id, data) => {

  let basicAuth = ApiHelper.basicAuthEncode(ES_USER, ES_PASS);
  let header = {
    'cache-control': 'no-cache',
    'Content-Type': 'application/json'
  };
  if (basicAuth) {
    header.Authorization = basicAuth;
  }

  return await ApiHelper.apiRequest(`${ES_URL}/${object}/_doc/${id}`, 'PUT', data, header);
};

exports.esFilterProfiles = async ($sorting, $filterData, $orderBy = 'desc', $from = 0, $size = 10) => {

  let $key = ApiHelper.getObjectValue($filterData, 'key', '');
  let $ids = ApiHelper.getObjectValue($filterData, 'ids', null);
  let $latitude = ApiHelper.getObjectValue($filterData, 'latitude', '');
  let $longitude = ApiHelper.getObjectValue($filterData, 'longitude', '');
  let $status = ApiHelper.getObjectValue($filterData, 'status', '');
  let $skills = ApiHelper.getObjectValue($filterData, 'skills', '');
  let $gender = ApiHelper.getObjectValue($filterData, 'gender', '');
  let $personalities = ApiHelper.getObjectValue($filterData, 'personalities', '');

  let shouldSkills = [];
  if ($skills !== '') {
    let arrSkills = $skills.split(',');
    for (let skill of arrSkills) {
      shouldSkills.push({ term: { 'skills.id': skill } });
    }
  }

  let shouldCharacters = [];
  if ($personalities !== '') {
    let arrCharacters = $personalities.split(',');
    for (let character of arrCharacters) {
      shouldCharacters.push({ term: { 'characterData.code': character } });
    }
  }

  let shouldStatus = [];
  if ($status !== '') {
    shouldStatus.push({ term: { 'status': $status } });
  }

  let shouldGender = [];
  if ($gender !== '') {
    shouldGender.push({ term: { 'gender': $gender } });
  }

  if (shouldCharacters.length === 0) {
    shouldCharacters = [{ 'match_all': {} }];
  }
  if (shouldSkills.length === 0) {
    shouldSkills = [{ 'match_all': {} }];
  }
  if (shouldGender.length === 0) {
    shouldGender = [{ 'match_all': {} }];
  }
  if (shouldStatus.length === 0) {
    shouldStatus = [{ 'match_all': {} }];
  }
  if ($latitude !== '' && $longitude !== '') {
    $sorting = 'LOCAL';
  }

  let $km = 100;
  let $filter = null;
  let $sort = {};

  switch ($sorting) {
    case 'TIMELINE':
      $sort = { latest_update: { order: $orderBy, mode: 'avg' } };
      break;
    case 'POPULAR':
      $sort = { actions: { order: $orderBy, mode: 'avg' } };
      break;
    case 'LOCAL':
      if ($latitude !== '' && $longitude !== '') {
        $filter = {
          geo_distance: {
            distance: $km + 'km',
            location: { 'lat': $latitude, 'lon': $longitude }
          }
        };
        $sort = {
          _geo_distance: {
            location: { 'lat': $latitude, 'lon': $longitude },
            order: 'asc',
            unit: 'km',
            distance_type: 'plane'
          }
        };

      } else {
        $filter = {
          geo_distance: {
            distance: $km + 'km',
            location: null
          }
        };
        $sort = {
          _geo_distance: {
            location: null,
            order: 'asc',
            unit: 'km',
            distance_type: 'plane'
          }
        };
      }
      break;
    default:
      $sort = { latest_update: { order: $orderBy, mode: 'avg' } };
      break;
  }

  let $should = [{ match_all: {} }];
  if ($key !== '') {
    $should = [
      { wildcard: { fullName: $key + '*' } },
      { match: { 'skills.name': $key } }
    ];
  }

  let $shoudIds = [{ match_all: {} }];
  if ($ids !== null && $ids.length > 0) {
    $shoudIds = { terms: { 'id': $ids } };
  }

  let $data = {
    from: $from,
    size: $size,
    query: {
      bool: {
        must: [
          { bool: { should: $shoudIds } },
          { bool: { should: $should } },
          {
            bool: {
              must: [
                { bool: { should: shouldCharacters } },
                { bool: { should: shouldSkills } },
                { bool: { should: shouldGender } },
                { bool: { should: shouldStatus } }
              ]
            }
          }
        ],
        filter: $filter
      }
    },
    sort: $sort
  };

  let $profileUrl = ES_URL + `/${ES_ENTRY_USER}/_search`;

  return await this.getObjects($profileUrl, $data);
};

exports.esNearByPostList = async ($keyword, $km, $latitude, $longitude, $from = 0, $size = 10) => {

  let $queries = [];
  let location = null;

  if ($latitude && $longitude) {
    location = {
      lat: parseFloat($latitude).toFixed(6),
      lon: parseFloat($longitude).toFixed(6)
    };
  }

  let $data = {
    from: $from,
    size: $size,
    query: {
      bool: {
        filter: {
          geo_distance: { distance: $km + 'km', location: location }
        },
        must: $queries,
      }
    },
    sort: {
      _geo_distance: { location: location, order: 'asc', unit: 'km', distance_type: 'plane' }
    }
  };

  let $esUrl = ES_URL + `/${ES_ENTRY_POST}/_search`;
  return await this.getObjects($esUrl, $data);
};

exports.esPostList = async ($keyword, $conditions, $orders, $from = 0, $size = 10, $hashTags, selectedUserId, over18, nsfwFlag, eighteenOverFlag) => {

  let nsfwLabels = await DbHelper.query('SELECT value FROM app_settings WHERE id = :id', { id: 5 }, 1);
  let eighteenOverLabels = await DbHelper.query('SELECT value FROM app_settings WHERE id = :id', { id: 6 }, 1);

  let nsfwLabelsList = nsfwLabels.value.split(',');
  let eighteenOverLabelsList = eighteenOverLabels.value.split(',');

  let termsImageLabels = [];
  if (!nsfwFlag && !eighteenOverFlag) {
    termsImageLabels = nsfwLabelsList.concat(eighteenOverLabelsList);
  } else if (!nsfwFlag && eighteenOverFlag) {
    termsImageLabels = [].concat(nsfwLabelsList);
  } else if (nsfwFlag && eighteenOverFlag) {
    termsImageLabels = [].concat(eighteenOverFlag);
  }

  let $match = {};
  let $queries = [];

  for (let item of $conditions) {
    $match = {};
    $match[item['field']] = item['value'];
    $queries.push({ match: $match });
  }

  if ($hashTags) {
    $queries.push({ bool: { should: [{ term: { hashTags: $hashTags } }] } });
  }

  if ($keyword !== '') {
    $queries.push({
      bool: {
        should: [
          { match: { 'user.fullName': $keyword } },
          { match: { 'content': $keyword } },
        ]
      }
    });
  }

  let $sort = {};
  for (let item of $orders) {
    $sort[item['field']] = { 'order': item['order'], 'mode': 'avg' };
  }

  let nsfwScript1 = {
    script: {
      script: {
        lang: 'painless',
        inline: "((doc['voteData.upData.total'].value + doc['voteData.downData.total'].value + doc['totalComments'].value) * 0.3) >= doc['voteData.reportData.total'].value",
      }
    }
  };

  let nsfwScript2 = {
    script: {
      script: {
        lang: 'painless',
        inline: "(((doc['voteData.upData.total'].value + doc['voteData.downData.total'].value + doc['totalComments'].value) * 0.3) >= doc['voteData.reportData.total'].value) || (doc['voteData.reportedUserIds'].value.includes(params.param1))",
        params: {
          param1: parseInt(selectedUserId)
        }
      }
    }
  };

  let $data = {
    from: $from,
    size: $size,
    query: {
      'bool': {
        'must': [
          ...$queries,
          selectedUserId > 0 ? (over18 === 1 ? nsfwScript2 : {}) : nsfwScript1
        ],
        "must_not": {
          "terms": {
            "image_labels": termsImageLabels,
            "boost": 1.0
          }
        }
      }
    },
    sort: $sort
  };

  let $esUrl = ES_URL + `/${ES_ENTRY_POST}/_search`;
  return await this.getObjects($esUrl, $data);
};
