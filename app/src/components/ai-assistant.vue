<template>
	<view class="ai-section">
		<view class="ai-card" @click="handleClick">
			<view class="ai-header">
				<view class="ai-icon">
					<image src="/static/icons/ai.png" />
				</view>
				<view class="ai-title-group">
					<text class="ai-title">{{ title }}</text>
					<text class="ai-subtitle">{{ subtitle }}</text>
				</view>
			</view>
			<view class="ai-input-row">
				<view class="ai-input">
					<text class="ai-placeholder">{{ placeholder }}</text>
				</view>
				<view class="ai-search-btn">
					<text class="ai-search-text">{{ buttonText }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
const props = defineProps({
	title: {
		type: String,
		default: '智能工具助手'
	},
	subtitle: {
		type: String,
		default: '智能客服中心'
	},
	placeholder: {
		type: String,
		default: '输入您需要咨询的问题...'
	},
	buttonText: {
		type: String,
		default: '立即咨询'
	}
})

const emit = defineEmits(['click'])

const handleClick = () => {
	emit('click')
}
</script>

<style lang="scss" scoped>
.ai-section {
	padding: 0 24rpx 32rpx;

	.ai-card {
		background: var(--card-glass-bg);
		backdrop-filter: blur(var(--card-glass-blur));
		-webkit-backdrop-filter: blur(var(--card-glass-blur));
		border-radius: var(--radius-md);
		padding: 32rpx;
		border: 2rpx solid rgba(255, 255, 255, 0.1);
		box-shadow:
			0 4rpx 24rpx rgba(0, 0, 0, 0.15),
			inset 0 1rpx 0 rgba(255, 255, 255, 0.08);

		&:active {
			transform: scale(0.98);
		}

		.ai-header {
			display: flex;
			align-items: center;
			margin-bottom: 24rpx;

			.ai-icon {
				width: 80rpx;
				height: 80rpx;
				border-radius: 20rpx;
				background: linear-gradient(135deg, rgba(120, 119, 255, 0.3) 0%, rgba(255, 107, 107, 0.3) 100%);
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 20rpx;
				image {
					width: 44rpx;
					height: 44rpx;
				}
			}

			.ai-title-group {
				display: flex;
				flex-direction: column;

				.ai-title {
					font-size: 32rpx;
					font-weight: 600;
					color: var(--text-primary);
					margin-bottom: 8rpx;
				}

				.ai-subtitle {
					font-size: 24rpx;
					color: var(--text-secondary);
				}
			}
		}

		.ai-input-row {
			display: flex;
			align-items: center;
			gap: 16rpx;

			.ai-input {
				flex: 1;
				height: 80rpx;
				background: var(--card-glass-bg);
				border: 1px solid var(--border-color);
				border-radius: var(--radius-sm);
				padding: 0 24rpx;
				display: flex;
				align-items: center;
				border: 2rpx solid rgba(255, 255, 255, 0.1);

				.ai-placeholder {
					font-size: 26rpx;
					color: rgba(255, 255, 255, 0.4);
				}
			}

			.ai-search-btn {
				height: 80rpx;
				padding: 0 32rpx;
				background: linear-gradient(135deg, rgba(120, 119, 255, 0.9) 0%, rgba(100, 149, 237, 0.9) 100%);
				border-radius: 16rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				box-shadow: 0 4rpx 16rpx rgba(120, 119, 255, 0.35);

				.ai-search-text {
					font-size: 28rpx;
					color: var(--text-primary);
					font-weight: 500;
					white-space: nowrap;
				}
			}
		}
	}
}
</style>
