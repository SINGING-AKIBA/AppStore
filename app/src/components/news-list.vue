<template>
	<view class="news-section">
		<view class="news-list">
			<view class="news-item" v-for="(item, index) in list" :key="index" @click="handleClick(item)">
				<image class="news-image" :src="item.cover_image" mode="aspectFill" />
				<view class="news-content">
					<text class="news-title">{{ item.title }}</text>
					<text class="news-desc">{{ item.short_desc }}</text>
					<view class="news-footer">
						<text class="news-tag" :class="tagType[item.status]">{{ tag[item.status] }}</text>
						<text class="news-date">{{ date('Y-m-d', item.start_datetime) }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { date } from "@/utils/date";
const props = defineProps({
	title: {
		type: String,
		default: '比赛资讯'
	},
	moreText: {
		type: String,
		default: '查看更多'
	},
	list: {
		type: Array,
		default: () => []
	}
})

const emit = defineEmits(['click', 'more'])
// 10=报名中,20=进行中,30=已结束,
const tagType = {
	1: 'tag-news',
	20: 'tag-hot',
	10: 'tag-news',
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

const handleClick = (item) => {
	emit('click', item)
}
</script>

<style lang="scss" scoped>
.news-section {
	padding: 0 24rpx 32rpx;
	.news-list {
		.news-item {
			display: flex;
			background: var(--card-glass-bg);
			backdrop-filter: blur(var(--card-glass-blur));
			-webkit-backdrop-filter: blur(var(--card-glass-blur));
			border-radius: var(--radius-md);
			padding: 24rpx 24rpx 8rpx;
			border: 2rpx solid var(--border-color);
			box-shadow: var(--card-glass-shadow);
			margin-bottom: 24rpx;

			&:active {
				background: var(--card-bg-hover);
			}

			.news-image {
				width: 200rpx;
				height: 150rpx;
				border-radius: var(--radius-sm);
				flex-shrink: 0;
				margin-right: 20rpx;
			}

			.news-content {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.news-title {
					font-size: 28rpx;
					font-weight: 600;
					color: var(--text-primary);
					line-height: 1.4;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}

				.news-desc {
					font-size: 24rpx;
					color: var(--text-secondary);
					line-height: 1.4;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
					margin-top: 8rpx;
				}

				.news-footer {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-top: 12rpx;

					.news-tag {
						font-size: 20rpx;
						padding: 4rpx 12rpx;
						border-radius: 8rpx;
						font-weight: 500;

						&.tag-hot {
							background: var(--color-accent-light);
							color: var(--color-accent);
						}

						&.tag-news {
							background: var(--color-primary-hover);
							color: var(--color-primary);
						}

						&.tag-notice {
							background: var(--color-secondary-hover);
							color: var(--color-secondary);
						}
						&.tag-success {
							background: var(--color-success-light);
							color: var(--color-success);
						}
					}
					.news-date {
						font-size: 22rpx;
						color: var(--text-tertiary);
					}
				}
			}
		}
	}
}
</style>
