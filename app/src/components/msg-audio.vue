<template>
  <view class="msg-audio" @click="playAudio">
    <view class="icon-box">
      <text class="icon">{{ isPlaying ? '⏸' : '▶' }}</text>
    </view>
    <text class="duration">{{ duration }}s</text>
  </view>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';

const props = defineProps({
  content: { type: String, required: true }, // 音频地址
  extra: { type: Object, default: () => ({ duration: 0 }) } // 额外数据，如时长
});

const isPlaying = ref(false);
const innerAudioContext = uni.createInnerAudioContext();
const duration = ref(props.extra.duration || 0);

innerAudioContext.src = props.content;

innerAudioContext.onPlay(() => { isPlaying.value = true; });
innerAudioContext.onEnded(() => { isPlaying.value = false; });
innerAudioContext.onStop(() => { isPlaying.value = false; });
innerAudioContext.onError((res) => { console.log(res.errMsg); isPlaying.value = false; });

const playAudio = () => {
  if (isPlaying.value) {
    innerAudioContext.stop();
  } else {
    innerAudioContext.play();
  }
};

onUnmounted(() => {
  innerAudioContext.destroy();
});
</script>

<style scoped>
.msg-audio {
  display: flex;
  align-items: center;
  width: 200rpx;
  /* 图标和文字间距 */
  gap: 10rpx;
}
.icon { font-size: 32rpx; }
.duration { font-size: 26rpx; opacity: 0.8; }
</style>