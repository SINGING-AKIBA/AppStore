<template>
	<view class="qr-code-wrap">
		<!-- #ifdef APP-PLUS -->
		<canvas
			v-if="visible"
			:canvas-id="cid"
			:style="{
				width: size + 'px',
				height: size + 'px'
			}"
		></canvas>
		<!-- #endif -->
		<!-- #ifndef APP-PLUS -->
		<canvas
			v-if="visible"
			type="2d"
			:id="cid"
			:canvas-id="cid"
			:style="{
				width: size + 'px',
				height: size + 'px'
			}"
		></canvas>
		<!-- #endif -->
		<view v-if="!visible" :style="{ width: size + 'px', height: size + 'px' }"></view>
	</view>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, getCurrentInstance } from 'vue'
import UQRCode from 'uqrcodejs'

// #ifdef APP-PLUS
const isApp = true
// #else
const isApp = false
// #endif

const props = defineProps({
	content: {
		type: [Object, String],
		required: true
	},
	size: {
		type: Number,
		default: 200
	},
	margin: {
		type: Number,
		default: 10
	},
	foregroundColor: {
		type: String,
		default: '#000000'
	},
	backgroundColor: {
		type: String,
		default: '#ffffff'
	},
	level: {
		type: String,
		default: 'H',
		validator: v => ['L', 'M', 'Q', 'H'].includes(v)
	}
})

const emit = defineEmits(['ready', 'error'])

const cid = `qr_${Math.random().toString(36).slice(2, 8)}`
const visible = ref(true)
const instance = getCurrentInstance()

/** 获取 canvas 上下文 — 平台差异封装 */
const getContext = () => {
	return new Promise((resolve, reject) => {
		if (isApp) {
			// App 端：旧版 API，通过 canvas-id 创建 CanvasContext
			resolve(uni.createCanvasContext(cid, instance))
		} else {
			// H5 / 小程序：type="2d" 查询节点拿 CanvasRenderingContext2D
			const query = uni.createSelectorQuery().in(instance)
			query.select(`#${cid}`).fields({ node: true, size: true }).exec(res => {
				if (res[0]) {
					const canvas = res[0].node
					canvas.width = props.size
					canvas.height = props.size
					resolve(canvas.getContext('2d'))
				} else {
					reject(new Error('Canvas node not found'))
				}
			})
		}
	})
}

/** 获取 canvas 信息（保存图片用）— 平台差异封装 */
const getCanvasNode = () => {
	return new Promise((resolve, reject) => {
		if (isApp) {
			// App 端：只需 canvasId
			resolve({ canvasId: cid })
		} else {
			const query = uni.createSelectorQuery().in(instance)
			query.select(`#${cid}`).fields({ node: true, size: true }).exec(res => {
				if (res[0]) {
					resolve(res[0])
				} else {
					reject(new Error('Canvas node not found'))
				}
			})
		}
	})
}

const draw = async () => {
	const text = typeof props.content === 'object' && props.content !== null
		? JSON.stringify(props.content)
		: String(props.content)

	visible.value = false
	await nextTick()
	visible.value = true
	await nextTick()

	try {
		const ctx = await getContext()

		const qr = new UQRCode()
		qr.data = text
		qr.size = props.size
		qr.margin = props.margin
		qr.foregroundColor = props.foregroundColor
		qr.backgroundColor = props.backgroundColor
		qr.errorCorrectLevel = UQRCode.errorCorrectLevel[props.level]
		qr.make()

		qr.canvasContext = ctx
		// uqrcodejs 内部已处理 ctx.draw()（对 App 端旧版 CanvasContext 是必需的，
		// 对 H5/MP 的标准 2d context 是 no-op）
		await qr.drawCanvas()

		emit('ready')
	} catch (err) {
		emit('error', err)
	}
}

const save = async (options = {}) => {
	const canvasInfo = await getCanvasNode()
	return new Promise((resolve, reject) => {
		if (isApp) {
			uni.canvasToTempFilePath({
				canvasId: canvasInfo.canvasId,
				...options,
				success: resolve,
				fail: reject
			})
		} else {
			uni.canvasToTempFilePath({
				canvas: canvasInfo.node,
				fileType: 'png',
				width: props.size,
				height: props.size,
				...options,
				success: resolve,
				fail: reject
			})
		}
	})
}

const saveToAlbum = async () => {
	try {
		const res = await save()
		await uni.saveImageToPhotosAlbum({
			filePath: res.tempFilePath
		})
		uni.showToast({ title: '保存成功', icon: 'success' })
	} catch (err) {
		if (err.errMsg?.includes('cancel') || err.errMsg?.includes('deny')) {
			uni.showToast({ title: '已取消保存', icon: 'none' })
		} else {
			uni.showToast({ title: '保存失败，请手动截图', icon: 'none' })
		}
		throw err
	}
}

onMounted(draw)

watch(
	() => props.content,
	() => { draw() },
	{ deep: true }
)

watch(
	() => [props.size, props.margin, props.foregroundColor, props.backgroundColor, props.level],
	() => { draw() }
)

defineExpose({ save, saveToAlbum })
</script>

<style lang="scss" scoped>
.qr-code-wrap {
	display: inline-flex;
}
</style>