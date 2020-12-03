const aws = require("aws-sdk");
const dynamo = new aws.DynamoDB.DocumentClient();
const ses = new aws.SES();
aws.config.update({ region: "us-east-1" });




exports.handler = (event, context, callback) => {
    console.log("Executing lambda function...");
    let message = JSON.parse(event.Records[0].Sns.Message);
    var searchParams = {
        TableName: "csye6225",
        Key: {
            unique: message.to + message.userID + message.AnswerText
        }
    };
    console.log("Checking if record already present in db");
    /* first we get the item from dynamo and check if email exists
      if does not exist put the item and send an email,
      */
    dynamo.get(searchParams, function(error, data1) {
        if (error) {
            console.log("Error in get", error);
        } else {
            console.log("Success in get", data1);
            console.log(JSON.stringify(data1));
            let isPresent = false;
            if (data1.Item == null || data1.Item == undefined) {
                isPresent = false;
            } else {	
                isPresent = true;	
            }
            if (!isPresent) {
                let currentTime = new Date().getTime();
                let ttl = process.env.timeToLive * 60 * 1000;
                let expiry = currentTime + ttl;
                var params = {
                    Item: {
                        id: message.to,
                        ttl: expiry,
                        from: message.from,
                        questionId: message.QuestionID,
                        answerId: message.AnswerID,
                        answerText: message.AnswerText,
                        httpLink: message.AnswerLink,
                        messageText: message.Message,
                        userID: message.userID,
                        userName: message.userName,
                        unique: message.to + message.userID + message.AnswerText

                    },
                    TableName: "csye6225"
                };

                dynamo.put(params, function(error, data) {
                    if (error) {
                        console.log("Error", error);
                    } else {
                        console.log("Success", data);
                        var emailParams = {
                            Destination: {
                                ToAddresses: [
                                    params.Item.id
                                ]
                            },
                            Message: {
                                Body: {
                                    Text: {
                                        Charset: "UTF-8",
                                        Data:`\n`+params.Item.messageText+`\n Question ID: `+params.Item.questionId+`\n Answer ID: `+params.Item.answerId+`\n Answer Text: `+params.Item.answerText+`\n User ID: `+params.Item.userID+`\n User name: `+params.Item.userName+`\n Http Link: `+params.Item.httpLink
                                    }
                                },
                                Subject: {
                                    Charset: "UTF-8",
                                    Data: "You have received an activity on your Question"
                                }
                            },
                            Source: params.Item.from
                        };
                        var sendPromise = ses.sendEmail(emailParams).promise();
                        sendPromise
                            .then(function(data2) {
                                console.log(data2);
                            })
                            .catch(function(err) {
                                console.error(err, err.stack);
                            });
                    }
                });
            } else {
                console.log("Item already present!!!");
            }
        }
    });
};
