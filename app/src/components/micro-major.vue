<template>
	<view class="micro-major">
		<view class="major-list">
			<view
				v-for="(item, index) in list"
				:key="index"
				class="major-card"
				@click="handleClick(item)"
			>
				<image class="major-cover" :src="item.courses.cover_image" mode="aspectFill" />
				<view class="major-info">
					<text class="major-title">{{ item.courses.title }} </text>
					<text class="major-desc">{{ item.courses.intro_desc }}</text>
					<view class="major-footer">
						<view class="major-progress-wrap">
							<view class="major-progress-bar">
								<view class="major-progress-fill" :style="{ width: item.progress_number + '%' }"></view>
							</view>
							<text class="major-progress-text">{{ item.progress_number }}%</text>
						</view>
						<text class="major-status" :class="statusClass(item)">{{ statusTest(item) }}</text>
					</view>
				</view>
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

const emit = defineEmits(['click', 'more'])

const handleClick = (item) => {
	emit('click', item)
}
const statusTest = (item) => { 
	if(item.progress_number == 0){
		return '未开始'
	}
	if(item.progress_number > 0 && item.progress_number < 100){
		return '学习中'
	}
	return '已完成'
}
const statusClass = (item) => {
	if(item.progress_number == 0){
		return 'status-default'
	}
	if(item.progress_number > 0 && item.progress_number < 100){
		return 'status-learning'
	}
	return 'status-completed'
}
</script>

<style lang="scss" scoped>
.micro-major {
	padding: 0 32rpx 24rpx;

	.major-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;

		.major-card {
			display: flex;
	background: var(--card-glass-bg);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
			overflow: hidden;
			backdrop-filter: blur(var(--card-glass-blur));

			.major-cover {
				width: 200rpx;
				height: 200rpx;
				flex-shrink: 0;
			}

			.major-info {
				width: 500rpx;
				overflow: hidden;
				padding: 24rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.major-title {
					font-size: 30rpx;
					font-weight: 600;
					color: var(--text-primary);
					margin-bottom: 8rpx;
				}

				.major-desc {
					width: 100%;
					font-size: 24rpx;
					color: var(--text-tertiary);
					margin-bottom: 16rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.major-footer {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.major-progress-wrap {
						flex: 1;
						display: flex;
						align-items: center;
						gap: 12rpx;
						margin-right: 16rpx;

						.major-progress-bar {
							flex: 1;
							height: 6rpx;
							background: var(--border-color);
							border-radius: var(--radius-xs);
							overflow: hidden;

							.major-progress-fill {
								height: 100%;
								background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
								border-radius: var(--radius-xs);
							}
						}

						.major-progress-text {
							font-size: 22rpx;
							color: var(--color-primary);
							font-weight: 600;
							flex-shrink: 0;
						}
					}

					.major-status {
						font-size: 22rpx;
						padding: 6rpx 16rpx;
						border-radius: var(--radius-sm);
						flex-shrink: 0;

						&.status-default {
							background: var(--card-bg);
		color: var(--text-tertiary);
						}

						&.status-learning {
							background: var(--color-primary-light);
							color: var(--color-primary);
						}

						&.status-completed {
							background: var(--color-success-light);
							color: var(--color-success);
						}
					}
				}
			}
		}
	}
}
</style>
