<template>
  <div class="bottom-bar">
    <div  class="check-content">
      <check-button :isChecked='isSelectorAll'  class="check-button" @click.native="checkClick"/>
      <span>全选</span>
    </div>
    <div class="price">
        <div>合计:{{totalPrice}}</div>
    </div>

    <div class="calculate" @click="cartClick">
       去计算({{checkedLength}})
    </div>
  </div>
  
</template>

<script>
  import CheckButton from 'components/content/checkButton/CheckButton'

  import {mapGetters} from 'vuex'

  export default {
    name:'CartBottomBar',
    components: {
      CheckButton,
    },
    computed: {
      ...mapGetters(['cartList']),
      totalPrice() {
        return '￥'+ this.cartList.filter(item => {
          return item.checked
        }).reduce((preValue,item) => {
          return preValue + item.price * item.count
        },0).toFixed(2)
      },
      checkedLength() {
        return this.cartList.filter(item => item.checked).length
      },
      isSelectorAll() {
        // return !(this.cartList.filter(item => !item.checked).length)
        if(this.cartList.length == 0) return false
        return !this.cartList.find(item => !item.checked)
      }
    },
    methods: {
      checkClick() {
        if(this.isSelectorAll) { //如果全部选中
          this.cartList.forEach(item => item.checked = false);
        }else {  //如果全部不选中 或者部分不选中
          this.cartList.forEach(item => item.checked = true);
        }
        
      },
      cartClick() {
        if(!this.isSelectorAll) {
          this.$toast.show('请选择购买的商品',2000)
        }
      }
    },
  }
</script>

<style scoped>
  .bottom-bar {
    background-color: #eee;
    height: 40px;
    position: relative;
    line-height: 40px;
    display: flex;
    font-size: 14px;
  }

  .check-content {
    display: flex;
    align-items: center;
    margin-left: 10px;
    width: 60px;
    /* line-height: 40px; */

  }

  .check-button {
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }

  .price {
    margin-left: 20px;
    flex: 1;
  }

  .calculate {
    width: 90px;
    background-color: red;
    color: #fff;
    text-align: center;
  }
</style>