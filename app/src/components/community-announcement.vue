<template>
	<view class="announcement-list">
		<view v-if="loading && list.length === 0" class="loading-wrap">
			<text class="loading-text">加载中...</text>
		</view>
		<view v-else-if="list.length" class="list-wrap">
			<view
				v-for="item in list"
				:key="item.id"
				class="announcement-card"
				@click="handleClick(item)"
			>
				<image v-if="item.cover_image" class="card-cover" :src="item.cover_image" mode="aspectFill" />
				<view class="card-body">
					<text class="card-title">{{ item.title }}</text>
					<text class="card-desc">{{ getExcerpt(item.content,30)}}</text>
					<text class="card-date">{{ date("Y-m-d", item.publish_datetime || item.create_time) }}</text>
				</view>
			</view>
		</view>
		<ListEmpty v-else icon="notification" :title="emptyText" :description="'暂无' + emptyText" />
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
import { date } from '@/utils/date'
import { index as getList } from '@/api/Announcements'
import { navigateTo } from '@/utils/nav'
import { getExcerpt } from '@/utils/common'

const props = defineProps({
	categoryId: {
		type: [Number, String],
		default: 2
	},
	emptyText: {	
		type: String,
		default: '公告'
	}
})

defineEmits(['click'])

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
		announcement_categories_id: props.categoryId
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
		.catch(() => {
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
	navigateTo(`/pages/notify/detail?id=${item.id}`)
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
.announcement-list {
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
	.announcement-card {
		background: var(--card-bg);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		margin-bottom: 20rpx;
		overflow: hidden;
		transition: transform 0.2s;

		&:active {
			transform: scale(0.98);
		}

		.card-cover {
			width: 100%;
			height: 320rpx;
		}

		.card-body {
			padding: 24rpx;

			.card-title {
				display: block;
				font-size: 30rpx;
				font-weight: 600;
				color: var(--text-primary);
				line-height: 1.4;
				margin-bottom: 12rpx;
			}

			.card-desc {
				display: block;
				font-size: 26rpx;
				color: var(--text-secondary);
				line-height: 1.5;
				margin-bottom: 16rpx;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				overflow: hidden;
			}

			.card-date {
				font-size: 24rpx;
				color: var(--text-tertiary);
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
