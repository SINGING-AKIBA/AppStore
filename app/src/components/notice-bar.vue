<template>
	<view v-if="list.length" class="notice-bar" @click="handleClick">
		<view class="notice-icon">
			<uni-icons type="notification-filled" size="16" color="#FF6B35"></uni-icons>
		</view>
		<view class="notice-content">
			<swiper
				:autoplay="true"
				:interval="3000"
				:duration="300"
				:vertical="true"
				:circular="true"
				:disable-touch="true"
				class="notice-swiper"
			>
				<swiper-item v-for="item in list" :key="item.id" class="notice-swiper-item">
					<text class="notice-text">{{ item.title }}</text>
				</swiper-item>
			</swiper>
		</view>
		<view class="notice-arrow">
			<uni-icons type="right" size="14" color="var(--text-tertiary)"></uni-icons>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { index as getAnnouncements } from '@/api/Announcements'
import { navigateTo } from '@/utils/nav'
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'

const props = defineProps({
	data: {
		type: Array,
		default: () => []
	}
})

const emit = defineEmits(['click'])

const list = ref([])
const currentIdx = ref(0)

onMounted(() => {
	if (props.data && props.data.length) {
		list.value = props.data
	} else {
		fetchList()
	}
})

const fetchList = async () => {
	try {
		const res = await getAnnouncements({ page: 1, pageSize: 10,announcement_categories_id: 1 })
		list.value = res.data?.data || []
	} catch {
		// ignore
	}
}

const handleClick = () => {
	const item = list.value[currentIdx.value] || list.value[0]
	if (item?.id) {
		navigateTo('/pages/notify/detail?id=' + item.id)
	}
	emit('click', item)
}
</script>

<style lang="scss" scoped>
.notice-bar {
	display: flex;
	align-items: center;
	background: var(--card-glass-bg);
	border: 1px solid var(--border-color);
	border-radius: var(--radius-sm);
	padding: 16rpx 20rpx;
	margin: 0 24rpx 0rpx;
	gap: 12rpx;

	.notice-icon {
		flex-shrink: 0;
		width: 40rpx;
		height: 40rpx;
		background: rgba(255, 107, 53, 0.12);
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.notice-content {
		flex: 1;
		min-width: 0;
		height: 36rpx;
		overflow: hidden;

		.notice-swiper {
			height: 36rpx;

			.notice-swiper-item {
				height: 36rpx;
				display: flex;
				align-items: center;
			}

			.notice-text {
				font-size: 24rpx;
				color: var(--text-secondary);
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				display: block;
				width: 100%;
			}
		}
	}

	.notice-arrow {
		flex-shrink: 0;
		display: flex;
		align-items: center;
	}
}
</style>