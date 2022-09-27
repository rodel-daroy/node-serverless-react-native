const AdminHelper = require('../../helpers/admin-helper');
const DbHelper = require('../../helpers/db-helper');
const EsHelper = require('../../helpers/es-helper');
const PostHelper = require('../../helpers/post-helper');

const AWS = require('aws-sdk');

const ES_ENTRY_POST = process.env.ES_ENTRY_POST;


module.exports.cronjob = async () => {

  let fileRows = await AdminHelper.getFiles();

  for (let file of fileRows) {

    let bucket = 'media.kuky.com';
    let objectKey = file.uri.replace('https://media.kuky.com/', '');

    const rekognitionClient = new AWS.Rekognition({
      accessKeyId: 'AKIAY3SHLBBZC6OP6LSH',
      secretAccessKey: '/JObwzGB3XVsMFhrSuaAMLDZmvJaPf9bKifVi6E/',
      region: 'ap-southeast-2',
      apiVersion: 'latest'
    });

    const params = {
      Image: {
        S3Object: {
          Bucket: bucket,
          Name: objectKey
        },
      },
      MaxLabels: 10
    };

    try {
      let response = await rekognitionClient.detectLabels(params).promise();
      let labelsArray = [];
      response.Labels.forEach(label => {
        labelsArray.push(label.Name);
      });
      await DbHelper.dbUpdate('files', { id: file.id }, { image_tag: JSON.stringify(labelsArray), cron: 0 });
    } catch (e) {

    }
  }
};

module.exports.cronjob1 = async () => {

  let postRows = await AdminHelper.getPosts();

  if (postRows) {
    for (let post of postRows) {
      let postItem = await PostHelper.getPostItem(post.id);
      postItem['image_labels'] = postItem.media && postItem.media[0] && postItem.media[0].image_tag ? JSON.parse(postItem.media[0].image_tag) : []
      postItem['latest_update'] = new Date();
      await EsHelper.saveObject(ES_ENTRY_POST, post.id, postItem);
      await DbHelper.dbUpdate('posts', { id: post.id }, { cron: 2 });
    }
  }
};
