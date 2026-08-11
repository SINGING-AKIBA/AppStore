<template>
	<view class="enterprise-list">
		<view v-if="loading && list.length === 0" class="loading-wrap">
			<text class="loading-text">加载中...</text>
		</view>
		<view v-if="list.length" class="list-wrap">
			<view class="column">
				<view v-for="item in leftColumn" :key="item.id" class="enterprise-card" @click="handleClick(item)">
					<image v-if="item.cover_image" class="card-cover" :src="item.cover_image" mode="widthFix" />
					<view class="card-body">
						<text class="card-title">{{ item.name }}</text>
						<view class="card-footer">
							<view class="company-info">
								<uni-icons type="location" size="16" color="var(--text-tertiary)"></uni-icons>
								<text class="company-name">{{ item.registered_address }}</text>
							</view>
							<view class="like-info">
								<uni-icons type="heart" size="16" color="var(--text-tertiary)"></uni-icons>
								<text class="like-count">{{ item.like_count || 138 }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="column">
				<view v-for="item in rightColumn" :key="item.id" class="enterprise-card" @click="handleClick(item)">
					<image v-if="item.cover_image" class="card-cover" :src="item.cover_image" mode="widthFix" />
					<view class="card-body">
						<text class="card-title">{{ item.name }}</text>
						<view class="card-footer">
							<view class="company-info">
								<uni-icons type="person" size="16" color="var(--text-tertiary)"></uni-icons>
								<text class="company-name">{{ item.registered_address }}</text>
							</view>
							<view class="like-info">
								<uni-icons type="heart" size="16" color="var(--text-tertiary)"></uni-icons>
								<text class="like-count">{{ item.like_count || 138 }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<ListEmpty v-if="!loading && list.length === 0" icon="shop" :title="emptyText"
			:description="'暂无' + emptyText" />
		<view v-if="loading && list.length" class="loading-more">
			<text class="loading-text">加载中...</text>
		</view>
		<view v-if="noMore && list.length" class="no-more">
			<text class="no-more-text">— 没有更多了 —</text>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ListEmpty from '@/components/list-empty.vue'
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'
import { index as getList } from '@/api/Enterprises'
import { navigateTo } from '@/utils/nav'

const props = defineProps({
	categoryId: {
		type: [Number, String],
		default: 2
	},
	emptyText: {
		type: String,
		default: '企业'
	}
})

defineEmits(['click'])

const list = ref([])
const loading = ref(true)
const page = ref(1)
const pageSize = ref(10)
const noMore = ref(false)

// 双列瀑布流：根据卡片估算高度分配到总高更矮的列
const columnWidth = 343 // rpx，两列布局下每列近似宽度

function estimateItemHeight(item) {
	// 卡片内容区固定高度：padding(32) + title(~40) + margin-bottom(12) + footer(~22) ≈ 106
	const bodyHeight = 120
	if (!item.cover_image) return bodyHeight

	let aspectRatio = 1
	// 尝试从 picsum 风格的 URL 提取宽高: .../width/height
	const match = item.cover_image.match(/\/(\d+)\/(\d+)\/?$/)
	if (match) {
		const w = parseInt(match[1])
		const h = parseInt(match[2])
		if (w > 0) aspectRatio = h / w
	}

	return columnWidth * aspectRatio + bodyHeight
}

const columns = computed(() => {
	const left = []
	const right = []
	let leftHeight = 0
	let rightHeight = 0

	for (const item of list.value) {
		const height = estimateItemHeight(item)
		if (leftHeight <= rightHeight) {
			left.push(item)
			leftHeight += height
		} else {
			right.push(item)
			rightHeight += height
		}
	}

	return { left, right }
})

const leftColumn = computed(() => columns.value.left)
const rightColumn = computed(() => columns.value.right)

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

const refresh = () => {
	fetchList(true)
}
const handleClick = (item) => {
	navigateTo('/pages/enterprise/detail?id=' + item.id)
}

defineExpose({ loadMore, refresh })

onMounted(() => {
	loading.value = false
	fetchList(true)
})
</script>

<style lang="scss" scoped>
.enterprise-list {
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
	box-sizing: border-box;
	overflow: hidden;
	display: flex;

	.column {
		width: 50%;
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 16rpx;
	}

	.column:first-child {
		padding-right: 8rpx;
	}

	.column:last-child {
		padding-left: 8rpx;
	}

	.enterprise-card {
		background: var(--card-bg);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		overflow: hidden;
		transition: transform 0.2s;

		&:active {
			transform: scale(0.98);
		}

		.card-cover {
			width: 100%;
			display: block;
		}

		.card-body {
			padding: 16rpx;

			.card-title {
				display: block;
				font-size: 28rpx;
				font-weight: 600;
				color: var(--text-primary);
				line-height: 1.4;
				margin-bottom: 12rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.card-footer {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.company-info {
					display: flex;
					align-items: center;
					gap: 6rpx;
					flex: 1;
					min-width: 0;

					.company-name {
						font-size: 22rpx;
						color: var(--text-tertiary);
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}

				.like-info {
					display: flex;
					align-items: center;
					gap: 4rpx;
					flex-shrink: 0;

					.like-count {
						font-size: 22rpx;
						color: var(--text-tertiary);
					}
				}
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
