import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoClient from './mongoClient/index';
import { ChinaDayAddList, ChinaDayList, ForeignList, ProvinceCompare } from "./reptile/Schema";
import { Messages, User, MessageLike } from './reptile/UserSchema';
import request from 'request';

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

app.post("/login", (req, res) => {
  const { email, password } = req.body
  const where = { email, password };
  const set = { _id: 0, __v: 0 };
  User.find(where, set, {}, function (err: any, results: any) {
    const { username }: any = results[0] || {};
    if (username) {
      res.json({
        flag: true,
        msg: '登录成功',
        user: {
          username,
          email,
        },
      })
    } else {
      res.json({
        flag: false,
        msg: '登录失败，请重新输入密码',
        user: {
          username: '',
          email: '',
        },
      })
    }
  });
})

app.post("/sign", (req, res) => {
  const { username, email, password } = req.body
  if (!username && !email && !password) {
    res.json({
      flag: false,
      msg: '请填写完整信息',
      user: {
        username,
        email,
      },
    })
  }
  const where = { email };
  const set = { _id: 0, __v: 0 };
  User.find(where, set, {}, function (err: any, results: any) {
    if (results.length) {
      res.json({
        flag: false,
        msg: '该注册已注册',
        user: {
          username,
          email,
        },
      })
    } else {
      User.create([{ username, email, password }], (err: any, results2: any) => {
        res.json({
          flag: true,
          msg: '注册成功',
          user: {
            username,
            email,
          },
        })
      })
    }
  });
})

app.post("/getMessages", (req, res) => {
  const { email } = req.body
  const where = {};
  const likeWhere = {};
  const set = { __v: 0 };
  const likeSet = { __v: 0 };
  Messages.find(where, set, {}, function (err: any, results: any) {
    MessageLike.find(likeWhere, likeSet, {}, function (err: any, results2: any) {
      results = results.map((item: any) => {
        let isActive = false;
        let num = 0;
        results2.forEach((item2: any) => {
          if (item._id.toString() === item2.messageId && email === item2.email) {
            isActive = true;
          }
          if (item._id.toString() === item2.messageId) {
            num++;
          }
        })
        return {
          messageContent: item.messageContent,
          time: item.time,
          username: item.username,
          _id: item._id,
          isActive,
          num,
        }
      })
      res.json(results)
    });
  });
})

app.post("/messageLike", (req, res) => {
  const { email, username, _id } = req.body
  const where = { email, username, messageId: _id };
  const set = { __v: 0 };
  if (!email || !username || !_id) {
    return res.json({
      flag: false,
      message: '系统错误',
    })
  }
  MessageLike.find(where, set, {}, function (err: any, results: any) {
    if (!results.length) {
      MessageLike.create({ email, username, messageId: _id, time: new Date().getTime() }, (err: any, results2: any) => {
        res.json({
          flag: !err,
          message: '点赞成功!',
        })
      })
    } else {
      MessageLike.remove({ email, username, messageId: _id }, (err: any) => {
        res.json({
          flag: !err,
          message: '取消点赞成功!',
        })
      })
    }
  });
})

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
  ChinaDayAddList.find(where, set, { sort: [[['time', 1]]] }, function (err: any, results: any) {
    res.json(results)
  });
})

app.post("/getProvinceConfirmList", (req, res) => {
  const where = {};
  const set = { _id: 0, __v: 0, increase: 0 };
  ProvinceCompare.find(where, set, {}, function (err: any, results: any) {
    let max = 0;
    let min = 0;
    for (let { confirm } of results) {
      max = Math.max(confirm, max)
      min = Math.min(confirm, min)
    }
    res.json({
      max,
      min,
      results,
    })
  });
})

app.post("/getCountryConfirm", (req, res) => {
  const { limit = 10, country } = req.body
  const searchCountry = country ? { name: country } : {};
  const where = { ...searchCountry };
  const set = { _id: 0, __v: 0 };
  ForeignList.find(where, set, { limit, sort: [[['confirm', -1]]] }, function (err: any, results: any[]) {
    res.json(results);
  })
})

app.post("/getInfoByCountry", (req, res) => {
  const { country } = req.body
  if (country) {
    request(`https://api.inews.qq.com/newsqa/v1/automation/foreign/daily/list?country=${encodeURI(country)}`, (error: any, response: any, body: any) => {
      res.json(JSON.parse(body).data)
    })
  } else {
    res.json([])
  }
})

app.post("/countryAnddContinent", (req, res) => {
  const where = {}
  const set = { name: 1, continent: 1, _id: 0 };
  ForeignList.find(where, set, {}, function (err: any, results: any[]) {
    res.json(results);
  })
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