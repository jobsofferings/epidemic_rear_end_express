import mongoClient from '../mongoClient/index';
import { ChinaDayList, ProvinceCompare, ChinaDayAddList, ForeignList } from "./Schema";
import request from 'request';

mongoClient

request('https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=chinaDayList', (error: any, response: any, body: any) => {
  console.info("获取ChinaDayList数据成功")
  const data = JSON.parse(body).data.chinaDayList;
  const list = Array.isArray(data) ? data : [];
  ChinaDayList.deleteMany({}, {}, function (err: any) {
    console.info("清除ChinaDayList数据成功")
    ChinaDayList.create(list, (err: any, res: any) => {
      if (!err) {
        console.info(`ChinaDayList: ${list.length}个文档更新成功`)
      }
    })
  });
})

request('https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=chinaDayAddList', (error: any, response: any, body: any) => {
  console.info("获取ChinaDayAddList数据成功")
  const data = JSON.parse(body).data.chinaDayAddList;
  const list = Array.isArray(data) ? data : [];
  ChinaDayAddList.deleteMany({}, {}, function (err: any) {
    console.info("清除ChinaDayAddList数据成功")
    ChinaDayAddList.create(list, (err: any, res: any) => {
      if (!err) {
        console.info(`ChinaDayAddList: ${list.length}个文档更新成功`)
      }
    })
  });
})

request('https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=provinceCompare', (error: any, response: any, body: any) => {
  console.info("获取provinceCompare数据成功")
  const data = JSON.parse(body).data.provinceCompare;
  const list = Object.keys(data).map(province => ({
    ...data[province],
    province
  }));
  ProvinceCompare.deleteMany({}, {}, function (err: any) {
    console.info("清除provinceCompare数据成功")
    ProvinceCompare.create(list, (err: any, res: any) => {
      if (!err) {
        console.info(`provinceCompare: ${list.length}个文档更新成功`)
      }
    })
  });
})

/**
 * foreign
 */
request('https://api.inews.qq.com/newsqa/v1/automation/foreign/country/ranklist', (error: any, response: any, body: any) => {
  console.info("获取ForeignList数据成功")
  const data = JSON.parse(body).data;
  const list = Array.isArray(data) ? data : [];
  ForeignList.deleteMany({}, {}, function (err: any) {
    console.info("清除ForeignList数据成功")
    ForeignList.create(list, (err: any, res: any) => {
      if (!err) {
        console.info(`ForeignList: ${list.length}个文档更新成功`)
      }
    })
  });
})
