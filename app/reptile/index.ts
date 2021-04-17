import mongoClient from '../mongoClient/index';
import { ChinaDayList, ProvinceCompare, ChinaDayAddList, ForeignList } from "./Schema";
import request from 'request';
import { DEFAULT_PROVINCE, OverwriteDatabase } from '../config';

mongoClient

request('https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=chinaDayList', (error: any, response: any, body: any) => {
  console.info("获取ChinaDayList数据成功")
  const data = JSON.parse(body).data.chinaDayList;
  const list = Array.isArray(data) ? data : [];
  OverwriteDatabase(ChinaDayList, list, 'ChinaDayList')
})

request('https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=chinaDayAddList', (error: any, response: any, body: any) => {
  console.info("获取ChinaDayAddList数据成功")
  const data = JSON.parse(body).data.chinaDayAddList;
  const list = Array.isArray(data) ? data : [];
  OverwriteDatabase(ChinaDayAddList, list, 'ChinaDayAddList')
})

request('https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=asymptomaticProvince', (error: any, response: any, body: any) => {
  console.info("获取provinceCompare数据成功")
  const data = JSON.parse(body).data.asymptomaticProvince.confirm;
  const list = Array.isArray(data) ? data : [];
  const resData: any[] = []
  for (let provinceData of DEFAULT_PROVINCE) {
    let needAssignData;
    for (let item of list) {
      if (item.province === provinceData.province) {
        needAssignData = item;
      }
    }
    resData.push(Object.assign(provinceData, needAssignData || { confirm: 0, province: provinceData.province, increase: 0 }))
  }
  OverwriteDatabase(ProvinceCompare, resData, 'ProvinceCompare')
})

/**
 * foreign
 */
request('https://api.inews.qq.com/newsqa/v1/automation/foreign/country/ranklist', (error: any, response: any, body: any) => {
  console.info("获取ForeignList数据成功")
  const data = JSON.parse(body).data;
  const list = Array.isArray(data) ? data : [];
  OverwriteDatabase(ForeignList, list, 'ForeignList')
})

