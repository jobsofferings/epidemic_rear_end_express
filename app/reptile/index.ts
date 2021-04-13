import mongoClient from '../mongoClient/index';
import { ChinaDayList } from "./Schema";
import request from 'request';

mongoClient

request('https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=chinaDayList', (error: any, response: any, body: any) => {
  console.info("获取ChinaDayList数据成功")
  const data = JSON.parse(body).data.chinaDayList;
  const list = Array.isArray(data) ? data : [];
  ChinaDayList.remove({}, function (err) {
    ChinaDayList.create(list, (err: any, res: any) => {
      if (!err) {
        console.info(`ChinaDayList: ${list.length}个文档更新成功`)
      }
    })
  });
})