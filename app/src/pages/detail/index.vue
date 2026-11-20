<template>
	<view class="app-download-page">
		<!-- 微信内置浏览器引导浮层 -->
		<view class="wx-guide" v-if="showWxGuide" @click="showWxGuide = false">
			<view class="wx-guide-bg" />
			<view class="wx-guide-illustration">
				<view class="wx-guide-phone">
					<view class="wx-guide-status-bar">
						<text class="wg-time">9:41</text>
						<view class="wg-battery" />
					</view>
					<view class="wg-nav">
						<text class="wg-nav-back">{{ t('index.wxGuide.back') }}</text>
						<text class="wg-nav-title">{{ appInfo.name }}</text>
						<view class="wg-nav-dots">
							<view class="wg-dot" />
							<view class="wg-dot" />
							<view class="wg-dot" />
						</view>
					</view>
					<view class="wg-content">
						<view class="wg-icon" />
						<view class="wg-line" />
						<view class="wg-line short" />
					</view>
				</view>
			</view>
			<view class="wx-guide-header">
				<view class="wg-arrow-box">
					<view class="wg-arrow" />
					<text class="wg-arrow-label">{{ t('index.wxGuide.clickMore') }}</text>
				</view>
			</view>
			<view class="wx-guide-steps">
				<view class="wg-step">
					<text class="wg-step-num">1</text>
					<text>{{ t('index.wxGuide.step1') }}</text>
				</view>
				<view class="wg-step">
					<text class="wg-step-num">2</text>
					<text>{{ t('index.wxGuide.step2') }}</text>
				</view>
				<view class="wg-step">
					<text class="wg-step-num">3</text>
					<text>{{ t('index.wxGuide.step3') }}</text>
				</view>
			</view>
			<view class="wx-guide-close" @click.stop="showWxGuide = false">
				<text>{{ t('index.wxGuide.gotIt') }}</text>
			</view>
		</view>

		<!-- 顶部状态栏与详情导航 -->
		<view class="status-bar" />
		<view class="detail-nav">
			<view class="nav-back" @click="handleBack">
				<text class="nav-back-icon">‹</text>
				<text>{{ t('index.detailBack') }}</text>
			</view>
			<text class="nav-title">{{ t('index.detailTitle') }}</text>
			<view class="nav-placeholder" />
		</view>

		<!-- ====== 加载骨架屏 ====== -->
		<view class="skeleton" v-if="loading">
			<view class="skeleton-hero">
				<view class="skeleton-icon" />
				<view class="skeleton-line w-60" />
				<view class="skeleton-line w-45" />
				<view class="skeleton-line w-30" />
			</view>
			<view class="skeleton-btn" />
			<view class="skeleton-section">
				<view class="skeleton-line w-20" />
				<view class="skeleton-scroll">
					<view class="skeleton-card" />
					<view class="skeleton-card" />
				</view>
			</view>
			<view class="skeleton-section">
				<view class="skeleton-line w-20" />
				<view class="skeleton-block" />
			</view>
		</view>

		<!-- ====== 主内容 ====== -->
		<template v-if="!loading">
			<!-- ====== Hero 区域 ====== -->
			<view class="hero">
				<view class="hero-bg" />
				<view class="hero-content">
					<view class="icon-wrapper">
						<view class="icon-shadow" />
						<image class="app-icon" :src="appInfo.icon" mode="aspectFit" />
					</view>
					<view class="hero-copy">
						<text class="app-name">{{ appInfo.name }}</text>
						<text v-if="appInfo.subtitle" class="app-subtitle">{{ appInfo.subtitle }}</text>
						<text v-if="appInfo.company" class="app-company">{{ appInfo.company }}</text>
						<view class="rating-row" v-if="appInfo.rating !== undefined">
							<text class="rating-star" v-for="i in 5" :key="i"
								:class="{ active: i <= Math.floor(appInfo.rating) }">★</text>
							<text class="rating-num">{{ appInfo.rating }}</text>
							<text v-if="appInfo.ratingCount > 0" class="rating-count">{{ t('index.ratingCount', { count: appInfo.ratingCount }) }}</text>
						</view>
						<view v-if="appInfo.category" class="category-chip">{{ appInfo.category }}</view>
					</view>
				</view>
			</view>

			<!-- ====== 下载按钮 ====== -->
			<view class="download-sticky">
				<view class="download-btn" :class="[btnClass, { 'btn-loading': downloading }]" @click="handleDownload">
					<view class="btn-icon-wrap">
						<text class="btn-icon" v-if="currentPlatform === 'ios'"></text>
						<text class="btn-icon android-symbol" v-else>▶</text>
					</view>
					<view class="btn-body">
						<text class="btn-caption">{{ btnCaption }}</text>
						<text class="btn-title">{{ btnTitle }}</text>
					</view>
					<view class="btn-ripple" />
					<view class="btn-spinner" v-if="downloading" />
				</view>

				<!-- 版本 & 大小 -->
				<view class="meta-row">
					<text class="meta-item">{{ t('index.version') }} {{ appInfo.version }}</text>
					<view class="meta-dot" />
					<text class="meta-item">{{ appInfo.size }}</text>
					<view class="meta-dot" />
					<text class="meta-item">{{ platformLabel }}</text>
				</view>
			</view>

			<!-- ====== 截图预览 ====== -->
			<view class="section" v-if="screenshots.length">
				<view class="section-header">
					<view class="section-accent" />
					<text class="section-title">{{ t('index.preview') }}</text>
				</view>
				<scroll-view class="screenshot-scroll" scroll-x show-scrollbar="false" enhanced
					@scroll="onScreenshotScroll">
					<view class="screenshot-item" v-for="(item, index) in screenshots" :key="index">
						<view class="device-frame">
							<image :src="item" mode="aspectFill" class="screenshot-img" />
						</view>
					</view>
				</scroll-view>
				<view class="scroll-hint" v-if="screenshots.length > 1">
					<view class="scroll-dot" v-for="i in screenshots.length" :key="i"
						:class="{ active: i - 1 === activeScreenshotIndex }" />
				</view>
			</view>

			<!-- ====== 应用描述 ====== -->
			<view class="section" v-if="appInfo.description">
				<view class="section-header">
					<view class="section-accent" />
					<text class="section-title">{{ t('index.description') }}</text>
				</view>
				<view class="desc-card">
					<text class="desc-text" :class="{ collapsed: !descExpanded }">{{ appInfo.description }}</text>
					<view class="desc-more" v-if="appInfo.description.length > 120"
						@click="descExpanded = !descExpanded">
						<text>{{ descExpanded ? t('index.collapse') : t('index.expand') }}</text>
						<text class="desc-arrow" :class="{ up: descExpanded }">▼</text>
					</view>
				</view>
			</view>

			<!-- ====== 信息列表 ====== -->
			<view class="section" v-if="infoList.length">
				<view class="section-header">
					<view class="section-accent" />
					<text class="section-title">{{ t('index.info') }}</text>
				</view>
				<view class="info-group">
					<view class="info-row" v-for="(item, index) in infoList" :key="index">
						<text class="info-label">{{ item.label }}</text>
						<text class="info-value">{{ item.value }}</text>
					</view>
				</view>
			</view>
			<!-- ====== 页脚 ====== -->
			<view class="footer">
				<view class="footer-links" v-if="footerLinks.length">
					<template v-for="(link, index) in footerLinks" :key="link.key">
						<text class="footer-link" @click="handleLink(link.key)">{{ link.label }}</text>
						<view class="footer-divider" v-if="index < footerLinks.length - 1" />
					</template>
				</view>
				<text class="footer-copy">
					{{ t('index.footer.copyright', { year: currentYear, company: appInfo.company }) }}
				</text>
			</view>
		</template>
	</view>
