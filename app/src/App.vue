<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { storage } from '@/utils/storage'


onLaunch((options) => {
  console.log("App Launch", options);
  // 保存分享启动参数（路径+查询参数），供登录后跳转回目标页面
  if (options?.path || options?.query) {
    storage.set('shareParams', {
      path: options.path,
      query: options.query
    })
  }
});

onShow((options)=> {
  if (options?.path || options?.query) {
    storage.set('shareParams', {
      path: options.path,
      query: options.query
    })
  }
});

onHide(() => {
  console.log("App Hide");
});
</script>

<style>

</style>
