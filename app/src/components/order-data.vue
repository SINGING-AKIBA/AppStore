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
						<text class="cell-order">{{ item.order_no || '-' }}</text>
						<text :class="'cell-status ' + statusClass(item.status)">{{ statusLabel(item.status) }}</text>
					</view>
					<view class="row-sub">
						<text class="cell">¥{{ item.actual_amount || 0 }}</text>
						<text class="cell">{{ item.product_name || '-' }}</text>
						<text class="cell">{{ item.item_quantity || 0 }}件</text>
						<text class="cell cell-date">{{ item.order_time ? item.order_time.slice(0, 10) : '-' }}</text>
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
					<text class="popup-title">{{ isEdit ? '编辑订单' : '新增订单' }}</text>
					<text class="popup-close" @click="closeForm">✕</text>
				</view>
				<scroll-view class="popup-content" scroll-y>
					<view class="form-group">
						<text class="form-label">订单编号 *</text>
						<input class="form-input" v-model="form.order_no" placeholder="请输入订单编号" />
					</view>
					<view class="form-group form-row">
						<view class="form-half">
							<text class="form-label">订单渠道</text>
							<picker :range="platformOptions" range-key="label" @change="e => form.platform_type = platformOptions[e.detail.value].value">
								<view class="form-picker">{{ platformLabel(form.platform_type) }}</view>
							</picker>
						</view>
						<view class="form-half">
							<text class="form-label">赛程</text>
							<picker :range="scheduleOptions" range-key="label" @change="e => form.competition_schedules_id = scheduleOptions[e.detail.value].value">
								<view class="form-picker">{{ scheduleLabel(form.competition_schedules_id) }}</view>
							</picker>
						</view>
					</view>
					<view class="form-group">
						<text class="form-label">商品名称</text>
						<input class="form-input" v-model="form.product_name" placeholder="请输入商品名称" />
					</view>
					<view class="form-group form-row">
						<view class="form-half">
							<text class="form-label">金额</text>
							<input class="form-input" v-model="form.actual_amount" placeholder="0.00" type="digit" />
						</view>
						<view class="form-half">
							<text class="form-label">退款金额</text>
							<input class="form-input" v-model="form.refund_amount" placeholder="0.00" type="digit" />
						</view>
					</view>
					<view class="form-group form-row">
						<view class="form-half">
							<text class="form-label">下单件数</text>
							<input class="form-input" v-model.number="form.item_quantity" placeholder="0" type="number" />
						</view>
						<view class="form-half">
							<text class="form-label">退款件数</text>
							<input class="form-input" v-model.number="form.refund_count" placeholder="0" type="number" />
						</view>
					</view>
					<view class="form-group form-row">
						<view class="form-half">
							<text class="form-label">订单状态</text>
							<picker :range="orderStatusOptions" range-key="label" @change="e => form.status = orderStatusOptions[e.detail.value].value">
								<view class="form-picker">{{ orderStatusLabel(form.status) }}</view>
							</picker>
						</view>
						<view class="form-half">
							<text class="form-label">下单时间</text>
							<picker mode="date" :value="form.order_time ? form.order_time.split(' ')[0] : ''" @change="e => form.order_time = e.detail.value">
								<view class="form-picker">{{ form.order_time || '请选择日期' }}</view>
							</picker>
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
import * as api from '@/api/CompetitionOrders'
import { storage } from '@/utils/storage'
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

const platformOptions = [
	{ value: 10, label: '抖音订单' },
	{ value: 20, label: '快团团订单' },
	{ value: 30, label: '三创好物订单' },
	{ value: 90, label: '其他平台订单' }
]

const orderStatusOptions = [
	{ value: 10, label: '待支付' },
	{ value: 20, label: '待发货' },
	{ value: 30, label: '待签收' },
	{ value: 40, label: '已完成' },
	{ value: 50, label: '已取消' },
	{ value: 60, label: '已退款' }
]