</template>

<script setup>
import { ref, reactive, computed, onUnmounted } from 'vue'
import { onLoad, onShow, onHide } from '@dcloudio/uni-app'
import { useI18n } from 'vue-i18n'
import { info as getAppInfo } from '@/api/Apps'

const { t } = useI18n()

// ==================== 响应式数据 ====================

const loading = ref(true)
const loadError = ref(false)
const descExpanded = ref(false)
const showWxGuide = ref(false)
const downloading = ref(false)
const currentPlatform = ref('')
const activeScreenshotIndex = ref(0)
const currentYear = ref(new Date().getFullYear())
const currentAppId = ref('')
const currentAppKey = ref('')

const appInfo = reactive({
	icon: '',
	name: '',
	subtitle: '',
	company: '',
	version: '',
	size: '',
	description: '',
	rating: undefined,
	ratingCount: 0,
	iosUrl: '',
	androidUrl: '',
	screenshots: [],
	category: '',
	languages: '',
	ageRating: '',
	copyright: '',
	links: [],
	btnCaption: '',
	btnTitle: '',
	minOSiOS: '',
	minOSAndroid: '',
})

// 缓存截图列表，避免 computed 频繁重建
const screenshots = computed(() => appInfo.screenshots || [])

// ==================== 数据映射 ====================

function mapAppInfoData(data) {
	const version = (data.app_version && data.app_version[0]) || {}
	const screenshotList = (data.app_screenshot || []).map(s => s.image)

	// 构建底部链接
	const links = []
	if (data.privacy_url) links.push({ key: 'privacy', label: t('index.link.privacy'), url: data.privacy_url })
	if (data.terms_url) links.push({ key: 'terms', label: t('index.link.terms'), url: data.terms_url })
	if (data.support_url) links.push({ key: 'support', label: t('index.link.support'), url: data.support_url })

	// 兼容性 — 存储原始值，由计算属性按平台选择
	const minOSiOS = version.min_os_ios || ''
	const minOSAndroid = version.min_os_android || ''

	return {
		icon: data.icon || '',
		name: data.name || '',
		subtitle: data.subtitle || '',
		company: data.company || '',
		version: version.version || '',
		size: version.size || '',
		description: data.description || '',
		rating: data.rating !== undefined ? Number(data.rating) : undefined,
		ratingCount: Number(data.rating_count || 0),
		iosUrl: version.ios_url || '',
		androidUrl: version.android_url || '',
		screenshots: screenshotList,
		category: data.category || '',
		languages: '',
		ageRating: data.age_rating || '',
		copyright: data.copyright || '',
		links,
		minOSiOS,
		minOSAndroid,
		btnCaption: '',
		btnTitle: '',
	}
}

// ==================== 计算属性 ====================

const footerLinks = computed(() => {
	const links = appInfo.links
	if (!links || !Array.isArray(links)) return []
	return links.filter(l => l.label && l.url)
})

