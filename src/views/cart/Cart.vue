<template>
  <div class="cart">
    <!-- 导航 -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{len}})</div>
    </nav-bar>
    <!-- 列表 -->
    <scroll class="content" ref="scroll">
      <cart-list ref="cart-list"/>
    </scroll>
    
    <!-- 底部的汇总 -->
    <cart-bottom-bar class="cart-bottom-bar">
      <!-- <div class="item-price left">¥{{ item.price }}</div>
      <div class="item-count right">x{{ item.count }}</div> -->
    </cart-bottom-bar>

  </div>
</template>

<script>
import Scroll from 'components/common/scroll/Scroll'
import NavBar from 'components/common/navbar/NavBar'
import CartList from './childComps/CartList.vue'


//mapGetters 辅助函数 将store中的getter映射到局部计算属性
import { mapGetters } from 'vuex'
import CartBottomBar from './childComps/CartBottomBar.vue'

  export default {
    name: "Cart",
    components: {
      NavBar,
      CartList,
      Scroll,
      CartBottomBar,
        CartBottomBar
    },
    computed: {
      // cartLength() {
      //   return this.$store.getters.cartLength

      //两种语法  减少计算属性
      //用getter属性默认名字用数组
      //...mapGetters(['cartLength','cartList'])
      //给getter属性起另外的名字用对象写法
      ...mapGetters({
        len:'cartLength', //可以自定义名字
        list: 'cartList',
      }),
      // getlength() {
      //   return this.$store.state.cartList.filter(item => {
      //     return item.checked
      //   }).length
      // }
      },
    activated() {
      this.$refs.scroll.refresh()
      // console.log('--------');
    }


    }
  
</script>

<style scoped>
  .nav-bar {
    background-color:var(--color-tint);
    color: #fff;
    font-weight: 700;
  }

  .cart {
    height: 100vh;
  }

  /* .content {
    
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;

    overflow: hidden;
  
  } */
  .content {
    height: calc(100% - 93px - 40px);
    overflow: hidden;
    /* margin-top: 44px; */
  }


  /* .cart-bottom-bar {
  position: absolute;
  right: 10px;
  bottom: 10px;
  left: 10px;
  margin-top: 10px;
} */
/* .cart-bottom-bar .item-price {
  color: #ff4500;
} */
</style>
