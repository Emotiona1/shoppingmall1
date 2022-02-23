import {
ADD_COUNTER,
ADD_TO_CART
} from './mutation-types'

export default {
  addCart(context,payload) {
      return new Promise((resolve,reject) => {
        //payoad新添加的商品
      // let oldProduct = null;
      //判断内部是否已经添加过该商品 如果添加过 将指针oldproduct指向这个商品
      
      // for(let item of state.cartList) {
      //   if(item.iid == payload.iid) {
      //     oldProduct = item
      //   }
      // }
      //查找之前是否含有该商品
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid) 

      //2.判断oldProduct
      //如果指针有指向 说明内部含有该商品 让该商品的数量+1 
      //如果指针无指向 说明内部无该商品 让刚商品的数量变为1 且向内部添加该商品
      if(oldProduct) {
        context.commit(ADD_COUNTER,oldProduct);
        resolve('该商品数量+1')
      }else {
        payload.count = 1 
        context.commit(ADD_TO_CART,payload)
        resolve('添加了新的商品')
      }
    })
      }
}