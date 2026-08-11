<template>
	<view class="dev-container">
		<view class="dev-content">
			<uniIcons type="info" size="100" color="var(--text-tertiary)"></uniIcons>
			<text class="dev-title">{{ title }}</text>
			<text class="dev-desc">{{ description }}</text>
			<view v-if="showBackBtn" class="back-btn" @click="handleBack">
				<text class="back-text">{{ backText }}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'
const props = defineProps({
	title: {
		type: String,
		default: '功能开发中'
	},
	description: {
		type: String,
		default: '该功能正在紧锣密鼓地开发中，敬请期待！'
	},
	showBackBtn: {
		type: Boolean,
		default: true
	},
	backText: {
		type: String,
		default: '返回上一页'
	}
})

const emit = defineEmits(['back'])

const handleBack = () => {
	emit('back')
	uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.dev-container {
	min-height: 100vh;
	background: var(--page-bg-gradient);
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;

	&::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: var(--page-deco-1), var(--page-deco-2), var(--page-deco-3);
		z-index: 0;
		pointer-events: none;
	}
}

.dev-content {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 60rpx;

	.dev-title {
		font-size: 40rpx;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 16rpx;
		text-align: center;
	}

	.dev-desc {
		font-size: 28rpx;
		color: var(--text-secondary);
		text-align: center;
		line-height: 1.6;
		margin-bottom: 64rpx;
	}

	.back-btn {
		height: 88rpx;
		padding: 0 64rpx;
		background: var(--card-glass-bg);
		backdrop-filter: blur(var(--card-glass-blur));
		-webkit-backdrop-filter: blur(var(--card-glass-blur));
		border-radius: var(--radius-xl);
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--border-color);
		box-shadow: var(--shadow-md);
		transition: all 0.2s ease;

		&:active {
			transform: scale(0.96);
			background: var(--card-bg-hover);
		}

		.back-text {
			font-size: 30rpx;
			color: var(--text-primary);
			font-weight: 500;
		}
	}
}

@keyframes float {
	0%, 100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-16rpx);
	}
}
</style>