const compatibility = computed(() => {
	if (currentPlatform.value === 'ios' && appInfo.minOSiOS) {
		return `iOS ${appInfo.minOSiOS}+`
	}
	if (currentPlatform.value === 'android' && appInfo.minOSAndroid) {
		return `Android ${appInfo.minOSAndroid}+`
	}
	// 平台未检测到时显示全部
	if (appInfo.minOSiOS && appInfo.minOSAndroid) {
		return `iOS ${appInfo.minOSiOS}+ / Android ${appInfo.minOSAndroid}+`
	}
	if (appInfo.minOSiOS) return `iOS ${appInfo.minOSiOS}+`
	if (appInfo.minOSAndroid) return `Android ${appInfo.minOSAndroid}+`
	return ''
})

const infoList = computed(() => {
	const items = []
	if (appInfo.category) items.push({ label: t('index.infoLabel.category'), value: appInfo.category })
	if (compatibility.value) items.push({ label: t('index.infoLabel.compatibility'), value: compatibility.value })
	if (appInfo.languages) items.push({ label: t('index.infoLabel.languages'), value: appInfo.languages })
	if (appInfo.ageRating) items.push({ label: t('index.infoLabel.ageRating'), value: appInfo.ageRating })
	if (appInfo.copyright) items.push({ label: t('index.infoLabel.copyright'), value: appInfo.copyright })
	return items
})

const btnClass = computed(() => (currentPlatform.value === 'ios' ? 'btn-ios' : 'btn-android'))

const platformLabel = computed(() => {
	if (currentPlatform.value === 'ios') return 'iOS'
	if (currentPlatform.value === 'android') return 'Android'
	return t('index.platform.cross')
})

const btnCaption = computed(() => {
	if (currentPlatform.value === 'ios') return t('index.btn.caption.ios')
	if (currentPlatform.value === 'android') return t('index.btn.caption.android')
	return t('index.btn.caption.default')
})

const btnTitle = computed(() => {
	const url = currentPlatform.value === 'ios' ? appInfo.iosUrl : appInfo.androidUrl
	return url ? t('index.btn.title.download') : t('index.btn.title.unavailable')
})

// ==================== 平台检测 ====================

function isWechatBrowser() {
	// #ifdef H5
	try {
		const ua = navigator.userAgent.toLowerCase()
		return ua.includes('micromessenger')
	} catch {
		return false
	}
	// #endif
	return false
}

function detectPlatform() {
	const info = uni.getSystemInfoSync()
	if (info.platform === 'ios') return 'ios'
	return 'android'

}

// ==================== 加载数据 ====================

function getAppInfoQuery() {
	if (currentAppId.value) return { id: currentAppId.value }
	if (currentAppKey.value) return { app_key: currentAppKey.value }
	return {}
}

async function loadAppInfo() {
	loading.value = true
	loadError.value = false

	try {
		const res = await getAppInfo(getAppInfoQuery())
		if (res && res.data) {
			Object.assign(appInfo, mapAppInfoData(res.data))
			// 缓存原始数据到本地存储
			cacheAppData(res.data)
		} else {
			throw new Error(t('index.toast.emptyData'))
		}
	} catch (err) {
		console.warn('[App Download] 加载失败，尝试使用缓存:', err.message)
		// 尝试读取缓存
		const cached = readAppDataCache()
		if (cached) {
			Object.assign(appInfo, mapAppInfoData(cached))
		}
		loadError.value = true
	} finally {
		loading.value = false
	}
}


// 缓存管理
const CACHE_KEY_PREFIX = 'app_download_info_cache_'

function getCacheKey() {
	const identity = currentAppId.value || ('key_' + currentAppKey.value)
	return CACHE_KEY_PREFIX + identity
}

function cacheAppData(data) {
	try {
		const cache = {
			data,
			time: Date.now(),
		}
		uni.setStorageSync(getCacheKey(), cache)
	} catch {
		// 存储空间不足时静默失败
	}
}

function readAppDataCache() {
	try {
		let cache = uni.getStorageSync(getCacheKey())
		if (!cache && currentAppId.value === '1') {
			cache = uni.getStorageSync('app_download_info_cache')
		}
		if (cache && cache.data && Date.now() - cache.time < 30 * 60 * 1000) {
			return cache.data
		}
	} catch {
		// 读取失败时返回 null
	}
	return null
}


// ==================== 操作 ====================

function handleBack() {
	uni.navigateBack({
		delta: 1,
		fail: () => uni.redirectTo({ url: '/pages/index/index' }),
	})
}

function handleDownload() {
	if (downloading.value) return

	const url = currentPlatform.value === 'ios' ? appInfo.iosUrl : appInfo.androidUrl
	if (!url) {
		uni.showToast({
			title: currentPlatform.value === 'ios' ? t('index.toast.unavailableIos') : t('index.toast.unavailableAndroid'),
			icon: 'none',
		})
		return
	}

	downloading.value = true

	// 延迟重置 loading 状态，给用户反馈
	setTimeout(() => {
		downloading.value = false
	}, 3000)

	// #ifdef H5
	window.open(url, '_blank')
	// #endif

	// #ifdef APP-PLUS
	try {
		plus.runtime.openURL(url, (err) => {
			downloading.value = false
			uni.showToast({
				title: err ? t('index.toast.linkError') : t('index.toast.redirecting'),
				icon: err ? 'none' : 'success',
			})
		})
	} catch {
		downloading.value = false
		uni.showToast({
			title: t('index.toast.linkError'),
			icon: 'none',
		})
	}
	// #endif
}

