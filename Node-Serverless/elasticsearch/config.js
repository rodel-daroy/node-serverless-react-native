const base_ES_URL = 'https://search-kuky-k2yslksfu2jnhzlqimnlz6d2w4.ap-southeast-2.es.amazonaws.com'
const prefix = 'kukytest_'  // later to live will be kukylive
const tableUsers = prefix + 'users'
const tablePosts = prefix + 'posts'
const CreatePosts_INDEX_TABLE = 'PUT base_ES_URL/kukytest_posts {posts_config}'
const ADD_NEW_POST = 'PUT base_ES_ULR/kukytest_post/_doc/{id} {sample_posts1}'
const search_posts = ''
const createUsers_INDEX_TABLE = 'PUT base_ES_URL/kukytest_users {users_config}'
const ADD_NEW_USER = 'PUT base_ES_ULR/kukytest_users/_doc/{id} {sample_user_data1}'
const search_users = 'GET base_ES_URL/kukytest_users/_search?q=username:xxxx'
const search_posts = 'GET base_ES_URL/kukytest_posts/_search?q=content:xxxx'

const posts_config = {
  "settings": {
    "number_of_shards": 1
  },
  "mappings": {
    "_doc": {
      "properties": {
        "id":
        {
          "type": "text",

        },
        "content": {
          "type": "text",
        },
        "post_date":
        {
          "type": "date",

        },
        "location":
        {
          "type": "geo_point",
        },
        "location_address":
        {
          "type": "text",
        }
      }
    }
  }
}

const sample_posts1 = {
  "id": "123",
  "post_date": "2009-11-15T14:12:12",
  "content": "trying out Elasticsearch",
  "location":
  {
    "lat": 41.12,
    "lon": -71.34
  }
}

const users_config = {
  "mappings": {
    "_doc": {
      "properties": {
        "username":
        {
          "type": "text"

        },
        "user_id":
        {
          "type": "long"
        },
        "location":
        {
          "type": "geo_point"
        },
        "latest_update":
        {
          "type": "date"
        }
      }
    }
  }
}

const user_data_test1 = {
  "username": "user1",
  "user_id": "222",
  "lastest_update": "2009-11-15T14:12:12",
  "latest_update": "2009-11-15T14:12:12",
  "location":
  {
    "lat": 11.12,
    "lon": -31.34
  }
}