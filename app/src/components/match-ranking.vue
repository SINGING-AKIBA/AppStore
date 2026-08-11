<template>
	<view class="match-ranking">
		<view class="ranking-list">
			<view
				v-for="(item, index) in list"
				:key="item.id"
				class="ranking-item"
				:class="{ top3: index < 3 }"
			>
				<view class="ranking-rank" :class="'rank-' + (index + 1)">
					<text class="rank-num">{{ item.rank_number }}</text>
				</view>
				<view class="ranking-info">
					<view class="ranking-team">
						<text class="team-name">{{ maskTeam(item.name) }}</text>
						<text class="team-id">(ID: {{ maskId(item.official) }})</text>
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

const maskName = (name) => {
	if (!name) return ''
	if (name.length <= 2) return name.charAt(0) + '*'
	return name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1)
}

const maskId = (id) => {
	if (!id) return ''
	const str = String(id)
	if (str.length <= 2) return str
	return str.slice(0,2) + '*'.repeat(8) + str.charAt(str.length-1)
}

const maskTeam = (name) => {
	if (!name) return ''
	if (name.length <= 2) return name.charAt(0) + '*'
	return name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1)
}
</script>

<style lang="scss" scoped>
.match-ranking {
	margin-bottom: 32rpx;

	.ranking-list {
		background: var(--card-glass-bg);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 8rpx 24rpx;
	}

	.ranking-item {
		display: flex;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);

		&:last-child {
			border-bottom: none;
		}

		&.top3 {
			.ranking-rank {
				&.rank-1 {
					background: linear-gradient(135deg, #ffd700, #ffb800);
					color: #8B4513;
				}
				&.rank-2 {
					background: linear-gradient(135deg, #c0c0c0, #a9a9a9);
					color: #4a4a4a;
				}
				&.rank-3 {
					background: linear-gradient(135deg, #cd7f32, #b87333);
					color: #5c3a1e;
				}
			}
		}

		.ranking-rank {
			flex-shrink: 0;
			width: 56rpx;
			height: 56rpx;
			border-radius: 28rpx;
			background: rgba(255, 255, 255, 0.1);
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 20rpx;

			.rank-num {
				font-size: 28rpx;
				font-weight: 700;
				color: var(--text-secondary);
			}
		}

		.ranking-info {
			flex: 1;
			min-width: 0;

			.ranking-team {
				display: flex;
				align-items: center;

				.team-name {
					font-size: 28rpx;
					font-weight: 600;
					color: var(--text-primary);
				}

				.team-id {
					font-size: 22rpx;
					color: var(--text-secondary);
					margin-left: 12rpx;
				}
			}
		}
	}
}
</style>