function handleLink(key) {
	const links = appInfo.links
	if (!Array.isArray(links)) return
	const link = links.find(l => l.key === key)
	if (!link || !link.url) return

	// #ifdef H5
	window.open(link.url, '_blank')
	// #endif

	// #ifdef APP-PLUS
	try {
		plus.runtime.openURL(link.url)
	} catch {
		uni.showToast({ title: t('index.toast.linkError'), icon: 'none' })
	}
	// #endif
}

function onScreenshotScroll(e) {
	// 根据滚动位置计算当前活跃截图索引
	const detail = e.detail
	if (detail && detail.scrollWidth) {
		const scrollLeft = detail.scrollLeft || 0
		const itemWidth = 206 // 192 width + 14 gap
		const index = Math.round(scrollLeft / itemWidth)
		activeScreenshotIndex.value = Math.min(index, screenshots.value.length - 1)
	}
}


// ==================== 生命周期 ====================

onLoad((options) => {
	currentAppId.value = options?.id ? String(options.id) : ''
	currentAppKey.value = options?.app_key ? String(options.app_key) : ''
	currentPlatform.value = detectPlatform()
	showWxGuide.value = isWechatBrowser()

	if (!currentAppId.value && !currentAppKey.value) {
		loading.value = false
		loadError.value = true
		uni.showToast({ title: t('index.toast.emptyData'), icon: 'none' })
		return
	}

	// 优先展示缓存，提升首屏速度
	const cached = readAppDataCache()
	if (cached) {
		Object.assign(appInfo, mapAppInfoData(cached))
		loading.value = false
		// 后台静默更新
		getAppInfo(getAppInfoQuery()).then((res) => {
			if (res && res.data) {
				Object.assign(appInfo, mapAppInfoData(res.data))
				cacheAppData(res.data)
			}
		}).catch(() => {
			// 缓存已展示，静默失败
		})
	} else {
		loadAppInfo()
	}
})

onShow(() => {
	if (!currentPlatform.value) {
		currentPlatform.value = detectPlatform()
	}
})

onHide(() => {
	// 重置下载状态，避免重新进入时状态残留
	downloading.value = false
})

onUnmounted(() => {
	// 清理资源
	showWxGuide.value = false
	downloading.value = false
})
</script>

<style lang="scss" scoped>
@use "sass:color";

// ============================================================
//  Apple Design System — 下载页面 v4
//  设计语言：纯净 · 精致 · 光影层次 · 微动效 · 响应式
// ============================================================

// -------- 设计令牌 --------
$ios: #007aff;
$ios-dark: #0a84ff;
$android: #34a853;
$android-dark: #30d158;
$star: #ff9500;
$bg: #ffffff;
$bg-dark: #1c1c1e;
$bg-subtle: #f5f5f7;
$bg-subtle-dark: #2c2c2e;
$bg-warm: #fafafa;
$bg-warm-dark: #1c1c1e;
$text: #1d1d1f;
$text-dark: #f5f5f7;
$text-muted: #86868b;
$text-muted-dark: #98989d;
$text-dim: #aeaeb2;
$text-dim-dark: #636366;
$border: #e5e5ea;
$border-dark: #38383a;
$border-light: #f0f0f0;
$border-light-dark: #2c2c2e;
$shadow-icon: 0 8px 32px rgba(0, 0, 0, 0.15);
$shadow-icon-dark: 0 8px 32px rgba(0, 0, 0, 0.4);
$shadow-card: 0 2px 16px rgba(0, 0, 0, 0.06);
$shadow-card-dark: 0 2px 16px rgba(0, 0, 0, 0.2);
$shadow-btn-ios: 0 6px 24px rgba(0, 122, 255, 0.35);
$shadow-btn-android: 0 6px 24px rgba(52, 168, 83, 0.35);
$radius-icon: 27%;
$radius-full: 9999px;
$radius-card: 14px;
$radius-sm: 12px;

// -------- 全局重置 --------
.app-download-page {
	box-sizing: border-box;
	min-height: 100vh;
	padding-bottom: calc(40px + env(safe-area-inset-bottom, 0px));
	font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text',
		'Helvetica Neue', Helvetica, Arial, sans-serif;
	color: $text;
	background: $bg;
	-webkit-font-smoothing: antialiased;
	overflow-x: hidden;
	transition: background 0.3s ease, color 0.3s ease;
}

.status-bar {
	height: var(--status-bar-height, 44px);
	background: transparent;
}

// ============================================================
//  骨架屏
// ============================================================

.skeleton {
	padding: 0 24px;

	&-hero {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 48px 0 36px;
	}

	&-icon {
		width: 120px;
		height: 120px;
		border-radius: $radius-icon;
		background: $border-light;
		margin-bottom: 24px;
		animation: skeleton-pulse 1.5s ease-in-out infinite;
	}

	&-line {
		height: 16px;
		border-radius: 8px;
		background: $border-light;
		margin-bottom: 12px;
		animation: skeleton-pulse 1.5s ease-in-out infinite;

		&.w-60 {
			width: 60%;
		}

		&.w-45 {
			width: 45%;
		}

		&.w-30 {
			width: 30%;
		}

		&.w-20 {
			width: 20%;
		}
	}

	&-btn {
		height: 56px;
		border-radius: $radius-full;
		background: $border-light;
		margin-bottom: 24px;
		animation: skeleton-pulse 1.5s ease-in-out infinite;
	}

	&-section {
		padding: 32px 0 16px;
	}

	&-scroll {
		display: flex;
		gap: 14px;
		padding: 4px 0 8px;
	}

	&-card {
		width: 192px;
		height: 415px;
		border-radius: 24px;
		background: $border-light;
		flex-shrink: 0;
		animation: skeleton-pulse 1.5s ease-in-out infinite;
	}

	&-block {
		height: 120px;
		border-radius: $radius-card;
		background: $border-light;
		animation: skeleton-pulse 1.5s ease-in-out infinite;
	}
}

