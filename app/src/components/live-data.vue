<template>
	<view class="data-component">
		<!-- 筛选与操作栏 -->
		<view class="action-bar">
			<view class="filter-row">
				<picker class="schedule-picker" :range="scheduleOptions" range-key="label" @change="onScheduleChange">
					<view class="picker-btn">
						<text>{{ scheduleText }}</text>
						<uni-icons type="arrowdown" size="14" color="var(--text-secondary)"></uni-icons>
					</view>
				</picker>
				<text class="count-badge">共 {{ total }} 条</text>
			</view>
			<button class="btn-add" @click="openAdd">+ 新增</button>
		</view>

		<!-- 表格列表（滚动加载） -->
		<scroll-view class="table-scroll" scroll-y @scrolltolower="loadMore">
			<view v-if="loading && list.length === 0" class="table-empty">加载中...</view>
			<view v-else-if="list.length === 0" class="table-empty">暂无数据</view>
			<template v-else>
				<view v-for="item in list" :key="item.id" class="table-row">
					<view class="row-main">
						<text class="cell-title">{{ item.room_title || '-' }}</text>
					</view>
					<view class="row-sub">
						<text class="cell">{{ item.duration_number || 0 }}h</text>
						<text class="cell">¥{{ item.pay_amount || 0 }}</text>
						<text class="cell">{{ item.order_count || 0 }}单</text>
						<text class="cell cell-date">{{ item.start_time ? item.start_time.slice(0, 10) : '-' }}</text>
					</view>
					<view v-if="item.data_images" class="row-imgs">
						<image v-for="(img, idx) in imageList(item.data_images)" :key="idx" :src="img" mode="aspectFill"
							@click="previewImage(img)" />
					</view>
					<view class="row-actions">
						<text class="act-edit" @click="openEdit(item)">编辑</text>
						<text class="act-del" @click="handleDelete(item)">删除</text>
					</view>
				</view>
				<view v-if="loadingMore" class="table-loading">加载更多...</view>
				<view v-if="!hasMore && list.length > 0" class="table-no-more">已加载全部</view>
			</template>
		</scroll-view>

		<!-- 底部弹出表单 -->
		<uni-popup ref="formPopup" type="bottom" background-color="#fff">
			<view class="popup-body">
				<view class="popup-header">
					<text class="popup-title">{{ isEdit ? '编辑直播' : '新增直播' }}</text>
					<text class="popup-close" @click="closeForm">✕</text>
				</view>
				<scroll-view class="popup-content" scroll-y>
					<view class="form-group">
						<text class="form-label">直播主题/房间名 *</text>
						<input class="form-input" v-model="form.room_title" placeholder="请输入直播主题" />
					</view>
					<view class="form-group form-row">
						<view class="form-half">
							<text class="form-label">赛程 *</text>
							<picker :range="scheduleOptions" range-key="label"
								@change="e => form.competition_schedules_id = scheduleOptions[e.detail.value].value">
								<view class="form-picker">{{ scheduleLabel(form.competition_schedules_id) }}</view>
							</picker>
						</view>
						<view class="form-half">
							<text class="form-label">时长(小时)</text>
							<input class="form-input" v-model="form.duration_number" placeholder="0.00" type="digit" />
						</view>
					</view>
					<view class="form-group form-row">
						<view class="form-half">
							<text class="form-label">直播日期</text>
							<picker mode="date" :value="form.start_time ? form.start_time : ''"
								@change="e => form.start_time = e.detail.value">
								<view class="form-picker">{{ form.start_time || '请选择' }}</view>
							</picker>
						</view>
					</view>
					<view class="form-group form-row">
						<view class="form-half">
							<text class="form-label">支付金额</text>
							<input class="form-input" v-model="form.pay_amount" placeholder="0.00" type="digit" />
						</view>
						<view class="form-half">
							<text class="form-label">退款金额</text>
							<input class="form-input" v-model="form.refund_amount" placeholder="0.00" type="digit" />
						</view>
					</view>
					<view class="form-group form-row">
						<view class="form-half">
							<text class="form-label">订单数</text>
							<input class="form-input" v-model.number="form.order_count" placeholder="0" type="number" />
						</view>
						<view class="form-half">
							<text class="form-label">退款订单数</text>
							<input class="form-input" v-model.number="form.refund_count" placeholder="0"
								type="number" />
						</view>
					</view>
					<view class="form-group">
						<text class="form-label">证明图片</text>
						<view class="upload-area" v-if="!form.data_images || form.data_images.length === 0"
							@click="chooseImage">
							<uni-icons type="image" size="36" color="var(--color-primary)"></uni-icons>
							<text class="upload-text">点击上传图片</text>
						</view>
						<view v-if="form.data_images && form.data_images.length > 0" class="upload-preview">
							<view v-for="(img, idx) in imageList(form.data_images)" :key="idx" class="upload-img-item">
								<image :src="img" mode="aspectFill" />
								<text class="img-remove" @click="removeImage(idx)">×</text>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="popup-footer">
					<button class="btn-cancel" @click="closeForm">取消</button>
					<button class="btn-confirm" @click="submitForm">确认{{ isEdit ? '保存' : '添加' }}</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import * as api from '@/api/CompetitionLives'
