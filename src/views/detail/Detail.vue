<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick = 'titleClick' ref="nav"/>
    <scroll class="content" ref="scroll" :probe-type = '3' @scroll = "contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info = 'detailInfo' @imageLoad='imageLoad'/>
      <detail-params-info :param-info = 'paramInfo' ref="params"/>
      <detail-comment-info :comment-info="commentInfo" ref="comment" />
      <goods-list :goods='recommends' ref="recommend"></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/> <!--  组件监听点击需要添加.native -->
    <!-- <back-top></back-top> -->
    <detail-bottom-bar @addCart = 'addToCart'/>
    <!-- <toast :message='message' :show="show"/> -->
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar.vue'
  import DetailSwiper from './childComps/DetailSwiper.vue'
  import DetailBaseInfo from './childComps/DetailBaseInfo.vue'
  import DetailShopInfo from './childComps/DetailShopInfo.vue'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo.vue'
  import DetailParamsInfo from './childComps/DetailParamInfo.vue'
  import DetailCommentInfo from './childComps/DetailCommentInfo.vue'
  import DetailBottomBar from './childComps/DetailBottomBar.vue'
  import BackTop from 'components/content/backTop/BackTop'

  import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from 'components/content/goods/GoodsList'
  // import Toast from 'components/common/toast/Toast'

  import {getDetail,Goods,Shop,GoodsParam,getRecommend} from 'network/detail'
  import {debounce} from 'common/utils'
  // import {itemListenerMixin,backTopMixin} from 'common/mixin'
  import {itemListenerMixin} from 'common/mixin'
  
  

  export default {
    name:'Detail',
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamsInfo,
      DetailCommentInfo,
      GoodsList,
      DetailBottomBar,
      BackTop,
      // Toast,


      Scroll,
    },
    // mixins: [itemListenerMixin,backTopMixin],
    mixins: [itemListenerMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods:{},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        currentIndex:0,
        itemImageListener:null,
        isShowBackTop:false,
        // message:'',
        // show: false,
      }
    },
    created() {
      //1.保存传入的id
      this.iid = this.$route.params.iid

      //2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        const data = res.result;
        this.topImages = data.itemInfo.topImages

        //获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        //3.创建店铺信息的对象
        this.shop = new Shop(data.shopInfo)

        //4.保存商品的详情数据
        this.detailInfo = data.detailInfo;

        //5.获取参数的信息
        this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)

        //6.取出评论的信息
        if(data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }
        //仍然不对
        //下一帧 即上传完数据 等渲染完才执行
        //根据最新的数据，对应的DOM是已经被渲染出来
        //但是图片依然是没有加载完(目前获取到offsetTop不包含其中的图片)，
        // offsetTop值不对的时候，都是因为图片的问题
        // this.$nextTick(() => {
        // this.themeTopYs = [];

        // this.themeTopYs.push(0);
        // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);

        })
        
      // })

      //3.请求推荐数据
       getRecommend().then(res => {
         this.recommends = res.data.list
       })
    },
    methods: {
      imageLoad() {
        this.$refs.scroll.refresh()

        this.themeTopYs = [];

        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop || this.$refs.recommend.$el.offsetTop );
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        this.themeTopYs.push(Number.MAX_VALUE)
        // console.log(this.themeTopYs);

      },
      titleClick(index) {
        // console.log(index);
        this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],100)
      },
      contentScroll(position) {
        //1.获取y值
        const positionY = -position.y

        //2.positionY和主题中的值进行对比
        //[0,7938,9120,9452]
        // positionY 在 0 和 7938 之间 index=0
        // positionY 在 7938 和 9120 之间 index=1
        // positionY 在 9120 和 9452 之间 index=2
        
        // positionY 超过 9452  index=3
        //这样的i+1获取不到
        // for(let i = 0;i + 1<this.themeTopYs.length;i++) {
        //   if(positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) {
        //     console.log(i);
        //   }
        // }
        let length = this.themeTopYs.length;
        //1.简单的做法
        // for(let i = 0; i< length;i++) {
        //   if(this.currentIndex != i && (i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1] || i == length - 1 && positionY >= this.themeTopYs[i])) {
        //     this.currentIndex = i;
        //     // console.log(this.currentIndex);
        //     this.$refs.nav.currentIndex = this.currentIndex
        //   }
        // }

        // 2.第二种  先在内部尾巴加一个最大值 然后遍历 len-1
        for(let i = 0;i<length - 1;i++) {
          if((this.currentIndex != i) && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) {
            this.currentIndex = i;
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }
        //3.BAckTop是否显示
        // 1.判断BackTop是否显示
      //  this.listenShowBackTop(position)
      this.isShowBackTop = positionY > 1000
      },
      backClick() {
        this.$refs.scroll.scrollTo(0,0)
      },
      addToCart () {
        const product = {}
        // 获取商品信息
       product.image = this.topImages[0]
       product.title = this.goods.title
      product.desc = this.goods.desc
       product.price = this.goods.realPrice
       product.iid = this.iid
      // 把商品信息保存到购物车
       this.$store.dispatch('addCart',product).then(res => {
        //  console.log(res)

      // console.log(this.$toast);
        this.$toast.show(res,2000)
        // this.show = true;
        // this.message = res;
        
        // setTimeout(() => {
        //   this.show = false;
        //   this.message = '';
        // }, 1500);
       }) //传入action用dispatch
      // this.$store.commit('addCart',product) //传入mutation用commoit
      }


    },
    mounted() {
    },
    updated() {
      // this.themeTopYs = [];

      // this.themeTopYs.push(0);
      // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);

    },
    destoryed() {
       this.$bus.$off('itemImgLoad', this.itemImageListener)
    }
  }
</script>

<style scoped>
 #detail {
   position: relative;
   z-index: 9;
   background-color: #fff;
   height: 100vh;
 }

 .content {
   height: calc(100% - 44px);
 }

 .detail-nav {
   position: relative;
   z-index: 9;
   background-color: #fff;
 }
</style>