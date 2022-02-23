import axios from 'axios'

export function request(config) {

  //第四种
    const instance = axios.create({
    baseURL: "http://152.136.185.210:7878/api/hy66" ,
    timeout:5000
  })
    // 2. axios的拦截器
    // 2.1请求拦截的作用
    instance.interceptors.request.use(config => {   //参数时两个函数
      return config   //记得拦截后要返回出去 否则外部接收不到
    },err => {
      console.log(err);
    })

    // 2.2响应拦截
    instance.interceptors.response.use(res => {   //参数时两个函数
      // console.log(res);
      return res.data  //记得也得返回出去 而且只需要返回内部的data就行
    },err => {
      console.log(err);
    })

  //发送真正的请求
    return instance(config)   /* 本身就是promise 直接返回 外部可以直接调用then和catch方法 */
  }



