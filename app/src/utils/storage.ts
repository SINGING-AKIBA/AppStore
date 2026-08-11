export const storage = {
	// 前缀标识
	prefix: "smile_",

	// 获取完整键名
	getKey(key: string): string {
		return this.prefix + key;
	},

	// 设置存储值
	set(key: string, value: any): void {
		try {
			const fullKey = this.getKey(key);
			const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
			uni.setStorageSync(fullKey, stringValue);
		} catch (error) {
			console.error('Storage set error:', error);
		}
	},

	// 获取存储值
	get(key: string, defaultValue: any = null): any {
		try {
			const fullKey = this.getKey(key);
			const value = uni.getStorageSync(fullKey);
			if (value === '') {
				return defaultValue;
			}
			try {
				return JSON.parse(value);
			} catch {
				return value;
			}
		} catch (error) {
			console.error('Storage get error:', error);
			return defaultValue;
		}
	},

	// 获取后删除（一次性读取）
	getAndRemove(key: string, defaultValue: any = null): any {
		const value = this.get(key, defaultValue);
		this.remove(key);
		return value;
	},

	// 移除指定存储值
	remove(key: string): void {
		try {
			const fullKey = this.getKey(key);
			uni.removeStorageSync(fullKey);
		} catch (error) {
			console.error('Storage remove error:', error);
		}
	},

	// 清空所有存储值
	clear(): void {
		try {
			uni.clearStorageSync();
		} catch (error) {
			console.error('Storage clear error:', error);
		}
	},

	// 检查是否存在指定键
	has(key: string): boolean {
		const fullKey = this.getKey(key);
		return uni.getStorageSync(fullKey) !== '';
	}
};