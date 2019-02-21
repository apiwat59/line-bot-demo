// Reply using AIML

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const AIMLInterpreter = require('aimlinterpreter')

const app = express()
const port = process.env.PORT || 4000
const aimlInterpreter = new AIMLInterpreter({ name:'HelloBot'})

aimlInterpreter.loadAIMLFilesIntoArray(['./test-aiml.xml'])

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/webhook', (req, res) => {
    let reply_token = req.body.events[0].replyToken
    let msg = req.body.events[0].message.text
    aimlInterpreter.findAnswerInLoadedAIMLFiles(msg, (answer, wildCardArray, input) => {
        reply(reply_token, answer)
    })
    res.sendStatus(200)
})

app.listen(port)

function reply(reply_token, msg) {
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {mBMq4+bnv+GRs4j+OZq71Hd86b539QhX9fDhf0aME1j+aWe73P/bml5eGNnrCC631NVOe4W10DF9CPk0pIAIoU4jtCaKmqcN+9wlCGyT758C8HEpZZ4m6vwR+jobXHYxOlKuJV2qKS2p3aOZDMTC6wdB04t89/1O/w1cDnyilFU=}'
    }

    let body = JSON.stringify({
        replyToken: reply_token,
        messages: [{
            type: 'text',
            text: msg
        }]
    })

    request.post({
        url: 'https://api.line.me/v2/bot/message/reply',
        headers: headers,
        body: body
    }, (err, res, body) => {
        console.log('status = ' + res.statusCode);
    });
}