@keyframes skeleton-pulse {
	0% {
		opacity: 0.6;
	}

	50% {
		opacity: 1;
	}

	100% {
		opacity: 0.6;
	}
}

// ============================================================
//  Hero
// ============================================================

.hero {
	position: relative;
	padding: 0 24px 36px;
	overflow: hidden;
}

.hero-bg {
	position: absolute;
	top: -100px;
	left: 50%;
	transform: translateX(-50%);
	width: 500px;
	height: 500px;
	border-radius: 50%;
	background:
		radial-gradient(circle at 50% 38%, rgba(0, 122, 255, 0.07) 0%, transparent 55%),
		radial-gradient(circle at 30% 50%, rgba(0, 122, 255, 0.03) 0%, transparent 40%);
	pointer-events: none;
}

.hero-content {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	padding-top: 16px;
	animation: hero-fade-in 0.6s ease-out;
}

@keyframes hero-fade-in {
	from {
		opacity: 0;
		transform: translateY(12px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}

// -------- 图标容器（带阴影层）--------
.icon-wrapper {
	position: relative;
	margin-bottom: 24px;
}

.icon-shadow {
	position: absolute;
	top: 0;
	left: 0;
	width: 120px;
	height: 120px;
	border-radius: $radius-icon;
	background: rgba(0, 0, 0, 0.08);
	filter: blur(18px);
	transform: translateY(10px) scale(0.92);
	pointer-events: none;
}

.app-icon {
	width: 120px;
	height: 120px;
	border-radius: $radius-icon;
	box-shadow: $shadow-icon;
	background: #f0f0f0;
	position: relative;
	z-index: 1;
	will-change: transform;
	transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

	&:active {
		transform: scale(0.95);
	}
}

.app-name {
	font-size: 28px;
	font-weight: 700;
	line-height: 1.25;
	letter-spacing: -0.4px;
	margin-bottom: 6px;
	background: linear-gradient(135deg, $text 0%, #555 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.app-subtitle {
	font-size: 15px;
	font-weight: 400;
	color: $text-muted;
	line-height: 1.45;
	margin-bottom: 16px;
	letter-spacing: 0.2px;
	max-width: 280px;
}

// -------- 评分 --------
.rating-row {
	display: inline-flex;
	align-items: center;
	gap: 2px;
	padding: 6px 16px;
	background: $bg-subtle;
	border-radius: 20px;
}

.rating-star {
	font-size: 15px;
	color: $border;
	letter-spacing: -1px;
	transition: color 0.3s ease;

	&.active {
		color: $star;
		text-shadow: 0 0 2px rgba(255, 149, 0, 0.2);
	}
}

.rating-num {
	font-size: 13px;
	color: $text-muted;
	margin-left: 4px;
	font-weight: 500;
}

// ============================================================
//  下载按钮
// ============================================================

.download-sticky {
	padding: 0 20px 12px;
	animation: btn-slide-up 0.5s ease-out 0.15s both;
}

@keyframes btn-slide-up {
	from {
		opacity: 0;
		transform: translateY(16px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.download-btn {
	display: flex;
	align-items: center;
	gap: 16px;
	padding: 16px 24px;
	border-radius: $radius-full;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
		box-shadow 0.3s ease;
	-webkit-tap-highlight-color: transparent;

	&:active {
		transform: scale(0.96);
	}

	// 光晕扫光动画
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 60%;
		height: 100%;
		background: linear-gradient(90deg,
				transparent 0%,
				rgba(255, 255, 255, 0.12) 50%,
				transparent 100%);
		animation: shimmer 3s ease-in-out infinite;
		pointer-events: none;
	}

	// 加载状态
	&.btn-loading {
		pointer-events: none;
		opacity: 0.85;
	}
}

@keyframes shimmer {
	0% {
		left: -100%;
	}

	50% {
		left: 200%;
	}

	100% {
		left: 200%;
	}
}

.btn-ios {
	background: linear-gradient(135deg, #007aff 0%, #0055d4 100%);
	box-shadow: $shadow-btn-ios;
}

.btn-android {
	background: linear-gradient(135deg, #34a853 0%, #1e8e3e 100%);
	box-shadow: $shadow-btn-android;
}

.btn-icon-wrap {
	width: 48px;
	height: 48px;
	border-radius: 14px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	background: rgba(255, 255, 255, 0.18);
	backdrop-filter: blur(2px);
	-webkit-backdrop-filter: blur(2px);
	position: relative;
	z-index: 1;
}

.btn-icon {
	font-size: 28px;
	color: #fff;
	font-weight: 400;
}

.android-symbol {
	font-size: 22px;
	font-weight: 700;
	padding-left: 2px;
}

.btn-body {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	position: relative;
	z-index: 1;
}

.btn-caption {
	font-size: 11px;
	color: rgba(255, 255, 255, 0.75);
	font-weight: 500;
	letter-spacing: 0.8px;
	text-transform: uppercase;
	margin-bottom: 1px;
}

.btn-title {
	font-size: 20px;
	font-weight: 600;
	color: #ffffff;
	letter-spacing: 0.2px;
}

.btn-ripple {
	position: absolute;
	top: -60%;
	right: -20%;
	width: 140px;
	height: 220px;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.05);
	pointer-events: none;
}

// 加载旋转动画
.btn-spinner {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 28px;
	height: 28px;
	margin: -14px 0 0 -14px;
	border: 3px solid rgba(255, 255, 255, 0.3);
	border-top-color: #fff;
	border-radius: 50%;
	z-index: 2;
	animation: btn-spin 0.6s linear infinite;
}

@keyframes btn-spin {
	to {
		transform: rotate(360deg);
	}
}

// -------- 元信息行 --------
.meta-row {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	margin-top: 14px;
	animation: meta-fade 0.4s ease-out 0.3s both;
}

@keyframes meta-fade {
	from {
		opacity: 0;
	}

	to {
		opacity: 1;
	}
}

.meta-item {
	font-size: 12px;
	color: $text-dim;
	font-weight: 400;
	letter-spacing: 0.2px;
}

.meta-dot {
	width: 3px;
	height: 3px;
	border-radius: 50%;
	background: $border;
}

// ============================================================
//  通用 Section
// ============================================================

.section {
	padding: 32px 0 16px;
}

.section-header {
	padding: 0 24px;
	margin-bottom: 16px;
	display: flex;
	align-items: center;
	gap: 10px;
}

.section-title {
	font-size: 20px;
	font-weight: 700;
	letter-spacing: -0.3px;
}

.section-accent {
	width: 3px;
	height: 18px;
	border-radius: 2px;
	background: linear-gradient(180deg, $ios, color.adjust($ios, $lightness: 20%));
	flex-shrink: 0;
}

// ============================================================
//  截图预览
// ============================================================

.screenshot-scroll {
	display: flex;
	flex-direction: row;
	padding: 4px 16px 8px;
	overflow-y: hidden;

	::v-deep .uni-scroll-view-content {
		display: flex;
		flex-direction: row;
		gap: 14px;
	}
}

.screenshot-item {
	flex-shrink: 0;
	transition: transform 0.25s ease, box-shadow 0.25s ease;

	&:active {
		transform: scale(0.95);
	}
}

.device-frame {
	width: 192px;
	height: 415px;
	border-radius: 24px;
	border: 2px solid rgba(0, 0, 0, 0.06);
	padding: 6px;
	background: linear-gradient(180deg, #fafafa 0%, #fff 100%);
	box-shadow: $shadow-card;
	overflow: hidden;
	position: relative;

	// 顶部刘海底栏
	&::before {
		content: '';
		position: absolute;
		top: 10px;
		left: 50%;
		transform: translateX(-50%);
		width: 60px;
		height: 5px;
		background: rgba(0, 0, 0, 0.08);
		border-radius: 3px;
		z-index: 2;
	}
}

.screenshot-img {
	width: 100%;
	height: 100%;
	border-radius: 17px;
	background: #f0f0f0;
	object-fit: cover;
}

.scroll-hint {
	display: flex;
	justify-content: center;
	gap: 5px;
	margin-top: 16px;
}

.scroll-dot {
	width: 6px;
	height: 6px;
	border-radius: 3px;
	background: $border-light;
	transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

	&.active {
		width: 20px;
		background: $text-dim;
	}
}

// ============================================================
//  描述卡片
// ============================================================

.desc-card {
	margin: 0 24px;
	background: $bg-subtle;
	border-radius: $radius-card;
	padding: 22px 20px;
	position: relative;
	overflow: hidden;

	// 左上角装饰
	&::before {
		content: '“';
		position: absolute;
		top: -6px;
		left: 12px;
		font-size: 48px;
		color: rgba(0, 122, 255, 0.08);
		font-family: Georgia, serif;
		line-height: 1;
		pointer-events: none;
	}
}

.desc-text {
	font-size: 14px;
	line-height: 1.8;
	color: $text;
	white-space: pre-line;
	transition: all 0.35s ease;
	position: relative;
	z-index: 1;

	&.collapsed {
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		line-clamp: 4;
		overflow: hidden;
	}
}

.desc-more {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	margin-top: 12px;
	padding: 6px 14px;
	border-radius: 20px;
	background: rgba(0, 122, 255, 0.08);
	font-size: 13px;
	font-weight: 500;
	color: $ios;
	cursor: pointer;
	transition: background 0.2s;
	position: relative;
	z-index: 1;
	-webkit-tap-highlight-color: transparent;

	&:active {
		background: rgba(0, 122, 255, 0.15);
	}
}

.desc-arrow {
	font-size: 8px;
	transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

	&.up {
		transform: rotate(180deg);
	}
}

// ============================================================
//  信息列表
// ============================================================

.info-group {
	margin: 0 24px;
	border-radius: $radius-card;
	overflow: hidden;
	background: $bg;
	box-shadow: 0 0 0 1px $border inset;
}

.info-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16px 20px;
	border-bottom: 1px solid $border-light;
	transition: background 0.2s;

	&:active {
		background: $bg-subtle;
	}

	&:last-child {
		border-bottom: none;
	}
}

.info-label {
	font-size: 14px;
	color: $text-muted;
	letter-spacing: 0.1px;
}

.info-value {
	font-size: 14px;
	color: $text;
	font-weight: 500;
	text-align: right;
	max-width: 55%;
	letter-spacing: 0.1px;
}

// ============================================================
//  页脚
// ============================================================

.footer {
	margin-top: 48px;
	padding: 32px 24px calc(32px + env(safe-area-inset-bottom, 0px));
	text-align: center;
	background: $bg-warm;
}

.footer-links {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 14px;
	margin-bottom: 16px;
}

.footer-link {
	font-size: 13px;
	color: $ios;
	cursor: pointer;
	transition: opacity 0.2s;
	position: relative;
	-webkit-tap-highlight-color: transparent;

	&:active {
		opacity: 0.6;
	}
}

.footer-divider {
	width: 1px;
	height: 12px;
	background: $border;
}

.footer-copy {
	font-size: 12px;
	color: $text-dim;
	letter-spacing: 0.2px;
}

// ============================================================
//  空状态
// ============================================================

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 80px 24px;
	text-align: center;
}

.empty-icon {
	font-size: 48px;
	margin-bottom: 16px;
}

.empty-title {
	font-size: 20px;
	font-weight: 700;
	color: $text;
	margin-bottom: 8px;
}

.empty-desc {
	font-size: 14px;
	color: $text-muted;
	margin-bottom: 24px;
	line-height: 1.5;
}

.empty-retry {
	padding: 12px 32px;
	border-radius: $radius-full;
	background: $ios;
	color: #fff;
	font-size: 16px;
	font-weight: 600;
	cursor: pointer;
	transition: transform 0.2s, opacity 0.2s;
	-webkit-tap-highlight-color: transparent;

	&:active {
		transform: scale(0.96);
		opacity: 0.9;
	}
}

// ============================================================
//  微信内置浏览器引导浮层
// ============================================================

.wx-guide {
	position: fixed;
	inset: 0;
	z-index: 9999;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 80px 24px 40px;
	animation: guide-fade-in 0.35s ease-out;
}

@keyframes guide-fade-in {
	from {
		opacity: 0;
	}

	to {
		opacity: 1;
	}
}

.wx-guide-bg {
	position: absolute;
	inset: 0;
	background: rgba(0, 0, 0, 0.75);
	backdrop-filter: blur(8px);
	-webkit-backdrop-filter: blur(8px);
}

// -------- 手机模拟图 --------
.wx-guide-illustration {
	position: relative;
	z-index: 1;
	margin-bottom: 20px;
	animation: guide-phone-in 0.5s ease-out 0.1s both;
}

@keyframes guide-phone-in {
	from {
		opacity: 0;
		transform: translateY(20px) scale(0.95);
	}

	to {
		opacity: 1;
		transform: translateY(0) scale(1);
	}
}

.wx-guide-phone {
	width: 200px;
	height: 148px;
	border-radius: 18px;
	background: #fff;
	overflow: hidden;
	box-shadow: 0 12px 48px rgba(0, 0, 0, 0.35);
}

.wx-guide-status-bar {
	height: 18px;
	background: #f0f0f0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 10px;
}

.wg-time {
	font-size: 9px;
	color: #333;
	font-weight: 600;
}

.wg-battery {
	width: 14px;
	height: 7px;
	border: 1px solid #666;
	border-radius: 2px;
	position: relative;

	&::after {
		content: '';
		position: absolute;
		right: -3px;
		top: 2px;
		width: 2px;
		height: 3px;
		background: #666;
		border-radius: 0 1px 1px 0;
	}
}

.wg-nav {
	height: 30px;
	background: #f0f0f0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 8px;
	border-bottom: 1px solid #e0e0e0;
}

.wg-nav-back {
	font-size: 11px;
	color: #07c160;
}

.wg-nav-title {
	font-size: 11px;
	color: #333;
	font-weight: 600;
}

.wg-nav-dots {
	display: flex;
	gap: 3px;
}

.wg-dot {
	width: 3px;
	height: 3px;
	border-radius: 50%;
	background: #999;
}

.wg-content {
	padding: 10px 14px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
}

.wg-icon {
	width: 30px;
	height: 30px;
	border-radius: 7px;
	background: linear-gradient(135deg, #007aff, #0055d4);
}

.wg-line {
	width: 100%;
	height: 5px;
	border-radius: 3px;
	background: #f0f0f0;

	&.short {
		width: 55%;
	}
}

// -------- 右上角箭头指示 --------
.wx-guide-header {
	position: relative;
	z-index: 1;
	display: flex;
	justify-content: flex-end;
	width: 100%;
	max-width: 300px;
	margin-bottom: 28px;
	animation: guide-arrow-in 0.5s ease-out 0.2s both;
}

@keyframes guide-arrow-in {
	from {
		opacity: 0;
		transform: translateX(20px);
	}

	to {
		opacity: 1;
		transform: translateX(0);
	}
}

.wg-arrow-box {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 6px;
}

.wg-arrow {
	width: 0;
	height: 0;
	border-left: 9px solid transparent;
	border-right: 9px solid transparent;
	border-bottom: 13px solid #fff;
	animation: wg-bounce 1.4s ease-in-out infinite;
}

@keyframes wg-bounce {

	0%,
	100% {
		transform: translateY(0);
	}

	50% {
		transform: translateY(6px);
	}
}

.wg-arrow-label {
	font-size: 12px;
	color: #fff;
	font-weight: 500;
	background: rgba(255, 255, 255, 0.15);
	padding: 4px 12px;
	border-radius: 20px;
	white-space: nowrap;
}

// -------- 步骤说明 --------
.wx-guide-steps {
	position: relative;
	z-index: 1;
	width: 100%;
	max-width: 280px;
	display: flex;
	flex-direction: column;
	gap: 18px;
	margin-bottom: 40px;
	animation: guide-steps-in 0.5s ease-out 0.3s both;
}

@keyframes guide-steps-in {
	from {
		opacity: 0;
		transform: translateY(12px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.wg-step {
	display: flex;
	align-items: center;
	gap: 14px;
	font-size: 15px;
	color: rgba(255, 255, 255, 0.9);
	font-weight: 400;
}

.wg-step-num {
	width: 28px;
	height: 28px;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.15);
	border: 1px solid rgba(255, 255, 255, 0.1);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 13px;
	font-weight: 600;
	color: #fff;
	flex-shrink: 0;
}

// -------- 关闭按钮 --------
.wx-guide-close {
	position: relative;
	z-index: 1;
	width: 200px;
	height: 48px;
	border-radius: 24px;
	background: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	transition: transform 0.2s, box-shadow 0.2s;
	animation: guide-btn-in 0.5s ease-out 0.4s both;
	-webkit-tap-highlight-color: transparent;

	>text {
		font-size: 16px;
		font-weight: 600;
		color: $text;
	}

	&:active {
		transform: scale(0.96);
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}
}

@keyframes guide-btn-in {
	from {
		opacity: 0;
		transform: translateY(16px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}


/* Refined App Store detail layout */
.app-download-page {
	background: #f5f8fd;
}

.status-bar {
	background: #f5f8fd;
}

.detail-nav {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 44px;
	padding: 0 20px;
	background: #f5f8fd;
}

.nav-back {
	display: flex;
	align-items: center;
	gap: 3px;
	min-width: 70px;
	height: 36px;
	color: #315b90;
	font-size: 13px;
}

.nav-back-icon {
	font-size: 32px;
	line-height: 28px;
}

.nav-title {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	color: #1d2a3f;
	font-size: 15px;
	font-weight: 600;
}

.nav-placeholder {
	width: 70px;
}

.hero {
	padding: 8px 20px 28px;
	border-radius: 0 0 30px 30px;
	background: linear-gradient(180deg, #eef5ff 0%, #f5f8fd 100%);
}

.hero-bg {
	top: -150px;
	left: 80%;
	width: 360px;
	height: 360px;
}

.hero-content {
	flex-direction: row;
	align-items: center;
	gap: 16px;
	padding-top: 14px;
	text-align: left;
}

.hero-copy {
	display: flex;
	flex: 1;
	min-width: 0;
	flex-direction: column;
	align-items: flex-start;
}

.icon-wrapper {
	flex-shrink: 0;
	margin-bottom: 0;
}

.icon-shadow,
.app-icon {
	width: 100px;
	height: 100px;
	border-radius: 24px;
}

.app-name {
	margin-bottom: 5px;
	color: #172a46;
	background: none;
	background-clip: initial;
	-webkit-background-clip: initial;
	-webkit-text-fill-color: #172a46;
	font-size: 24px;
	font-weight: 750;
	letter-spacing: -0.5px;
	text-align: left;
}

.app-subtitle {
	max-width: 100%;
	margin-bottom: 6px;
	color: #63738a;
	font-size: 13px;
	text-align: left;
}

.app-company {
	margin-bottom: 8px;
	color: #8a96a7;
	font-size: 11px;
}

.rating-row {
	align-self: flex-start;
	gap: 3px;
	padding: 5px 9px;
	border: 1px solid rgba(221, 230, 243, 0.9);
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.82);
}

.rating-star {
	font-size: 12px;
}

.rating-num {
	font-size: 12px;
}

.rating-count {
	margin-left: 4px;
	color: #8a97a9;
	font-size: 10px;
}

.category-chip {
	display: inline-flex;
	margin-top: 8px;
	padding: 4px 10px;
	border-radius: 999px;
	background: rgba(0, 122, 255, 0.08);
	color: #2872c7;
	font-size: 11px;
}

.download-sticky {
	padding: 12px 20px 18px;
}

.download-btn {
	padding: 15px 20px;
	border-radius: 18px;
}

.section {
	padding: 22px 20px 10px;
}

.section-header {
	margin-bottom: 12px;
	padding: 0 2px;
}

.section-title {
	color: #25364f;
	font-size: 17px;
}

.desc-card,
.info-group {
	margin: 0;
	border: 1px solid #eaf0f7;
	border-radius: 18px;
	background: #fff;
	box-shadow: 0 8px 22px rgba(27, 54, 93, 0.04);
}

.desc-card {
	padding: 18px;
}

.info-row {
	padding: 15px 18px;
}

.device-frame {
	width: 176px;
	height: 380px;
	border-radius: 22px;
	box-shadow: 0 12px 30px rgba(25, 50, 85, 0.12);
}

.footer {
	margin-top: 32px;
	border-radius: 26px 26px 0 0;
	background: #eef3fa;
}

@media screen and (max-width: 360px) {
	.hero-content {
		gap: 12px;
	}

	.icon-shadow,
	.app-icon {
		width: 88px;
		height: 88px;
	}

	.app-name {
		font-size: 21px;
	}
}

</style>