<template>
	<view class="enterprise-jobs">
		<view v-if="loading" class="loading-wrap">
			<text class="loading-text">加载中...</text>
		</view>
		<view v-else-if="list.length" class="list-wrap">
			<view
				v-for="item in list"
				:key="item.id"
				class="job-card"
				@click="$emit('click', item)"
			>
				<view class="job-header">
					<text class="job-title">{{ item.title }}</text>
					<text v-if="item.salary" class="job-salary">{{ item.salary }}</text>
				</view>
				<view class="job-meta" @click="handleJobClick(item)">
					<image class="avatar" :src="getUserAvatar(item)" mode="aspectFill" />
					<view class="recruiter-info">
						<text class="recruiter-name">{{ getUserNmae(item) }}</text>
						<text class="recruiter-role">{{ getUserRole(item)}}</text>
					</view>
					<view class="job-location">
						<uni-icons type="location" size="14" color="var(--text-tertiary)"></uni-icons>
						<text class="location-text">{{ item.location || '-' }}</text>
					</view>
				</view>
			</view>
		</view>
		<ListEmpty v-else icon="briefcase" title="暂无机会" description="暂无实习/招聘信息" />
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
import { index as getJobs } from '@/api/JobPositions'

import { navigateTo } from '@/utils/nav'

const props = defineProps({
	enterpriseId: {
		type: [Number, String],
		default: ''
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
	getJobs({
		page: page.value,
		pageSize: pageSize.value,
		enterprises_id: props.enterpriseId
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

const handleJobClick = (item) => {
	navigateTo('/pages/job/detail?id=' + item.id)
}

defineExpose({ loadMore, refresh })

const getUserNmae = (item) => {
	if(item.user){
		const name = item.user.real_name || item.user.nick_name
		const gender = {'0':'**','1':'先生','2':'女士'}
		return name.charAt(0) + gender[item.user.gender];
	}
}
const getUserRole = (item) => {
	if(item.user){
		return item.user.position || 'HR';
	}
	return 'HR';
}
const getUserAvatar = (item) => {
	if(item.user && item.user.avatar_image){
		return item.user.avatar_image
	}
	if(item.enterprises.logo_image){
		return item.enterprises.logo_image
	}
	return '';
}

onMounted(() => {
	loading.value = false
	fetchList(true)
})
</script>

<style lang="scss" scoped>
.enterprise-jobs {
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
		margin-bottom: 16rpx;
		transition: transform 0.2s;

		&:active {
			transform: scale(0.98);
		}

		.job-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 16rpx;

			.job-title {
				flex: 1;
				font-size: 30rpx;
				font-weight: 600;
				color: var(--text-primary);
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				margin-right: 16rpx;
			}

			.job-salary {
				flex-shrink: 0;
				font-size: 26rpx;
				color: #4cd964;
				font-weight: 500;
			}
		}

		.job-meta {
			display: flex;
			align-items: center;
			gap: 12rpx;

			.avatar {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
				flex-shrink: 0;
			}

			.recruiter-info {
				flex: 1;
				min-width: 0;

				.recruiter-name {
					display: block;
					font-size: 26rpx;
					color: var(--text-primary);
					font-weight: 500;
				}

				.recruiter-role {
					display: block;
					font-size: 22rpx;
					color: var(--text-tertiary);
					margin-top: 4rpx;
				}
			}

			.job-location {
				display: flex;
				align-items: center;
				gap: 4rpx;
				flex-shrink: 0;

				.location-text {
					font-size: 22rpx;
					color: var(--text-tertiary);
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
