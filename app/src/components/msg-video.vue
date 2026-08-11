<template>
  <view class="msg-video">
    <video :src="content" class="video-box" controls></video>
  </view>
</template>

<script setup>
defineProps({
  content: { type: String, required: true }
});
</script>

<style scoped>
.video-box {
  width: 450rpx;
  height: 300rpx;
  border-radius: 10rpx;
}
</style>