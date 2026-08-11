<template>
	<view class="empty-container">
		<view class="empty-icon">
			<uni-icons v-if="icon === 'list'" :size="100" color="var('--text-tertiary')" :type="'list'"></uni-icons>
			<uni-icons v-else-if="icon === 'search'" :size="100" color="var('--text-tertiary')" :type="'search'"></uni-icons>
			<uni-icons v-else-if="icon === 'network'"   :size="100" color="var('--text-tertiary')" :type="'gear'"></uni-icons>
			<uni-icons v-else :size="100" color="var('--text-tertiary')" :type="'info'"></uni-icons>
		</view>
		<text class="empty-title">{{ title }}</text>
		<text v-if="description" class="empty-desc">{{ description }}</text>
		<view v-if="showRefreshBtn" class="refresh-btn" @click="handleRefresh">
			<text class="refresh-text">{{ refreshText }}</text>
		</view>
	</view>
</template>

<script setup>
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'
/**
 * @description 列表为空时显示的空页面
 * @property {String} icon 列表为空时显示的图标，可选值：'list'、'search'、'network'、'default'
 * @property {String} title 列表为空时显示的标题
 * @property {String} description 列表为空时显示的描述
 * @property {Boolean} showRefreshBtn 是否显示刷新按钮
 * @property {String} refreshText 刷新按钮的文字
 * @event {Function} refresh 刷新按钮点击事件
 */
const props = defineProps({
	icon: {
		type: String,
		default: 'default'
	},
	title: {
		type: String,
		default: '暂无数据'
	},
	description: {
		type: String,
		default: ''
	},
	showRefreshBtn: {
		type: Boolean,
		default: false
	},
	refreshText: {
		type: String,
		default: '刷新试试'
	}
})

const emit = defineEmits(['refresh'])

const handleRefresh = () => {
	emit('refresh')
}
</script>

<style lang="scss" scoped>
.empty-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 120rpx 60rpx;
}

.empty-icon {
	margin-bottom: 32rpx;
	opacity: 0.4;
	text-align: center;
}

.empty-title {
	font-size: 32rpx;
	font-weight: 500;
	color: var(--text-tertiary);
	margin-bottom: 16rpx;
	text-align: center;
}

.empty-desc {
	font-size: 26rpx;
	color: var(--text-tertiary);
	text-align: center;
	line-height: 1.6;
	margin-bottom: 40rpx;
}

.refresh-btn {
	height: 72rpx;
	padding: 0 48rpx;
	background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
	border-radius: var(--radius-xl);

	display: flex;
	align-items: center;
	justify-content: center;

	&:active {
		opacity: 0.8;
	}

	.refresh-text {
		font-size: 28rpx;
		color: var(--text-primary);
		font-weight: 500;
	}
}
</style>