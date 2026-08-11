<template>
	<view class="match-schedule">
		<view class="schedule-list" v-if="list.length">
			<view
				v-for="(item, index) in list"
				:key="item.id"
				class="schedule-item"
				:class="{ active: isActive(item) }"
			>
				<view class="schedule-dot"></view>
				<view class="schedule-content">
					<view class="schedule-header">
						<text class="schedule-name">{{ item.name }}</text>
						<text class="schedule-status" :class="getStatusClass(item)">{{ getStatusText(item) }}</text>
					</view>
					<view class="schedule-time">
						<view class="time-row">
							<text class="time-label">开始时间</text>
							<text class="time-value">{{ date('Y-m-d',item.start_datetime) }}</text>
						</view>
						<view class="time-row">
							<text class="time-label">结束时间</text>
							<text class="time-value">{{ date('Y-m-d',item.end_datetime) }}</text>
						</view>
					</view>
					<view v-if="item.venue_desc" class="schedule-venue">
						<uni-icons type="location" size="12"></uni-icons>
						<text class="venue-text">{{ item.venue_desc }}</text>
					</view>
				</view>
			</view>
		</view>
		<list-empty v-else></list-empty>
	</view>
</template>

<script setup>
import { date } from '@/utils/date'
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'
import ListEmpty from './list-empty.vue'
const props = defineProps({
	list: {
		type: Array,
		default: () => []
	}
})

const isActive = (item) => {
	const now = new Date().getTime()
	const start = new Date(item.start_datetime).getTime()
	const end = new Date(item.end_datetime).getTime()
	return now >= start && now <= end
}

const getStatusClass = (item) => {
	if (item.status === 20) return 'status-running'
	if (item.status === 30) return 'status-ended'
	const now = new Date().getTime()
	const start = new Date(item.start_datetime).getTime()
	if (now < start) return 'status-upcoming'
	return 'status-registering'
}

const tag = {
	1: '预热中',
	10: '报名中',
	20: '进行中',
	30: '喜报',
	40: '已取消'
}
const getStatusText = (item) => {
	return tag[item.status] || '报名中'
}
</script>

<style lang="scss" scoped>
.match-schedule {
	margin-bottom: 32rpx;

	.schedule-list {
		background: var(--card-glass-bg);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 8rpx 24rpx;
	}

	.schedule-item {
		position: relative;
		padding: 20rpx 0;
		padding-left: 32rpx;
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);

		&:last-child {
			border-bottom: none;
		}

		&:last-child .schedule-dot {
			background: rgba(255, 255, 255, 0.2);
		}

		&.active .schedule-dot {
			background: #ff6b6b;
			box-shadow: 0 0 16rpx rgba(255, 107, 107, 0.6);
		}

		.schedule-dot {
			position: absolute;
			left: 0;
			top: 28rpx;
			width: 12rpx;
			height: 12rpx;
			border-radius: 6rpx;
			background: #7877FF;
		}
	}

	.schedule-content {
		.schedule-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 12rpx;

			.schedule-name {
				font-size: 30rpx;
				font-weight: 600;
				color: var(--text-primary);
			}

			.schedule-status {
				font-size: 22rpx;
				padding: 4rpx 16rpx;
				border-radius: 12rpx;

				&.status-registering {
					background: rgba(76, 217, 100, 0.2);
					color: #4cd964;
				}

				&.status-running {
					background: rgba(255, 107, 107, 0.2);
					color: #ff6b6b;
				}

				&.status-ended {
					background: rgba(153, 153, 153, 0.2);
					color: #999;
				}

				&.status-upcoming {
					background: rgba(240, 173, 78, 0.2);
					color: #f0ad4e;
				}
			}
		}

		.schedule-time {
			.time-row {
				display: flex;
				align-items: center;
				margin-bottom: 6rpx;

				.time-label {
					font-size: 24rpx;
		            color: var(--text-primary);
					width: 140rpx;
				}

				.time-value {
					font-size: 24rpx;
					color: var(--text-tertiary);
				}
			}
		}

		.schedule-venue {
			display: flex;
			align-items: center;
			margin-top: 12rpx;

			.venue-text {
				font-size: 24rpx;
				color: var(--text-tertiary);
				margin-left: 8rpx;
			}
		}
	}
}
</style>