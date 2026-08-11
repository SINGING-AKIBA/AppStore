<template>
	<view class="banner-section">
		<swiper class="banner-swiper" circular :autoplay="autoplay" :interval="interval" indicator-dots indicator-active-color="#7877FF" indicator-color="rgba(255,255,255,0.3)">
			<swiper-item v-for="(item, index) in list" :key="index" @click="handleClick(item)">
				<image class="banner-image" :src="item.image" mode="aspectFill" />
			</swiper-item>
		</swiper>
	</view>
</template>

<script setup>
import { onMounted,ref } from 'vue'
import { index as listApi } from '@/api/Banners'
import { navigateTo,webUrlKey } from '@/utils/nav';
const list = ref([]);
const props = defineProps({
	position: {
		type: Number,
		default: 0
	},
	autoplay: {
		type: Boolean,
		default: true
	},
	interval: {
		type: Number,
		default: 3000
	}
})
const handleClick = (item) => {
	switch(item.link_type){
		case 0:
			break;
		case 10:
			navigateTo(item.link_url)
			break;
		case 20:
			uni.setStorageSync(webUrlKey, item.link_url)
			uni.navigateTo({
				url: '/pages/web/web?id=' + item.id
			})
		    break;
	}
}

onMounted(() => {
	listApi({position:props.position}).then(res => {
		list.value = res.data.data;
	})
})
</script>

<style lang="scss" scoped>
.banner-section {
	padding: 24rpx 24rpx 0;

	.banner-swiper {
		height: 320rpx;
		border-radius: var(--radius-md);
		overflow: hidden;
		box-shadow: var(--shadow-xl);

		.banner-image {
			width: 100%;
			height: 100%;
		}
	}
}
</style>
