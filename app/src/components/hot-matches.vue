<template>
	<view class="hot-matches">
		<view class="hot-list">
			<view v-for="(item, index) in list" :key="index" class="hot-card" @click="handleClick(item)">
				<view class="hot-card-top">
					<text class="hot-card-title">{{ item.title }}</text>
					<view class="status-badge" :class="tagType[item.status]">{{ tag[item.status] }}</view>
				</view>
				<text class="hot-card-desc">{{ item.short_desc }}</text>
				<view class="hot-card-bottom">
					<view class="hot-card-date">
						<text class="date-icon"></text>
						<text class="date-text">截止：{{ date('Y-m-d', item.end_datetime) }}</text>
					</view>
					<text class="action-btn">立即报名 →</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { date } from "@/utils/date"
const props = defineProps({
	list: {
		type: Array,
		default: () => []
	}
})
// 10=报名中,20=进行中,30=已结束,
const tagType = {
	1: 'tag-new',
	20: 'tag-hot',
	10: 'tag-new',
	30: 'tag-success',
	40: 'tag-cancel'
}
const tag = {
	1: '预热中',
	10: '报名中',
	20: '进行中',
	30: '喜报',
	40: '已取消'
}



const emit = defineEmits(['click', 'more'])

const handleClick = (item) => {
	emit('click', item)
}

</script>

<style lang="scss" scoped>
.hot-matches {
	padding: 0 24rpx 32rpx;

	.hot-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;

		.hot-card {
			background: var(--card-glass-bg);
			border: 1px solid var(--border-color);
			border-radius: var(--radius-md);
			padding: 28rpx;
			backdrop-filter: blur(var(--card-glass-blur));
			transition: all 0.3s ease;

			.hot-card-top {
				display: flex;
				justify-content: space-between;
				align-items: flex-start;
				margin-bottom: 16rpx;

				.hot-card-title {
					font-size: 32rpx;
					font-weight: 700;
					color: var(--text-primary);
					flex: 1;
					margin-right: 16rpx;
				}

				.status-badge {
					flex-shrink: 0;
					padding: 8rpx 20rpx;
					border-radius: 20rpx;
					font-size: 22rpx;
					font-weight: 500;

					&.tag-hot {
						background: rgba(255, 107, 107, 0.2);
						color: #FF6B6B;
					}

					&.tag-new {
						background: rgba(120, 119, 255, 0.2);
						color: #7877FF;
					}

					&.tag-success {
						background: rgba(78, 205, 196, 0.2);
						color: #4ECDC4;
					}

					&.tag-cancel {
						background: rgba(255, 107, 107, 0.2);
						color: #FF6B6B;
					}
				}
			}

			.hot-card-desc {
				display: block;
				font-size: 26rpx;
				color: var(--text-tertiary);
				line-height: 1.6;
				margin-bottom: 20rpx;
			}

			.hot-card-bottom {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.hot-card-date {
					display: flex;
					align-items: center;
					gap: 8rpx;

					.date-icon {
						font-size: 28rpx;
					}

					.date-text {
						font-size: 24rpx;
						color: var(--text-tertiary);
					}
				}

				.action-btn {
					font-size: 26rpx;
					color: #ff6b6b;
					font-weight: 500;
				}
			}
		}
	}
}
</style>
