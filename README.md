# serverless Function using Lambda

This lambda function is used to trigger email when a SNS is published from main webapp

1- Whenever user answers question, question owner would get email
2- answer is updated, question owner would get an email
3- answer is deleted, question owner would get an email

#lambda function implementation

Through CICD Pipeline any code change push to main branch will trigger ghactions which will 
create an artifact in s3 and then get uploaded to Lambda function 

