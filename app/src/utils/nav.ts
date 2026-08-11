const tabBarPages = [
	'/pages/index/index',
	'/pages/match/match',
	'/pages/learn/learn',
	'/pages/user/user'
]

export function navigateTo(url) {
	if (!url) {
		uni.showToast({ title: '功能开发中', icon: 'none' })
		return
	}
	const path = url.split('?')[0]
	if (tabBarPages.includes(path)) {
		uni.switchTab({ url })
	} else {
		uni.navigateTo({ url })
	}
}

export function redirectTo(url) {
	uni.redirectTo({ url })
}

export function reLaunch(url) {
	uni.reLaunch({ url })
}

export function navigateBack(delta = 1) {
	uni.navigateBack({ delta })
}

export const  webUrlKey = 'webUrl_key'
