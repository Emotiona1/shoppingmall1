import {debounce} from './utils'
export const itemListenerMixin = {
  data() {
    return {
      itemImageListener:null,
    }
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh,100);

    this.itemImageListener = () => {
      refresh()
    }
    this.$bus.$on('itemImgLoad', this.itemImageListener)
    // console.log('我是混入中的内容');
  }
}
import BackTop from 'components/content/backTop/BackTop'
// import {BACK_POSITION} from './const'


export const backTopMixin = {
  components: {
    BackTop
  },
  data () {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backClick () {
      this.$refs.scroll.scrollTo(0,0,300)
    },
  },
}