import { storage } from '@/utils/storage'
import { upload } from '@/api/Upload'
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'
import { date } from '@/utils/date'


const props = defineProps({
	competitionId: {
		type: [String, Number],
		default: ''
	}
})

const list = ref([])
const loading = ref(false)
const loadingMore = ref(false)
const isEdit = ref(false)
const editingId = ref(null)
const page = ref(1)
const lastPage = ref(1)
const total = ref(0)

const scheduleOptions = ref([{ value: '', label: '全部' }])
const scheduleId = ref('')

const formPopup = ref(null)

const defaultForm = {
	room_title: '',
	start_time: date('Y-m-d'),
	end_time: '',
	duration_number: '',
	pay_amount: '',
	refund_amount: '',
	order_count: 0,
	refund_count: 0,
	data_images: [],
	competitions_id: props.competitionId,
	competition_schedules_id: ''
}

const form = ref({ ...defaultForm })

const hasMore = computed(() => page.value < lastPage.value)

const scheduleText = computed(() => {
	return scheduleOptions.value.find(s => s.value == scheduleId.value).label
})

const scheduleLabel = (id) => {
	if (!id) return '请选择'
	const found = scheduleOptions.value.find(s => s.value == id)
	return found ? found.label : '请选择'
}

const imageList = (val) => {
	if (!val) return []
	if (Array.isArray(val)) return val
	if (typeof val === 'string') return val.split(',').filter(Boolean)
	return []
}

const loadSchedules = async () => {
	const raw = storage.get('schedules')
	for (let i = 0; i < raw.scheduler.length; i++) {
		const item = raw.scheduler[i];
		scheduleOptions.value.push({
			value: item.id,
			label: item.name
		})
		if (item.status == 20) {
			defaultForm.competition_schedules_id = item.id
		}
	}
	fetchList(1)
}

const fetchList = async (p = 1) => {
	if (p === 1) {
		loading.value = true
		list.value = []
	} else {
		loadingMore.value = true
	}
	try {
		const params = { competitions_id: props.competitionId, page: p, per_page: 15 }
		if (scheduleId.value) params.competition_schedules_id = scheduleId.value
		const res = await api.index(params)
		const data = res?.data
		if (data) {
			const items = data.data || []
			list.value = p === 1 ? items : [...list.value, ...items]
			page.value = data.current_page || 1
			lastPage.value = data.last_page || 1
			total.value = data.total || 0
		}
	} catch (e) {
		console.error('加载列表失败', e)
	} finally {
		loading.value = false
		loadingMore.value = false
	}
}

const loadMore = () => {
	if (!hasMore.value || loadingMore.value || loading.value) return
	fetchList(page.value + 1)
}

const onScheduleChange = (e) => {
	const idx = e.detail.value
	scheduleId.value = scheduleOptions.value[idx]?.value
	fetchList(1)
}

const chooseImage = () => {
	uni.chooseImage({
		count: 1,
		success: async (res) => {
			uni.showLoading({ title: '上传中...' })
			try {
				const urls = []
				for (const filePath of res.tempFilePaths) {
					const uploadRes = await upload(
						{ filePath },
						{ gateways: 'local' }
					)
					if (uploadRes?.data?.url) urls.push(uploadRes.data.url)
				}
				form.value.data_images = [...(form.value.data_images || []), ...urls]
			} catch (e) {
				uni.showToast({ title: '上传失败', icon: 'none' })
			} finally {
				uni.hideLoading()
			}
		}
	})
}

