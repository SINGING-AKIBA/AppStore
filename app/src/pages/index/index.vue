<template>
	<view class="app-list-page">
		<view class="status-bar" />

		<header class="list-hero">
			<view class="hero-orb hero-orb-one" />
			<view class="hero-orb hero-orb-two" />
			<view class="hero-brand">
				<view class="brand-mark">✦</view>
				<text class="brand-name">APP STORE</text>
				<text class="brand-caption">CURATED APPS</text>
			</view>
			<text class="page-title">{{ t('apps.title') }}</text>
			<text class="page-subtitle">{{ t('apps.subtitle') }}</text>

			<view class="search-box">
				<text class="search-symbol">⌕</text>
				<input
					class="search-input"
					:value="keyword"
					:placeholder="t('apps.search')"
					confirm-type="search"
					@input="handleSearchInput"
				/>
				<view v-if="keyword" class="search-clear" @click="keyword = ''">
					<text>×</text>
				</view>
			</view>

			<view class="list-overview">
				<text class="result-count">{{ t('apps.count', { count: filteredApps.length }) }}</text>
				<view class="overview-dot" />
				<text class="overview-caption">{{ t('apps.subtitleShort') }}</text>
			</view>
		</header>

		<view class="list-content">
			<view v-if="loading && !apps.length" class="skeleton-list">
				<view v-for="item in 3" :key="item" class="skeleton-card">
					<view class="skeleton-icon" />
					<view class="skeleton-copy">
						<view class="skeleton-line title" />
						<view class="skeleton-line medium" />
						<view class="skeleton-line short" />
					</view>
				</view>
			</view>

			<template v-else-if="filteredApps.length">
				<view
					v-for="app in filteredApps"
					:key="app.id || app.app_key"
					class="app-card"
					@click="openApp(app)"
				>
					<view class="app-icon-frame">
						<image v-if="app.icon" class="app-icon" :src="app.icon" mode="aspectFill" />
						<view v-else class="app-icon-fallback">
							<text>{{ appInitial(app.name) }}</text>
						</view>
					</view>

					<view class="app-card-body">
						<view class="app-card-heading">
							<text class="app-name">{{ app.name }}</text>
							<view class="app-open"><text>›</text></view>
						</view>
						<text class="app-tagline">{{ app.subtitle || app.company || t('apps.defaultTagline') }}</text>
						<text v-if="app.description" class="app-description">{{ app.description }}</text>

						<view class="app-card-footer">
							<view class="app-category">
								<text>{{ app.category || t('apps.categoryFallback') }}</text>
							</view>
							<view
								v-if="app.rating !== undefined && app.rating !== null && app.rating !== ''"
								class="app-rating"
							>
								<text class="rating-star">★</text>
								<text class="rating-value">{{ ratingLabel(app.rating) }}</text>
								<text v-if="Number(app.rating_count) > 0" class="rating-count">({{ app.rating_count }})</text>
							</view>
						</view>
					</view>
				</view>
			</template>

			<view v-else class="empty-state">
				<view class="empty-icon"><text>⌕</text></view>
				<text class="empty-title">
					{{ loadError ? t('apps.errorTitle') : keyword ? t('apps.noResultsTitle') : t('apps.emptyTitle') }}
				</text>
				<text class="empty-desc">
					{{ loadError ? t('apps.errorDesc') : keyword ? t('apps.noResultsDesc') : t('apps.emptyDesc') }}
				</text>
				<view class="empty-retry" @click="loadApps(true)">
					<text>{{ t('apps.retry') }}</text>
				</view>
			</view>

			<view v-if="apps.length && !keyword" class="list-footer">
				<text v-if="loadingMore">{{ t('apps.loadingMore') }}</text>
				<text v-else-if="hasMore" @click="loadApps(false)">{{ t('apps.loadMore') }}</text>
				<text v-else>{{ t('apps.allLoaded') }}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { list as getApps } from '@/api/Apps'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const PAGE_SIZE = 20

const loading = ref(false)
const loadingMore = ref(false)
const loadError = ref(false)
const keyword = ref('')
const apps = ref([])
const currentPage = ref(0)
const lastPage = ref(1)

const hasMore = computed(() => currentPage.value < lastPage.value)
const filteredApps = computed(() => {
	const search = keyword.value.trim().toLocaleLowerCase()
	if (!search) return apps.value

	return apps.value.filter((app) => {
		const fields = [app.name, app.subtitle, app.company, app.category, app.description]
		return fields.some((value) => String(value || '').toLocaleLowerCase().includes(search))
	})
})

