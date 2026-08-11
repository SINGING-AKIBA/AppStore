<template>
	<view class="enterprise-info">
		<view class="info-section">
			<text class="section-label">登记信息</text>
			<view class="info-grid">
				<view class="info-item">
					<text class="info-label">法定代表人</text>
					<text class="info-value">{{ data.legal_person || '-' }}</text>
				</view>
				<view class="info-item">
					<text class="info-label">注册资本</text>
					<text class="info-value">{{ data.registered_capital || '-' }}</text>
				</view>
				<view class="info-item">
					<text class="info-label">经营状态</text>
					<text class="info-value">{{ data.operating_status || '-' }}</text>
				</view>
				<view class="info-item">
					<text class="info-label">成立日期</text>
					<text class="info-value">{{ data.registration_date || '-' }}</text>
				</view>
				<view class="info-item">
					<text class="info-label">企业类型</text>
					<text class="info-value">{{ data.enterprise_type || '-' }}</text>
				</view>
				<view class="info-item">
					<text class="info-label">所属行业</text>
					<text class="info-value">{{ data.reg_industry || '-' }}</text>
				</view>
				<view class="info-item">
					<text class="info-label">所属地区</text>
					<text class="info-value">{{ data.province }} {{ data.city }}</text>
				</view>
				<view class="info-item">
					<text class="info-label">统一社会信用代码</text>
					<text class="info-value info-value-copy">{{ data.credit_code || '-' }}</text>
				</view>
				<view class="info-item">
					<text class="info-label">工商注册号</text>
					<text class="info-value info-value-copy">{{ data.registration_no || '-' }}</text>
				</view>
				<view class="info-item">
					<text class="info-label">核准日期</text>
					<text class="info-value">{{ data.approval_date || '-' }}</text>
				</view>
				<view class="info-item">
					<text class="info-label">登记机关</text>
					<text class="info-value">{{ data.registration_authority || '-' }}</text>
				</view>
				<view class="info-item">
					<text class="info-label">注册地址</text>
					<text class="info-value">{{ data.registered_address || '-' }}</text>
				</view>
				<view class="info-item full-width">
					<text class="info-label">经营范围</text>
					<text class="info-value">{{ data.business_scope || '-' }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
const props = defineProps({
	data: {
		type: Object,
		default: () => ({})
	}
})
</script>

<style lang="scss" scoped>
.enterprise-info {
	padding: 24rpx;

	.info-section {
		.section-label {
			display: block;
			font-size: 28rpx;
			font-weight: 600;
			color: var(--text-primary);
			margin-bottom: 20rpx;
		}

		.info-grid {
			background: var(--card-bg);
			border: 1px solid var(--border-color);
			border-radius: var(--radius-md);
			padding: 24rpx;
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 32rpx;

			.info-item {
				.info-label {
					display: block;
					font-size: 22rpx;
					color: var(--text-tertiary);
					margin-bottom: 8rpx;
				}

				.info-value {
					display: block;
					font-size: 26rpx;
					color: var(--text-primary);
					line-height: 1.4;
					word-break: break-all;
				}

				.info-value-copy {
					word-break: break-all;
					overflow-wrap: break-word;
				}

				&.full-width {
					grid-column: 1 / -1;
				}
			}
		}
	}
}
</style>
