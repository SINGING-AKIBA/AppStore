<template>
	<view class="course-list">
		<view class="course-grid">
			<view
				v-for="(item, index) in list"
				:key="index"
				class="course-card"
				@click="handleClick(item)"
			>
				<image class="course-cover" :src="item.cover_image" mode="aspectFill" />
				<view class="course-info">
					<text class="course-title">{{ item.title }}</text>
					<view class="course-desc">{{ item.intro_desc }}</view>
					<view class="course-meta">
						<view class="meta-left">
							<text class="meta-tag" :class="'tag-' + item.level">{{ levelTest[item.level] }}</text>
							<text class="meta-students">{{ item.enrollment_number }}人在学</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
const props = defineProps({
	list: {
		type: Array,
		default: () => []
	}
})

const levelTest = {
	1: '入门',
	2: '中级',
	3: '高级',
	4: "专家"
}

const emit = defineEmits(['click', 'more'])

const handleClick = (item) => {
	emit('click', item)
}

</script>

<style lang="scss" scoped>
.course-list {
	padding: 0 24rpx 32rpx;
	.course-grid {
		display: flex;
		flex-direction: column;
		gap: 20rpx;

		.course-card {
			background: var(--card-glass-bg);
			border: 1px solid var(--border-color);
			border-radius: var(--radius-md);
			overflow: hidden;
			backdrop-filter: blur(var(--card-glass-blur));

			.course-cover {
				width: 100%;
				height: 280rpx;
			}

			.course-info {
				padding: 24rpx;

				.course-title {
					display: block;
					font-size: 30rpx;
					font-weight: 600;
					color: var(--text-primary);
					margin-bottom: 12rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.course-desc {
					font-size: 24rpx;
					color: var(--text-secondary);
					margin-bottom: 16rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.course-meta {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 16rpx;

					.meta-left {
						display: flex;
						align-items: center;
						gap: 12rpx;

						.meta-tag {
							padding: 4rpx 12rpx;
							border-radius: 8rpx;
							font-size: 20rpx;
							font-weight: 500;

							&.tag-1 {
		background: var(--color-secondary-hover);
				color: var(--color-secondary);
			}

			.difficulty-middle {
				background: var(--color-primary-hover);
				color: var(--color-primary);
			}

			.difficulty-hard {
				background: var(--color-accent-hover);
				color: var(--color-accent);
			}

			.difficulty-all {
				background: var(--color-orange-light);
				color: var(--color-orange);
							}
						}

						.meta-students {
							font-size: 22rpx;
							color: var(--text-tertiary);
						}
					}

					.meta-progress {
						font-size: 22rpx;
						color: var(--color-primary);
						font-weight: 600;
					}
				}

				.progress-bar {
					height: 6rpx;
		background: var(--card-bg-hover);
			border-radius: var(--radius-xs);
					overflow: hidden;

					.progress-fill {
						height: 100%;
		background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
			border-radius: var(--radius-xs);
						transition: width 0.3s ease;
					}
				}
			}
		}
	}
}
</style>