const removeImage = (idx) => {
	form.value.data_images.splice(idx, 1)
}

const previewImage = (url) => {
	uni.previewImage({ urls: [url], current: url })
}

const openAdd = () => {
	isEdit.value = false
	editingId.value = null
	form.value = { ...defaultForm, competitions_id: props.competitionId }
	formPopup.value.open()
}

const openEdit = (item) => {
	isEdit.value = true
	editingId.value = item.id
	form.value = {
		room_title: item.room_title || '',
		start_time: date('Y-m-d',item.start_time),
		end_time: date('Y-m-d',item.start_time),
		duration_number: item.duration_number != null ? String(item.duration_number) : '',
		pay_amount: item.pay_amount != null ? String(item.pay_amount) : '',
		refund_amount: item.refund_amount != null ? String(item.refund_amount) : '',
		order_count: item.order_count || 0,
		refund_count: item.refund_count || 0,
		data_images: typeof item.data_images === 'string' ? item.data_images.split(',').filter(Boolean) : (item.data_images || []),
		competitions_id: props.competitionId,
		competition_schedules_id: item.competition_schedules_id || ''
	}
	formPopup.value.open()
}

const closeForm = () => { formPopup.value.close() }

const submitForm = async () => {
	try {
		const data = {
			...form.value,
			competitions_id: props.competitionId,
			duration_number: form.value.duration_number ? Number(form.value.duration_number) : 0,
			pay_amount: form.value.pay_amount ? form.value.pay_amount : '0',
			refund_amount: form.value.refund_amount ? form.value.refund_amount : '0',
			order_count: Number(form.value.order_count) || 0,
			refund_count: Number(form.value.refund_count) || 0,
			start_time: form.value.start_time,
			end_time: form.value.start_time,
			data_images: form.value.data_images || []
		}
		if (!data.room_title) {
			uni.showToast({ title: '请输入直播主题', icon: 'none' })
			return
		}
		if (!data.competition_schedules_id) {
			uni.showToast({ title: '请选择赛程', icon: 'none' })
			return
		}
		if (!data.data_images || data.data_images.length === 0) {
			uni.showToast({ title: '请上传证明图片', icon: 'none' })
			return
		}

		if (isEdit.value && editingId.value) {
			await api.update({ id: editingId.value, ...data })
			uni.showToast({ title: '更新成功', icon: 'success' })
		} else {
			await api.add(data)
			uni.showToast({ title: '添加成功', icon: 'success' })
		}
		closeForm()
		fetchList(1)
	} catch (e) {
		uni.showToast({ title: e.message || '操作失败', icon: 'none' })
	}
}

const handleDelete = (item) => {
	uni.showModal({
		title: '确认删除',
		content: `确定删除直播"${item.room_title}"吗？`,
		success: async (res) => {
			if (res.confirm) {
				try {
					await api.remove({ id: item.id })
					uni.showToast({ title: '删除成功', icon: 'success' })
					fetchList(1)
				} catch (e) {
					console.error('删除失败', e)
					uni.showToast({ title: '删除失败', icon: 'none' })
				}
			}
		}
	})
}

onMounted(() => {
	loadSchedules()
	fetchList(1)
})

watch(() => props.competitionId, () => {
	fetchList(1)
	loadSchedules()
})
</script>

<style lang="scss" scoped>
.data-component {
	padding: 0 24rpx;
}

.action-bar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16rpx;

	.filter-row {
		display: flex;
		align-items: center;
		gap: 12rpx;
	}

	.schedule-picker .picker-btn {
		display: flex;
		align-items: center;
		gap: 6rpx;
		padding: 8rpx 18rpx;
		background: var(--card-glass-bg);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-lg);
		font-size: 24rpx;
		color: var(--text-primary);
	}

	.count-badge {
		font-size: 22rpx;
		color: var(--text-tertiary);
	}

	.btn-add {
		flex-shrink: 0;
		height: 56rpx;
		line-height: 56rpx;
		padding: 0 24rpx;
		background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
		color: var(--text-inverse);
		border-radius: 32rpx;
		font-size: 24rpx;
		font-weight: 500;
		border: none;
		margin: 0;

		&::after {
			border: none;
		}
	}
}

