<template>
	<view class="job-list">
		<view v-if="loading && list.length === 0" class="loading-wrap">
			<text class="loading-text">加载中...</text>
		</view>
		<view v-else-if="list.length" class="list-wrap">
			<view
				v-for="item in list"
				:key="item.id"
				class="job-card"
				@click="handleClick(item)"
			>
				<view class="card-header">
					<view class="job-tags">
						<text v-if="item.salary" class="tag tag-salary">{{ item.salary }}</text>
						<text v-if="item.location" class="tag tag-location">{{ item.province }} {{ item.city }}</text>
					</view>
					<text class="job-date">{{ date("Y-m-d", item.publish_time) }}</text>
				</view>
				<text class="job-title">{{ item.title }}</text>
				<text  class="job-desc">{{ getExcerpt(item.description) }}</text>
				<view class="card-footer">
					<view class="company-info">
						<uni-icons type="person" size="16" color="var(--text-tertiary)"></uni-icons>
						<text class="company-name">{{ item.enterprises.name }}</text>
					</view>
					<text class="apply-btn">立即申请</text>
				</view>
			</view>
		</view>
		<ListEmpty v-else icon="briefcase" :title="emptyText" :description="'暂无' + emptyText" />
		<view v-if="loading && list.length" class="loading-more">
			<text class="loading-text">加载中...</text>
		</view>
		<view v-if="noMore && list.length" class="no-more">
			<text class="no-more-text">— 没有更多了 —</text>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ListEmpty from '@/components/list-empty.vue'
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'
import { date } from '@/utils/date'
import { index as getList } from '@/api/JobPositions'
import { navigateTo } from '@/utils/nav'
import { getExcerpt } from '@/utils/common'

const props = defineProps({
	categoryId: {
		type: [Number, String],
		default: 3
	},
	emptyText: {
		type: String,
		default: '实训机会'
	}
})
const list = ref([])
const loading = ref(true)
const page = ref(1)
const pageSize = ref(10)
const noMore = ref(false)
const fetchList = (reset = false) => {
	if (reset) {
		page.value = 1
		noMore.value = false
	}

	getList({
		page: page.value,
		pageSize: pageSize.value,
	})
		.then((res) => {
			const data = res.data?.data || []
			if (reset) {
				list.value = [...data]
			} else {
				list.value = [...list.value, ...data]
			}
			if (res.data?.current_page >= res.data?.last_page) {
				noMore.value = true
			}
		})
		.finally(() => {
			loading.value = false
		})
}

const loadMore = () => {
	if (noMore.value || loading.value) return
	page.value++
	fetchList()
}

const handleClick = (item) => {
	navigateTo('/pages/job/detail?id=' + item.id)
}

const refresh = () => {
	fetchList(true)
}

defineExpose({ loadMore, refresh })

onMounted(() => {
	loading.value = false
	fetchList(true)
})
</script>

<style lang="scss" scoped>
.job-list {
	padding: 0 24rpx;
}

.loading-wrap {
	padding: 200rpx 0;

	.loading-text {
		font-size: 28rpx;
		color: var(--text-secondary);
		text-align: center;
		display: block;
	}
}

.list-wrap {
	.job-card {
		background: var(--card-bg);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 24rpx;
		margin-bottom: 20rpx;
		transition: transform 0.2s;

		&:active {
			transform: scale(0.98);
		}

		.card-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 16rpx;

			.job-tags {
				display: flex;
				gap: 12rpx;

				.tag {
					font-size: 22rpx;
					padding: 4rpx 12rpx;
					border-radius: 8rpx;

					&.tag-salary {
						background: rgba(76, 217, 100, 0.15);
						color: #4cd964;
					}

					&.tag-location {
						background: rgba(120, 119, 255, 0.15);
						color: #7877FF;
					}
				}
			}

			.job-date {
				font-size: 22rpx;
				color: var(--text-tertiary);
			}
		}

		.job-title {
			display: block;
			font-size: 30rpx;
			font-weight: 600;
			color: var(--text-primary);
			line-height: 1.4;
			margin-bottom: 12rpx;
		}

		.job-desc {
			display: block;
			font-size: 26rpx;
			color: var(--text-secondary);
			line-height: 1.5;
			margin-bottom: 20rpx;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}

		.card-footer {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-top: 16rpx;
			border-top: 1px solid var(--border-color);

			.company-info {
				display: flex;
				align-items: center;
				gap: 6rpx;
				flex: 1;
				min-width: 0;

				.company-name {
					font-size: 24rpx;
					color: var(--text-tertiary);
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}

			.apply-btn {
				font-size: 26rpx;
				color: #7877FF;
				font-weight: 500;
				flex-shrink: 0;
			}
		}
	}
}

.loading-more,
.no-more {
	padding: 32rpx 0;
	text-align: center;

	.loading-text,
	.no-more-text {
		font-size: 24rpx;
		color: var(--text-tertiary);
	}
}
</style>
