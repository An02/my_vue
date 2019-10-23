<template>
  <viewer class="viewer" ref="viewer" @inited="inited" :images="imageList">
    <img v-for="(item, index) in imageList" :src="item.url" :id='"img" + index' style="display: none;">
  </viewer>
</template>

<script>
import Viewer from 'v-viewer'
import Vue from 'vue'
import 'viewerjs/dist/viewer.css'

Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999
  }
})

export default {
  name: 'imgViewer',
  props: {
    // 图片列表 [{url:'url1'},{ur2:'url2'}]
    imageList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {

  },
  methods: {
    click (url) {
      var imgIndex = -1
      this.imageList.map((item, index) => {
        if (item.url === url) {
          imgIndex = index
        }
      })
      if (imgIndex >= 0) {
        const id = '#img' + imgIndex
        document.querySelector(id).click()
      }
      this.$viewer.show()
    },
    inited (viewer) {
      this.$viewer = viewer
    }
  }
}
</script>

<style scoped>

</style>
