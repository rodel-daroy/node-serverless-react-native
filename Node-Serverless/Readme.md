#Deprecated branch

This branch is only to keep the current app working with mobile.kuky.com

New branch will be for new endpoint

- master for api.kuky.com
- develop for dev.api.kuky.com

## Required Environment:

- node
- serverless

## To install:

`npm i -g serverless`

## To set up Serverless with AWS

`serverless config credentials --profile kuky --provider aws --key AKIAJJ7POSEHWF664V7A --secret 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`

## To deploy on aws:

- `serverless deploy`
- `sls deploy --stage dev`
- `sls deploy -s prod`

## To test in local:

- `serverless invoke local --function testdb`

## Run offline:

- `sls offline --stage local`
- `sls offline -s local --disableCookieValidation`
