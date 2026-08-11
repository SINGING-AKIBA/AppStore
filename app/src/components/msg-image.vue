<template>
  <view class="msg-image" @click="preview">
    <image :src="content" mode="widthFix" class="img" />
  </view>
</template>

<script setup>
const props = defineProps({
  content: { type: String, required: true }
});

const preview = () => {
  uni.previewImage({
    urls: [props.content]
  });
};
</script>

<style scoped>
.img {
  max-width: 400rpx;
  border-radius: 10rpx;
  display: block; /* 消除图片底部空隙 */
}
</style>