<template>
	<view class="match-tabs">
		<scroll-view 
			class="tabs-scroll" 
			scroll-x 
			:show-scrollbar="false"
			:scroll-into-view="scrollIntoView"
			scroll-with-animation
		>
			<view class="tabs-wrapper">
				<view
					v-for="(tab, index) in list"
					:key="index"
					:id="'tab-' + index"
					class="tab-item"
					:class="{ active: modelValue === index }"
					@click="handleChange(tab,index)"
				>
					<text class="tab-text">{{ tab.label }}</text>
					<view v-if="modelValue === index" class="tab-indicator"></view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
	list: {
		type: Array,
		default: () => []
	},
	modelValue: {
		type: Number,
		default: 0
	}
})

const emit = defineEmits(['update:modelValue', 'change'])

const scrollIntoView = ref('')

watch(() => props.modelValue, (newVal) => {
	scrollIntoView.value = 'tab-' + newVal
})

const handleChange = (item, index) => {
	emit('update:modelValue', index)
	emit('change', item)
}
</script>

<style lang="scss" scoped>
.match-tabs {
	padding: 24rpx 24rpx 0;

	.tabs-scroll {
		white-space: nowrap;

		.tabs-wrapper {
			display: inline-flex;
			gap: 16rpx;
			padding-bottom: 40rpx;

			.tab-item {
				flex-shrink: 0;
				padding: 16rpx 32rpx;
				border-radius: var(--radius-xl);
				background: var(--card-glass-bg);
				border: 1px solid var(--border-color);
				position: relative;
				transition: all 0.3s ease;

				.tab-text {
					font-size: 26rpx;
					color: var(--text-secondary);
					transition: color 0.3s ease;
				}

				.tab-indicator {
					position: absolute;
					bottom: 8rpx;
					left: 50%;
					transform: translateX(-50%);
					width: 32rpx;
					height: 4rpx;
					border-radius: 2rpx;
					background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
				}

				&.active {
					background: linear-gradient(135deg, var(--color-primary-light), var(--color-accent-light));
					border-color: var(--color-primary);

					.tab-text {
						color: var(--text-primary);
						font-weight: 600;
					}
				}
			}
		}
	}
}
</style>
