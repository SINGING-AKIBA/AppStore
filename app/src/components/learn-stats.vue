<template>
	<view class="learn-stats">
		<view class="stats-header">
			<text class="stats-title">我的学力值</text>
		</view>
		<view class="stats-grid">
			<view
				v-for="(item, index) in list"
				:key="index"
				class="stat-card"
			>
				<view class="stat-icon" :style="{ background: item.color }">
					<image class="icon-text" :src="item.icon" />
				</view>
				<text class="stat-value">{{ item.value }}</text>
				<text class="stat-label">{{ item.label }}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
const props = defineProps({
	list: {
		type: Array,
		default: () => []
	}
})
</script>

<style lang="scss" scoped>
.learn-stats {
	padding: 32rpx 24rpx 40rpx;

	.stats-header {
		margin-bottom: 24rpx;

		.stats-title {
			font-size: 34rpx;
			font-weight: 700;
			color: var(--text-primary);
		}
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 16rpx;

		.stat-card {
			background: var(--card-glass-bg);
			border: 1px solid var(--border-color);
			border-radius: 20rpx;
			padding: 24rpx 16rpx;
			text-align: center;
			backdrop-filter: blur(var(--card-glass-blur));

			.stat-icon {
				width: 64rpx;
				height: 64rpx;
				border-radius: 16rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin: 0 auto 12rpx;

				.icon-text {
					width: 32rpx;
					height: 32rpx;
				}
			}

			.stat-value {
				display: block;
				font-size: 36rpx;
				font-weight: 700;
		color: var(--text-primary);
				margin-bottom: 4rpx;
			}

			.stat-label {
				display: block;
				font-size: 22rpx;
				color: var(--text-tertiary);
			}
		}
	}
}
</style>
