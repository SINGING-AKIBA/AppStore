<template>
	<view class="theme-popup">
		<view class="popup-header">
			<text class="popup-title">选择主题</text>
			<view class="popup-close" @click="handleClose">
				<uni-icons type="close" size="20" color="var(--text-tertiary)"></uni-icons>
			</view>
		</view>
		<view class="theme-list">
			<view
				class="theme-option"
				v-for="item in themeOptions"
				:key="item.value"
				:class="{ active: currentTheme === item.value }"
				@click="handleThemeChange(item.value)"
			>
				<view class="theme-preview" :class="item.previewClass">
					<view class="preview-swatch"></view>
					<view class="preview-swatch"></view>
					<view class="preview-check" v-if="currentTheme === item.value">
						<uni-icons type="checkmarkempty" size="24" color="#FFFFFF"></uni-icons>
					</view>
				</view>
				<view class="theme-info">
					<text class="theme-label">{{ item.label }}</text>
					<text class="theme-desc">{{ item.desc }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/smile/store/theme'
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'

const emit = defineEmits(['change', 'close'])

const themeStore = useThemeStore()
const currentTheme = computed(() => themeStore.currentTheme)

const themeOptions = [
	{ value: 'dark', label: '深空紫', desc: '深邃星空', previewClass: 'preview-dark' },
	{ value: 'light', label: '清新蓝白', desc: '明亮简洁', previewClass: 'preview-light' },
	{ value: 'skeuomorphic', label: '拟物化', desc: '温暖纸张', previewClass: 'preview-skeuomorphic' },
	{ value: 'professional', label: '专业灰', desc: '商务质感', previewClass: 'preview-professional' },
]

const themeLabels = {
	dark: '深空紫',
	light: '清新蓝白',
	skeuomorphic: '拟物化',
	professional: '专业灰',
}

const handleThemeChange = (theme) => {
	themeStore.setTheme(theme)
	emit('change', theme)
}

const handleClose = () => {
	emit('close')
}

defineExpose({ themeLabels })
</script>

<style lang="scss" scoped>
.theme-popup {
	background: var(--popup-bg);
	border-radius: 32rpx 32rpx 0 0;
	padding: 32rpx;
	max-height: 68vh;
	position: relative;

	&::before {
		content: "";
		position: absolute;
		top: 12rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 56rpx;
		height: 6rpx;
		background: var(--border-color);
		border-radius: 3rpx;
	}

	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 20rpx;
		margin-bottom: 32rpx;
		padding: 0 4rpx;

		.popup-title {
			font-size: 34rpx;
			font-weight: 700;
			color: var(--text-primary);
			letter-spacing: 1rpx;
		}

		.popup-close {
			width: 56rpx;
			height: 56rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			background: var(--card-bg);
			border-radius: var(--radius-full);
		}
	}

	.theme-list {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16rpx;

		.theme-option {
			display: flex;
			flex-direction: column;
			padding: 0;
			background: var(--card-bg);
			border-radius: var(--radius-md);
			border: 2rpx solid var(--border-color);
			overflow: hidden;
			transition: all 0.25s ease;

			&.active {
				border-color: var(--color-primary);
				box-shadow: 0 0 0 2rpx var(--color-primary-light);
			}

			&:active {
				transform: scale(0.97);
				opacity: 0.85;
			}

			.theme-preview {
				position: relative;
				width: 100%;
				height: 96rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 12rpx;
				padding: 16rpx;

				.preview-swatch {
					width: 48rpx;
					height: 48rpx;
					border-radius: 10rpx;
					box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
				}

				.preview-check {
					position: absolute;
					top: 8rpx;
					right: 8rpx;
					width: 36rpx;
					height: 36rpx;
					border-radius: var(--radius-full);
					background: var(--color-primary);
					display: flex;
					align-items: center;
					justify-content: center;
				}

				&.preview-dark {
					background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);

					.preview-swatch:nth-child(1) {
						background: #7877FF;
					}

					.preview-swatch:nth-child(2) {
						background: #4ECDC4;
					}
				}

				&.preview-light {
					background: linear-gradient(135deg, #ffffff 0%, #f2f4f7 50%, #e8edf2 100%);

					.preview-swatch:nth-child(1) {
						background: #007AFF;
					}

					.preview-swatch:nth-child(2) {
						background: #34C759;
					}
				}

				&.preview-skeuomorphic {
					background: linear-gradient(135deg, #fdf6ec 0%, #f5e6d3 50%, #e8d5c4 100%);

					.preview-swatch:nth-child(1) {
						background: #8B4513;
					}

					.preview-swatch:nth-child(2) {
						background: #CD853F;
					}
				}

				&.preview-professional {
					background: linear-gradient(135deg, #1a1d21 0%, #21262d 50%, #16191c 100%);

					.preview-swatch:nth-child(1) {
						background: #58A6FF;
					}

					.preview-swatch:nth-child(2) {
						background: #3FB950;
					}
				}
			}

			.theme-info {
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 16rpx 12rpx 18rpx;
				gap: 4rpx;

				.theme-label {
					font-size: 26rpx;
					color: var(--text-primary);
					font-weight: 600;
					line-height: 1.4;
				}

				.theme-desc {
					font-size: 20rpx;
					color: var(--text-tertiary);
					line-height: 1.3;
				}
			}
		}
	}
}
</style>