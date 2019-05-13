const QUEUE_BASE_URL = process.env.QUEUE_BASE_URL;
const WORKER_QUEUE = process.env.WORKER_QUEUE;
AWS = require('aws-sdk');

AWS.config.update({
  region: 'sa-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
});

let sqs = new AWS.SQS({apiVersion: '2012-11-05'});

module.exports.sendMessage = function(message, messageGroupId, queueName){
  return new Promise((resolve, reject) => {
    if (!queueName){
      queueName = WORKER_QUEUE
    }
    let params = {
      MessageBody: JSON.stringify(message),
      QueueUrl: QUEUE_BASE_URL + queueName,
      MessageGroupId: messageGroupId
    };

    sqs.sendMessage(params).promise().then(data => {
      resolve(data);
    }).catch(err => {
      reject(err)
    });
  });
};

