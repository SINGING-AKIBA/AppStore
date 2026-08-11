<template>
  <view class="msg-text">
    <text :user-select="true">{{ content }}</text>
  </view>
</template>

<script setup>
defineProps({
  content: { type: String, required: true }
});
</script>

<style scoped>
.msg-text {
  font-size: 30rpx;
  line-height: 1.6;
  word-break: break-all;
}
</style>