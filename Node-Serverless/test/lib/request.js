module.exports.request = (body) => {
  return {
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'PostmanRuntime/7.28.3',
      Accept: '*/*',
      'Postman-Token': 'a8f9f042-8fb4-4cee-91a7-dbbee2052d59',
      Host: 'localhost:3000',
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive',
    }
  }
}

module.exports.requestWithJwt = (body) => {
  return {
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'PostmanRuntime/7.28.3',
      Accept: '*/*',
      Host: 'localhost:3000',
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive',
      'x-api-key': 'MTY0MDA3Njc0OQ==ODZAMTY0MDA3Njc0OUAta3VreQ==+kuky2019==='
    }
  }
}