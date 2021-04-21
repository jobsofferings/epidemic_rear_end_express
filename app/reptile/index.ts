import mongoClient from '../mongoClient/index';
import { ChinaDayList, ProvinceCompare, ChinaDayAddList, ForeignList } from "./Schema";
import request from 'request';
import { DEFAULT_PROVINCE, formatNumber, getPredictedNumber, OverwriteDatabase } from '../config';
import moment, { Moment } from 'moment';

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
  const listFormat = list.map(item => {
    return {
      ...item,
      moment: moment(moment()).diff(moment(`${item.date}-${item.y}`, "MM.DD-YYYY"), 'day'),
      time: new Date(`${item.y}-${item.date}`).getTime()
    }
  }).sort((a, b) => - a.moment + b.moment)
  console.info("ChinaDayAddList 预测开始")
  const predictedList = [];
  predictedList.push(getPredictItem(
    moment(),
    listFormat[listFormat.length - 1].moment - 1,
  ))
  predictedList.push(getPredictItem(
    moment().add(1, 'days'),
    listFormat[listFormat.length - 1].moment - 2,
  ))
  function getPredictItem(time: Moment, moment: number) {
    return {
      confirm: Math.abs(Math.floor(getPredictedNumber(
        listFormat.map(({ moment }) => moment),
        listFormat.map(({ confirm }) => confirm),
        moment,
      ))),
      heal: Math.abs(Math.floor(getPredictedNumber(
        listFormat.map(({ moment }) => moment),
        listFormat.map(({ heal }) => heal),
        moment,
      ))),
      moment: moment,
      time: time.startOf('day').valueOf(),
      y: time.year(),
      date: `${formatNumber(time.month() + 1)}.${formatNumber(time.date())}`,
    }
  }
  console.info("ChinaDayAddList 预测结束")
  OverwriteDatabase(ChinaDayAddList, listFormat.concat(predictedList), 'ChinaDayAddList')
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

