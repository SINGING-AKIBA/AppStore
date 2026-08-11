import { navigateTo } from '@/utils/nav'

export interface QrData {
	type: string
	[key: string]: any
}

export type QrHandler = (data: QrData) => void | Promise<void>

const handlers = new Map<string, QrHandler>()

/** 注册二维码类型处理器 */
export function register(type: string, handler: QrHandler) {
	handlers.set(type, handler)
}

/** 解析并处理扫码结果 */
export async function scan(text: string) {
	let data: QrData
	try {
		data = JSON.parse(text)
	} catch {
		uni.showToast({ title: '无效的二维码', icon: 'none' })
		return
	}

	if (!data.type) {
		uni.showToast({ title: '无效的二维码', icon: 'none' })
		return
	}

	const handler = handlers.get(data.type)
	if (!handler) {
		uni.showToast({ title: '未知的二维码类型', icon: 'none' })
		return
	}

	await handler(data)
}

// ----- 内置类型注册 -----

register('boundSchool', (data) => {
	navigateTo(`/pages/bind/index?type=boundSchool&schools_id=${data.schools_id}`)
})

register('boundTeam', (data) => {
	navigateTo(`/pages/bind/index?type=boundTeam&teams_id=${data.teams_id}&schools_id=${data.schools_id}`)
})

register('opcAuthorize', (data) => {
	navigateTo(`/pages/bind/index?type=opcAuthorize&ticket=${data.ticket}`)
})