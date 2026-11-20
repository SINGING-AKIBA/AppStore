<template>
	<view class="app-list-page">
		<view class="app-list-header">
			<view class="status-bar" />
			<view class="header-bar">
				<view class="header-brand" :class="{ 'is-hidden': searchExpanded }">
					<image class="header-logo" :src="logoUrl" mode="aspectFit" />
				</view>

				<view class="header-search" :class="{ 'is-expanded': searchExpanded }">
					<input
						v-if="searchExpanded"
						class="search-input"
						:value="keyword"
						:placeholder="t('apps.search')"
						:focus="searchExpanded"
						confirm-type="search"
						@input="handleSearchInput"
						@confirm="trackSearch"
					/>
					<view class="search-toggle" @tap.stop="toggleSearch">
						<view v-if="!searchExpanded" class="search-icon" />
						<text v-else class="search-close">×</text>
					</view>
				</view>
			</view>
		</view>
		<view class="header-placeholder" />
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
					hover-class="app-card-hover"
					@tap="openApp(app)"
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

			<view v-if="apps.length" class="list-footer">
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
import { getAppStoreLogo } from '@/api/Settings'
import { trackAnalytics } from '@/utils/analytics'
import defaultLogo from '@/logo.png'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const PAGE_SIZE = 20

const loading = ref(false)
const loadingMore = ref(false)
const loadError = ref(false)
const keyword = ref('')
const searchExpanded = ref(false)
const logoUrl = ref(defaultLogo)
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

function trackSearch() {
	const searchKeyword = keyword.value.trim()
	if (!searchKeyword) return
	trackAnalytics({
		event_type: 'app_search',
		keyword: searchKeyword,
		result_count: filteredApps.value.length,
		page_path: '/pages/index/index',
	})
}

function toggleSearch() {
	if (searchExpanded.value) {
		searchExpanded.value = false
		keyword.value = ''
		return
	}
	searchExpanded.value = true
}

async function loadAppStoreLogo() {
	try {
		const response = await getAppStoreLogo()
		const value = response?.data
		const configuredLogo = typeof value === 'string'
			? value.trim()
			: String(value?.logo || value?.url || value?.src || '').trim()
		if (configuredLogo) logoUrl.value = configuredLogo
	} catch (error) {
		// Keep the bundled logo when the optional backend branding setting is unavailable.
		console.warn('[App Store] 加载后台 Logo 配置失败，使用默认 Logo:', error)
	}
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
	const appId = app?.id ?? app?.app_info_id
	const appKey = app?.app_key
	const hasId = appId !== undefined && appId !== null && String(appId).trim() !== ''
	const hasAppKey = typeof appKey === 'string' && appKey.trim() !== ''

	if (!hasId && !hasAppKey) {
		console.warn('[App Store] 应用缺少 id/app_key，无法打开详情:', app)
		uni.showToast({ title: t('apps.detailUnavailable'), icon: 'none' })
		return
	}

	const query = hasId
		? 'id=' + encodeURIComponent(String(appId))
		: 'app_key=' + encodeURIComponent(appKey)
	const url = '/pages/detail/index?' + query

	uni.navigateTo({
		url,
		fail: (error) => {
			// 页面栈满时使用 redirectTo 兜底；失败时明确告知用户。
			console.warn('[App Store] navigateTo 失败，尝试 redirectTo:', error)
			uni.redirectTo({
				url,
				fail: (redirectError) => {
					console.error('[App Store] 打开应用详情失败:', redirectError)
					uni.showToast({ title: t('apps.navigationFailed'), icon: 'none' })
				},
			})
		},
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
	trackAnalytics({ event_type: 'page_view', page_path: '/pages/index/index' })
	loadAppStoreLogo()
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

.app-list-header {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 1000;
	background: rgba(255, 255, 255, 0.97);
	box-shadow: 0 4px 18px rgba(31, 54, 88, 0.07);
}

.status-bar {
	height: var(--status-bar-height, 44px);
	background: #fff;
}

.header-bar {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 62px;
	padding: 0 16px;
}

.header-brand {
	display: flex;
	align-items: center;
	height: 44px;
	opacity: 1;
	transition: opacity 0.18s ease;
}

.header-brand.is-hidden {
	opacity: 0;
}

.header-logo {
	display: block;
	width: 42px;
	height: 42px;
	border-radius: 11px;
}

.header-search {
	position: absolute;
	top: 50%;
	right: 16px;
	display: flex;
	align-items: center;
	overflow: hidden;
	width: 44px;
	height: 44px;
	border: 1px solid transparent;
	border-radius: 14px;
	background: transparent;
	transform: translateY(-50%);
	transform-origin: right center;
	transition:
		width 0.28s cubic-bezier(0.2, 0.75, 0.2, 1),
		background-color 0.2s ease,
		border-color 0.2s ease,
		box-shadow 0.2s ease;
}

.header-search.is-expanded {
	width: calc(100% - 32px);
	max-width: 420px;
	border-color: #e6edf6;
	background: #f7f9fc;
	box-shadow: 0 5px 16px rgba(34, 59, 94, 0.08);
}

.search-input {
	flex: 1;
	min-width: 0;
	width: 0;
	height: 100%;
	padding: 0 4px 0 15px;
	color: #253953;
	font-size: 14px;
	opacity: 1;
}

.search-toggle {
	display: flex;
	align-items: center;
	justify-content: center;
	flex: 0 0 44px;
	width: 44px;
	height: 44px;
}

.search-icon {
	position: relative;
	width: 17px;
	height: 17px;
	border: 2px solid #526985;
	border-radius: 50%;
}

.search-icon::after {
	position: absolute;
	right: -6px;
	bottom: -3px;
	width: 8px;
	height: 2px;
	border-radius: 2px;
	background: #526985;
	content: "";
	transform: rotate(45deg);
}

.search-close {
	color: #657790;
	font-size: 25px;
	font-weight: 300;
	line-height: 1;
}

.header-placeholder {
	height: calc(var(--status-bar-height, 44px) + 62px);
}

.list-content {
	padding: 16px 16px 0;
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

.app-card:active,
.app-card-hover {
	transform: translateY(-1px) scale(0.99);
	box-shadow: 0 12px 26px rgba(28, 53, 89, 0.09);
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
