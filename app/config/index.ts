import mongoose from 'mongoose';

export const DEFAULT_IMAGE = 'http://localhost:4397/article1.jpg';

export const DEFAULT_PROVINCE = [
  { province: '北京', confirm: 0, increase: 0 },
  { province: '天津', confirm: 0, increase: 0 },
  { province: '河北', confirm: 0, increase: 0 },
  { province: '山西', confirm: 0, increase: 0 },
  { province: '内蒙古', confirm: 0, increase: 0 },
  { province: '辽宁', confirm: 0, increase: 0 },
  { province: '吉林', confirm: 0, increase: 0 },
  { province: '黑龙江', confirm: 0, increase: 0 },
  { province: '上海', confirm: 0, increase: 0 },
  { province: '江苏', confirm: 0, increase: 0 },
  { province: '浙江', confirm: 0, increase: 0 },
  { province: '安徽', confirm: 0, increase: 0 },
  { province: '福建', confirm: 0, increase: 0 },
  { province: '江西', confirm: 0, increase: 0 },
  { province: '山东', confirm: 0, increase: 0 },
  { province: '河南', confirm: 0, increase: 0 },
  { province: '湖北', confirm: 0, increase: 0 },
  { province: '湖南', confirm: 0, increase: 0 },
  { province: '广东', confirm: 0, increase: 0 },
  { province: '广西', confirm: 0, increase: 0 },
  { province: '海南', confirm: 0, increase: 0 },
  { province: '重庆', confirm: 0, increase: 0 },
  { province: '四川', confirm: 0, increase: 0 },
  { province: '贵州', confirm: 0, increase: 0 },
  { province: '云南', confirm: 0, increase: 0 },
  { province: '陕西', confirm: 0, increase: 0 },
  { province: '甘肃', confirm: 0, increase: 0 },
  { province: '青海', confirm: 0, increase: 0 },
  { province: '宁夏', confirm: 0, increase: 0 },
  { province: '新疆', confirm: 0, increase: 0 },
  { province: '台湾', confirm: 0, increase: 0 },
  { province: '西藏', confirm: 0, increase: 0 },
];

export function OverwriteDatabase(schema: mongoose.Model<any, any>, data: any[], name = '') {
  return schema.deleteMany({}, {}, function (err: any) {
    console.info(`清除${name}数据成功`)
    schema.create(data, (err: any, res: any) => {
      if (!err) {
        console.info(`${name}: ${data.length}个文档更新成功`)
      }
    })
  });
}

export const getPredictedNumber = (xList: number[], yList: number[], x: number) => {
  let alpha = 0.00001
  let m = 7
  let ftheta0 = 0
  let ftheta1 = 0
  let error0 = 0
  let error1 = 0
  let epsilon = 0.0001
  const f = (xList: number) => ftheta1 * xList + ftheta0
  let fresult0 = []
  let fresult1 = []
  let isEnd = false;
  while (!isEnd) {
    let diff = [0, 0]
    for (let i = 0; i < m; i++) {
      diff[0] += f(xList[i]) - yList[i]
      diff[1] += (f(xList[i]) - yList[i]) * xList[i]
    }
    ftheta0 = ftheta0 - alpha / m * diff[0]
    ftheta1 = ftheta1 - alpha / m * diff[1]
    fresult0.push(ftheta0)
    fresult1.push(ftheta1)
    error1 = 0
    for (let i = 0; i < xList.length; i++) {
      error1 += (yList[i] - (ftheta0 + ftheta1 * xList[i])) ** 2 / 2
    }
    if (Math.abs(error1 - error0) < epsilon) {
      isEnd = true;
    } else {
      error0 = error1
    }
  }
  return x * ftheta1 + ftheta0;
}

export const formatNumber = (num: number) => `${num < 10 ? '0' : ''}${num}`