const defaultForm = {
	order_no: '',
	platform_type: 10,
	product_name: '',
	actual_amount: '',
	refund_amount: '',
	item_quantity: 1,
	refund_count: 0,
	status: 10,
	order_time: date('Y-m-d'),
	competitions_id: props.competitionId,
	competition_schedules_id: ''
}

const form = ref({ ...defaultForm })

const hasMore = computed(() => page.value < lastPage.value)

const scheduleText = computed(() => {
	return scheduleOptions.value.find(s => s.value == scheduleId.value)?.label || '全部'
})

const platformLabel = (val) => {
	const found = platformOptions.find(p => p.value === val)
	return found ? found.label : '请选择'
}

const scheduleLabel = (id) => {
	if (!id) return '请选择'
	const found = scheduleOptions.value.find(s => s.value == id)
	return found ? found.label : '请选择'
}

const statusLabel = (val) => {
	const found = orderStatusOptions.find(s => s.value === val)
	return found ? found.label : '未知'
}

const statusClass = (val) => {
	if (val <= 20) return 'st-warning'
	if (val === 40) return 'st-success'
	if (val >= 50) return 'st-danger'
	return 'st-info'
}

const orderStatusLabel = (val) => {
	const found = orderStatusOptions.find(s => s.value === val)
	return found ? found.label : '待支付'
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
		order_no: item.order_no || '',
		platform_type: item.platform_type || 10,
		product_name: item.product_name || '',
		actual_amount: item.actual_amount != null ? String(item.actual_amount) : '',
		refund_amount: item.refund_amount != null ? String(item.refund_amount) : '',
		item_quantity: item.item_quantity || 0,
		refund_count: item.refund_count || 0,
		status: item.status || 10,
		order_time: date('Y-m-d',item.order_time),
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
			actual_amount: form.value.actual_amount ? Number(form.value.actual_amount) : 0,
			refund_amount: form.value.refund_amount ? Number(form.value.refund_amount) : 0,
			item_quantity: Number(form.value.item_quantity) || 0,
			refund_count: Number(form.value.refund_count) || 0,
			order_time: form.value.order_time || undefined
		}
		if (!data.order_no) {
			uni.showToast({ title: '请输入订单编号', icon: 'none' })
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
		console.error('提交失败', e)
		uni.showToast({ title: '操作失败', icon: 'none' })
	}
}

const handleDelete = (item) => {
	uni.showModal({
		title: '确认删除',
		content: `确定删除订单 ${item.order_no} 吗？`,
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
.data-component { padding: 0 24rpx; }

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
		&::after { border: none; }
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
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 8rpx;

			.cell-order {
				font-size: 26rpx;
				font-weight: 600;
				color: var(--text-primary);
			}

			.cell-status {
				font-size: 20rpx;
				padding: 2rpx 12rpx;
				border-radius: 16rpx;
				&.st-warning { background: #fff3e0; color: #f57c00; }
				&.st-success { background: #e8f5e9; color: #2e7d32; }
				&.st-danger { background: #fbe9e7; color: #c62828; }
				&.st-info { background: #e3f2fd; color: #1565c0; }
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
				&.cell-date { color: var(--text-tertiary); }
			}
		}

		.row-actions {
			display: flex;
			gap: 20rpx;
			margin-top: 10rpx;
			padding-top: 10rpx;
			border-top: 1px solid var(--border-color);

			.act-edit, .act-del {
				font-size: 22rpx;
				padding: 4rpx 0;
			}
			.act-edit { color: var(--color-primary); }
			.act-del { color: #c62828; }
		}
	}

	.table-loading, .table-no-more {
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

		.btn-cancel, .btn-confirm {
			flex: 1;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			border-radius: 40rpx;
			font-size: 28rpx;
			font-weight: 500;
			border: none;
			margin: 0;

			&::after { border: none; }
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
		.form-half { flex: 1; }
	}
}
</style>