function handleSearchInput(event) {
	keyword.value = event?.detail?.value ?? ''
}

function appInitial(name) {
	const value = String(name || 'A').trim()
	return value ? value.charAt(0).toUpperCase() : 'A'
}

function ratingLabel(rating) {
	const value = Number(rating)
	return Number.isFinite(value) ? value.toFixed(1) : '—'
}

function openApp(app) {
	if (!app?.id) return
	uni.navigateTo({
		url: '/pages/detail/index?id=' + encodeURIComponent(app.id),
	})
}

async function loadApps(reset = false) {
	if (reset) {
		loading.value = true
		loadError.value = false
	} else {
		if (loading.value || loadingMore.value || !hasMore.value) return
		loadingMore.value = true
	}

	const nextPage = reset ? 1 : currentPage.value + 1
	try {
		const response = await getApps({ page: nextPage, pageSize: PAGE_SIZE })
		const result = response?.data || {}
		const records = Array.isArray(result.data) ? result.data : []

		apps.value = reset ? records : apps.value.concat(records)
		currentPage.value = Number(result.current_page) || nextPage
		lastPage.value = Number(result.last_page) || currentPage.value
		loadError.value = false
	} catch (err) {
		console.warn('[App Store] 加载应用列表失败:', err)
		if (reset && !apps.value.length) loadError.value = true
		uni.showToast({ title: t('apps.loadFailed'), icon: 'none' })
	} finally {
		loading.value = false
		loadingMore.value = false
		uni.stopPullDownRefresh()
	}
}

onLoad((options) => {
	// 兼容旧版分享链接：原首页带 id 时仍然直达对应应用详情
	if (options?.id) {
		uni.redirectTo({
			url: '/pages/detail/index?id=' + encodeURIComponent(options.id),
		})
		return
	}
	loadApps(true)
})

onPullDownRefresh(() => loadApps(true))
onReachBottom(() => loadApps(false))
</script>

<style lang="scss" scoped>
.app-list-page {
	min-height: 100vh;
	padding-bottom: calc(28px + env(safe-area-inset-bottom, 0px));
	background: #f4f7fc;
	color: #1d2b42;
	font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
}

.status-bar {
	height: var(--status-bar-height, 44px);
	background: #172d50;
}

.list-hero {
	position: relative;
	overflow: hidden;
	padding: 8px 22px 26px;
	border-radius: 0 0 30px 30px;
	background: linear-gradient(135deg, #14284b 0%, #244b7d 58%, #3974ad 100%);
	color: #fff;
}

.hero-orb {
	position: absolute;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.06);
	pointer-events: none;
}

.hero-orb-one {
	width: 250px;
	height: 250px;
	top: -110px;
	right: -80px;
}

.hero-orb-two {
	width: 170px;
	height: 170px;
	bottom: -100px;
	left: 40px;
}

.hero-brand {
	position: relative;
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 24px;
}

.brand-mark {
	width: 28px;
	height: 28px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 9px;
	background: linear-gradient(135deg, #7bb8ff, #3977c2);
	box-shadow: 0 5px 14px rgba(0, 0, 0, 0.18);
	font-size: 16px;
	color: #fff;
}

.brand-name {
	font-size: 12px;
	font-weight: 700;
	letter-spacing: 1.8px;
}

.brand-caption {
	margin-left: auto;
	padding: 5px 9px;
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 999px;
	color: rgba(255, 255, 255, 0.72);
	font-size: 9px;
	letter-spacing: 1.2px;
}

.page-title {
	display: block;
	position: relative;
	font-size: 30px;
	font-weight: 750;
	line-height: 1.2;
	letter-spacing: -0.8px;
}

.page-subtitle {
	display: block;
	position: relative;
	margin-top: 8px;
	color: rgba(255, 255, 255, 0.72);
	font-size: 13px;
	line-height: 1.6;
}

.search-box {
	display: flex;
	align-items: center;
	gap: 10px;
	height: 50px;
	margin-top: 22px;
	padding: 0 14px;
	border-radius: 16px;
	background: rgba(255, 255, 255, 0.97);
	box-shadow: 0 8px 22px rgba(9, 26, 52, 0.16);
}

.search-symbol {
	color: #718198;
	font-size: 26px;
	line-height: 1;
}

.search-input {
	flex: 1;
	height: 100%;
	color: #1d2b42;
	font-size: 14px;
}

.search-clear {
	width: 26px;
	height: 26px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background: #eef2f7;
	color: #68758a;
	font-size: 20px;
}

.list-overview {
	position: relative;
	display: flex;
	align-items: center;
	gap: 8px;
	margin-top: 16px;
}

.result-count {
	color: #fff;
	font-size: 12px;
	font-weight: 600;
}

.overview-dot {
	width: 3px;
	height: 3px;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.5);
}