.table-scroll {
	height: calc(100vh - 280rpx);
	overflow-y: scroll;

	.table-empty {
		text-align: center;
		padding: 60rpx 0;
		color: var(--text-tertiary);
		font-size: 26rpx;
	}

	.table-row {
		background: var(--card-bg);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		padding: 16rpx 20rpx;
		margin-bottom: 12rpx;

		.row-main {
			margin-bottom: 8rpx;

			.cell-title {
				font-size: 26rpx;
				font-weight: 600;
				color: var(--text-primary);
			}
		}

		.row-sub {
			display: flex;
			align-items: center;
			gap: 16rpx;
			flex-wrap: wrap;

			.cell {
				font-size: 22rpx;
				color: var(--text-secondary);

				&.cell-date {
					color: var(--text-tertiary);
				}
			}
		}

		.row-imgs {
			display: flex;
			gap: 8rpx;
			margin-top: 8rpx;

			image {
				width: 64rpx;
				height: 64rpx;
				border-radius: 8rpx;
				background: var(--card-glass-bg);
			}
		}

		.row-actions {
			display: flex;
			gap: 20rpx;
			margin-top: 10rpx;
			padding-top: 10rpx;
			border-top: 1px solid var(--border-color);

			.act-edit,
			.act-del {
				font-size: 22rpx;
				padding: 4rpx 0;
			}

			.act-edit {
				color: var(--color-primary);
			}

			.act-del {
				color: #c62828;
			}
		}
	}

	.table-loading,
	.table-no-more {
		text-align: center;
		padding: 20rpx 0;
		font-size: 24rpx;
		color: var(--text-tertiary);
	}
}

.popup-body {
	background: var(--card-bg);
	border-radius: 24rpx 24rpx 0 0;
	padding: 0 32rpx;
	max-height: 75vh;
	display: flex;
	flex-direction: column;

	.popup-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 28rpx 0;
		border-bottom: 1px solid var(--border-color);
		flex-shrink: 0;

		.popup-title {
			font-size: 32rpx;
			font-weight: 600;
			color: var(--text-primary);
		}

		.popup-close {
			font-size: 32rpx;
			color: var(--text-tertiary);
			padding: 8rpx;
		}
	}

	.popup-content {
		flex: 1;
		padding: 24rpx 0;
		overflow-y: auto;
	}

	.popup-footer {
		display: flex;
		gap: 20rpx;
		padding: 24rpx 0;
		padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
		flex-shrink: 0;
		border-top: 1px solid var(--border-color);

		.btn-cancel,
		.btn-confirm {
			flex: 1;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			border-radius: 40rpx;
			font-size: 28rpx;
			font-weight: 500;
			border: none;
			margin: 0;

			&::after {
				border: none;
			}
		}

		.btn-cancel {
			background: var(--card-glass-bg);
			color: var(--text-secondary);
			border: 1px solid var(--border-color);
		}

		.btn-confirm {
			background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
			color: var(--text-inverse);
		}
	}
}

.form-group {
	margin-bottom: 24rpx;

	.form-label {
		display: block;
		font-size: 26rpx;
		color: var(--text-secondary);
		margin-bottom: 8rpx;
	}

	.form-input {
		height: 72rpx;
		line-height: 72rpx;
		padding: 0 20rpx;
		background: var(--card-glass-bg);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		font-size: 26rpx;
		color: var(--text-primary);
	}

	.form-picker {
		height: 72rpx;
		line-height: 72rpx;
		padding: 0 20rpx;
		background: var(--card-glass-bg);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		font-size: 26rpx;
		color: var(--text-primary);
	}

	&.form-row {
		display: flex;
		gap: 20rpx;

		.form-half {
			flex: 1;
		}
	}
}

.upload-area {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
	height: 100rpx;
	border: 2rpx dashed var(--color-primary);
	border-radius: var(--radius-sm);
	background: var(--color-primary-muted);

	.upload-text {
		font-size: 24rpx;
		color: var(--color-primary);
	}
}

.upload-preview {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
	margin-top: 12rpx;

	.upload-img-item {
		position: relative;

		image {
			width: 120rpx;
			height: 120rpx;
			border-radius: var(--radius-sm);
			background: var(--card-glass-bg);
		}

		.img-remove {
			position: absolute;
			top: -8rpx;
			right: -8rpx;
			width: 32rpx;
			height: 32rpx;
			line-height: 32rpx;
			text-align: center;
			background: #c62828;
			color: #fff;
			border-radius: 50%;
			font-size: 24rpx;
		}
	}
}
</style>
