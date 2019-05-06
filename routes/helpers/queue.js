const QUEUE_URL = "https://sqs.sa-east-1.amazonaws.com/916203701249/iaas-queue.fifo";
AWS = require('aws-sdk');

AWS.config.update({
  region: 'sa-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
});

let sqs = new AWS.SQS({apiVersion: '2012-11-05'});

module.exports.sendMessage = function(message, messageGroupId){
  return new Promise((resolve, reject) => {
    let params = {
      MessageBody: JSON.stringify(message),
      QueueUrl: QUEUE_URL,
      // DelaySeconds: '3',
      // MessageDeduplicationId: 'STRING_VALUE',
      MessageGroupId: messageGroupId
    };

    sqs.sendMessage(params).promise().then(data => {
      resolve(data);
    }).catch(err => {
      reject(err)
    });
  });
};