.overview-caption {
	color: rgba(255, 255, 255, 0.66);
	font-size: 11px;
}

.list-content {
	padding: 20px 16px 0;
}

.app-card {
	display: flex;
	align-items: flex-start;
	gap: 14px;
	margin-bottom: 12px;
	padding: 16px;
	border: 1px solid #e8eef6;
	border-radius: 22px;
	background: #fff;
	box-shadow: 0 8px 22px rgba(28, 53, 89, 0.045);
	transition: transform 0.2s ease;
}

.app-card:active {
	transform: scale(0.985);
}

.app-icon-frame,
.app-icon,
.app-icon-fallback {
	width: 68px;
	height: 68px;
	flex-shrink: 0;
	border-radius: 18px;
}

.app-icon-frame {
	overflow: hidden;
	background: #edf2f8;
	box-shadow: 0 5px 14px rgba(27, 54, 93, 0.1);
}

.app-icon {
	display: block;
}

.app-icon-fallback {
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #5d91cf, #315f9a);
	color: #fff;
	font-size: 28px;
	font-weight: 700;
}

.app-card-body {
	flex: 1;
	min-width: 0;
}

.app-card-heading {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
}

.app-name {
	max-width: calc(100% - 28px);
	color: #1d2b42;
	font-size: 16px;
	font-weight: 700;
	line-height: 1.35;
}

.app-open {
	width: 24px;
	height: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	border-radius: 50%;
	background: #f3f6fb;
	color: #70829a;
	font-size: 22px;
	line-height: 1;
}

.app-tagline {
	display: block;
	margin-top: 5px;
	color: #718097;
	font-size: 12px;
	line-height: 1.45;
}

.app-description {
	display: -webkit-box;
	overflow: hidden;
	margin-top: 8px;
	color: #8793a4;
	font-size: 12px;
	line-height: 1.55;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}

.app-card-footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	margin-top: 12px;
}

.app-category {
	max-width: 60%;
	overflow: hidden;
	padding: 4px 9px;
	border-radius: 999px;
	background: #f0f5fc;
	color: #53749d;
	font-size: 10px;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.app-rating {
	display: flex;
	align-items: center;
	gap: 4px;
	white-space: nowrap;
}

.rating-star {
	color: #f3a63b;
	font-size: 12px;
}

.rating-value {
	color: #465a73;
	font-size: 12px;
	font-weight: 700;
}

.rating-count {
	color: #9aa5b4;
	font-size: 10px;
}

.skeleton-list {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.skeleton-card {
	display: flex;
	gap: 14px;
	padding: 16px;
	border: 1px solid #e8eef6;
	border-radius: 22px;
	background: #fff;
}

.skeleton-icon {
	width: 68px;
	height: 68px;
	flex-shrink: 0;
	border-radius: 18px;
	background: #e9eef5;
	animation: skeleton-pulse 1.4s ease-in-out infinite;
}

.skeleton-copy {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 10px;
}

.skeleton-line {
	height: 10px;
	border-radius: 6px;
	background: #edf1f6;
	animation: skeleton-pulse 1.4s ease-in-out infinite;
}

.skeleton-line.title {
	width: 56%;
	height: 13px;
}

.skeleton-line.medium {
	width: 82%;
}

.skeleton-line.short {
	width: 44%;
}

@keyframes skeleton-pulse {
	0%, 100% { opacity: 0.55; }
	50% { opacity: 1; }
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 54px 20px 62px;
	text-align: center;
}

.empty-icon {
	width: 64px;
	height: 64px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 18px;
	border-radius: 22px;
	background: #eaf1fa;
	color: #6280a5;
	font-size: 30px;
}

.empty-title {
	color: #273a54;
	font-size: 17px;
	font-weight: 700;
}

.empty-desc {
	max-width: 260px;
	margin-top: 8px;
	color: #8a97a9;
	font-size: 12px;
	line-height: 1.6;
}

.empty-retry {
	margin-top: 20px;
	padding: 10px 22px;
	border-radius: 999px;
	background: #24558e;
	color: #fff;
	font-size: 13px;
	font-weight: 600;
}

.list-footer {
	padding: 18px 0 24px;
	color: #8b98a9;
	font-size: 12px;
	text-align: center;
}
</style>
