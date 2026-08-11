<template>
	<view class="news-section">
		<view class="section-header">
			<text class="section-title">{{ title }}</text>
			<view class="section-more" v-if="showMore" @click="handleClick">
				<text class="more-text">{{ moreText }}</text>
				<uni-icons type="forward" size="20" color="var(--text-tertiary)"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script setup>
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'
const props = defineProps({
	title: {
		type: String,
		default: '比赛资讯'
	},
	moreText: {
		type: String,
		default: '查看更多'
	},
	showMore: {
		type: Boolean,
		default: true
	}
})

const emit = defineEmits(['click'])

const handleClick = (item) => {
	emit('click', item)
}
</script>

<style lang="scss" scoped>
.news-section {
	padding: 0 24rpx;
	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20rpx;

		.section-title {
			font-size: 34rpx;
			font-weight: 600;
			color: var(--text-primary);
		}

		.section-more {
			display: flex;
			align-items: center;
            color: var(--text-tertiary);
			.more-text {
				font-size: 24rpx;
				margin-right: 4rpx;
			}

			.more-arrow {
				width: 24rpx;
				height: 24rpx;
				fill: rgba(255, 255, 255, 0.5);
			}
		}
	}
}
</style>
