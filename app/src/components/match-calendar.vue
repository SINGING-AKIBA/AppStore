<template>
	<view class="match-calendar">
		<view class="calendar-list">
			<view
				v-for="(item, index) in list"
				:key="index"
				class="calendar-card"
				@click="handleClick(item)"
			>
				<view class="calendar-date">
					<text class="calendar-month">{{ date('m',item.start_datetime) }}</text>
					<text class="calendar-day">{{ date('d',item.start_datetime) }}</text>
				</view>
				<view class="calendar-info">
					<text class="calendar-title">{{ item.title }}</text>
					<text class="calendar-deadline">{{ date('Y年m月d日',item.end_datetime) }} 截止</text>
				</view>
				<view class="calendar-countdown">
					<text class="countdown-text">{{ getDaysLeft(item) }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { date, strtotime } from '@/utils/date'
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

const getDaysLeft = (item)=>{
	const now = new Date().getTime() / 1000
	const end = strtotime(item.end_datetime)
	if(now > end || !item.status >=30){
		return '已截止'
	}
	const daysLeft = Math.ceil((end - now) / 86400)
	return '剩余' + daysLeft + '天'
}
</script>

<style lang="scss" scoped>
.match-calendar {
	padding: 0 24rpx 32rpx;
	.calendar-list {
		display: flex;
		flex-direction: column;
		gap: 16rpx;

		.calendar-card {
			display: flex;
			align-items: center;
	background: var(--card-glass-bg);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
			padding: 24rpx 28rpx;
			backdrop-filter: blur(var(--card-glass-blur));
			transition: all 0.3s ease;

			.calendar-date {
				flex-shrink: 0;
				width: 80rpx;
				text-align: center;
				margin-right: 24rpx;

				.calendar-month {
					display: block;
					font-size: 22rpx;
					color: var(--text-tertiary);
					margin-bottom: 4rpx;
				}

				.calendar-day {
					display: block;
					font-size: 44rpx;
					font-weight: 700;
					color: var(--color-primary);
					line-height: 1;
				}
			}

			.calendar-info {
				flex: 1;
				min-width: 0;

				.calendar-title {
					display: block;
					font-size: 30rpx;
					font-weight: 600;
					color: var(--text-primary);
					margin-bottom: 8rpx;
				}

				.calendar-deadline {
					display: block;
					font-size: 24rpx;
					color: var(--text-tertiary);
				}
			}

			.calendar-countdown {
				flex-shrink: 0;
				margin-left: 20rpx;

				.countdown-text {
					font-size: 28rpx;
					font-weight: 600;
					color: var(--color-accent);
				}
			}
		}
	}
}
</style>
