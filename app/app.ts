import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoClient from './mongoClient/index';
import { ChinaDayAddList, ChinaDayList } from "./reptile/Schema";

const app: express.Application = express();
const port = 5000;
const ALLOW_ORIGIN_LIST = ['http://localhost:3000', 'http://www.jobsofferings.cn'];

app.all('*', function (req, res, next) {
  if (ALLOW_ORIGIN_LIST.includes(req.headers.origin || '')) {
    res.header('Access-Control-Allow-Origin', req.headers.origin); //当允许携带cookies此处的白名单不能写’*’
    res.header('Access-Control-Allow-Headers', 'content-type,Content-Length, Authorization,Origin,Accept,X-Requested-With'); //允许的请求头
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT'); //允许的请求方法
  }
  next();
});

app.use(express.static(path.join(__dirname, 'upload')));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/getChinaDayList", (req, res) => {
  const where = {};
  const set = { _id: 0, __v: 0 };
  ChinaDayList.find(where, set, {}, function (err: any, results: any) {
    res.json(results)
  });
})

app.post("/getChinaDayAddList", (req, res) => {
  const where = {};
  const set = { _id: 0, __v: 0 };
  ChinaDayAddList.find(where, set, {}, function (err: any, results: any) {
    res.json(results)
  });
})

app.use((error: Error, req: any, res: any, next: Function) => {
  res.json({
    ok: 0,
    error
  })
})

app.listen(port, function () {
  console.info(`listening on port ${port}!`);
});

module.exports = app;
module.exports = mongoClient;