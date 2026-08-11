<template>
	<view class="menu-section">
		<view class="menu-grid">
			<view class="menu-item" v-for="(item, index) in dataList" :key="index" @click="handleClick(item)">
				<view class="menu-icon-wrapper" :class="item.bg_color">
					<image :src="item.icon" mode="aspectFit"></image>
				</view>
				<text class="menu-text">{{ item.name }}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { index as MenusApi } from "@/api/Menus"
import { navigateTo } from "@/utils/nav"
const props = defineProps({
	list: {
		type: Array,
		default: () => []
	},
	columns: {
		type: Number,
		default: 4
	}
})

const dataList = ref([])
const handleClick = (item) => {
	switch (item.link_type) {
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
		case 30:
			//跳转小程序

			break;
	}
}
onMounted(() => {
	if (dataList.value.length == 0) {
		MenusApi({pageSize:8,page:1}).then(res => {
			dataList.value = res.data.data
		})
	}

})
</script>

<style lang="scss" scoped>
.menu-section {
	padding: 32rpx 24rpx;

	.menu-grid {
		display: grid;
		grid-template-columns: repeat(v-bind(columns), 1fr);
		gap: 24rpx;
		background: var(--card-glass-bg);
		backdrop-filter: blur(var(--card-glass-blur));
		-webkit-backdrop-filter: blur(var(--card-glass-blur));
		border-radius: var(--radius-md);
		padding: 32rpx 16rpx;
		border: 2rpx solid var(--border-color);
		box-shadow: var(--card-glass-shadow);

		.menu-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 16rpx 0;

			&:active {
				opacity: 0.7;
			}

			.menu-icon-wrapper {
				width: 96rpx;
				height: 96rpx;
				border-radius: 24rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 12rpx;

				image {
					width: 48rpx;
					height: 48rpx;
				}
			}

			.learn-icon {
				background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary-hover) 100%);
				color: var(--color-primary);
			}

			.match-icon {
				background: linear-gradient(135deg, var(--color-accent-light) 0%, var(--color-accent-hover) 100%);
				color: var(--color-accent);
			}

			.cert-icon {
				background: linear-gradient(135deg, var(--color-secondary-light) 0%, var(--color-secondary-hover) 100%);
				color: var(--color-secondary);
			}

			.ai-icon {
				background: linear-gradient(135deg, var(--color-orange-light) 0%, var(--color-orange-light) 100%);
				color: var(--color-orange);
			}

			.schedule-icon {
				background: linear-gradient(135deg, var(--color-green-light) 0%, var(--color-green-light) 100%);
				color: var(--color-green);
			}

			.score-icon {
				background: linear-gradient(135deg, var(--color-blue-light) 0%, var(--color-blue-light) 100%);
				color: var(--color-blue);
			}

			.notice-icon {
				background: linear-gradient(135deg, var(--color-salmon-light) 0%, var(--color-salmon-light) 100%);
				color: var(--color-salmon);
			}

			.user-icon {
				background: linear-gradient(135deg, var(--color-pink-light) 0%, var(--color-pink-light) 100%);
				color: var(--color-pink);
			}

			.menu-text {
				font-size: 24rpx;
				color: var(--text-quaternary);
				font-weight: 500;
			}
		}
	}
}
</style>
