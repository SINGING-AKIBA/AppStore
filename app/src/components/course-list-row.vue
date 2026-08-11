<template>
	<view class="course-list">
		<view class="course-item" v-for="(item, index) in list" :key="index" @click="handleClick(item)">
			<image class="course-cover" :src="item.cover_image" mode="aspectFill" />
			<view class="course-info">
				<text class="course-title">{{ item.title }}</text>
				<text class="course-students">{{ item.enrollment_number }}人在学</text>
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

const emit = defineEmits(['click'])

const handleClick = (item) => {
	emit('click', item)
}
</script>

<style lang="scss" scoped>
.course-list {
	display: flex;
	flex-direction: column;
	gap: 10rpx;
	
	.course-item {
		display: flex;
		background: var(--card-glass-bg);
		border: 1px solid var(--border-color);
		overflow: hidden;
		padding: 8rpx;
		border-radius: 10rpx;

		.course-cover {
			width: 150rpx;
			height: 120rpx;
			flex-shrink: 0;
			border-radius: 10rpx;
		}

		.course-info {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			padding-left: 10rpx;

			.course-title {
				display: block;
				font-size: 28rpx;
				font-weight: 600;
				color: var(--text-primary);
				margin-bottom: 12rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}

			.course-students {
				font-size: 22rpx;
				color: var(--text-tertiary);
			}
		}
	}
}
</style>