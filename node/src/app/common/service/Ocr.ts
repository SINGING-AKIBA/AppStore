import { Provide, Config } from '@midwayjs/core';
import OcrApi, { RecognizeBusinessLicenseRequest } from '@alicloud/ocr-api20210707';
import ocr_api20210707, * as $ocr_api20210707 from '@alicloud/ocr-api20210707';
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';

/**
 * 营业执照识别结果（JSON.parse 后的 data 字段）
 */
export interface BusinessLicenseData {
    /** 统一社会信用代码 */
    regNum?: string;
    /** 企业名称 */
    name?: string;
    /** 企业类型 */
    type?: string;
    /** 法定代表人 */
    legalPerson?: string;
    /** 成立日期 */
    establishDate?: string;
    /** 有效期限 */
    validPeriod?: string;
    /** 地址 */
    address?: string;
    /** 注册资本（万元） */
    capital?: string;
    /** 经营范围 */
    businessScope?: string;
    /** 组成形式（仅个体工商户） */
    compositionForm?: string;
    /** 统一社会信用代码（校验后） */
    creditCode?: string;
    /** 注册号 */
    regNumber?: string;
    /** 原识别结果的完整 JSON */
    _raw?: any;
}

/** 通用 OCR 识别结果 */
export interface OcrResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    requestId?: string;
}

@Provide()
export class Ocr {
    @Config('ocr')
    config: {
        accessKeyId: string;
        accessKeySecret: string;
        endpoint: string;
    };

    /** OCR 客户端（惰性初始化） */
    private client: OcrApi | null = null;

    /**
     * 创建阿里云 OCR 客户端
     */
    private getClient(): ocr_api20210707 {
        if (!this.client) {
            let config = new $OpenApi.Config({
                accessKeyId: this.config.accessKeyId,
                accessKeySecret: this.config.accessKeySecret,
            });
            config.endpoint = this.config.endpoint;
            this.client =  new ocr_api20210707(config);
        }
        return this.client;
    }

    /**
     * 识别企业营业执照
     *
     * @description 调用阿里云 OCR RecognizeBusinessLicense 接口，
     * 识别营业执照图片中的结构化信息（企业名称、统一社会信用代码、法人等）。
     *
     * @param imageUrl - 营业执照图片的公开可访问 URL 地址
     * @returns 结构化的营业执照信息
     *
     * @example
     * ```typescript
     * const ocr = await ctx.requestContext.getAsync(Ocr);
     * const result = await ocr.recognizeBusinessLicense('https://example.com/license.jpg');
     * if (result.success) {
     *   console.log(result.data.name);      // 企业名称
     *   console.log(result.data.regNum);    // 统一社会信用代码
     *   console.log(result.data.legalPerson); // 法定代表人
     * }
     * ```
     */
    public async recognizeBusinessLicense(
        imageUrl: string,
    ): Promise<OcrResponse<BusinessLicenseData>> {
        try {
            const client = this.getClient();
            const request = new RecognizeBusinessLicenseRequest({
                url: imageUrl,
            });
            const response = await client.recognizeBusinessLicense(request);

            const body = response?.body;
            if (!body) {
                return { success: false, error: 'OCR 响应为空' };
            }

            // body.data 是 JSON 字符串，需要解析
            const rawData: any = body.data ? JSON.parse(body.data) : null;

            if (!rawData) {
                return {
                    success: false,
                    error: body.message || '识别失败，未返回数据',
                    requestId: body.requestId,
                };
            }

            return {
                success: true,
                data: {
                    ...rawData.data,
                },
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'OCR 识别请求异常',
            };
        }
    }

    /**
     * 识别企业营业执照（通过图片 Base64 数据）
     *
     * @description 适用于图片已在前端转成 Base64 的场景，
     * 不需要将图片上传到公网即可识别。
     *
     * @param imageBase64 - 营业执照图片的 Base64 编码数据（不包含 data:image 前缀）
     * @returns 结构化的营业执照信息
     *
     * @example
     * ```typescript
     * const result = await ocr.recognizeBusinessLicenseByBase64(base64String);
     * ```
     */
    public async recognizeBusinessLicenseByBase64(
        imageBase64: string,
    ): Promise<OcrResponse<BusinessLicenseData>> {
        try {
            const client = this.getClient();

            // 将 Base64 转换为 Buffer，再转为 Readable stream
            const buffer = Buffer.from(imageBase64, 'base64');
            const { Readable } = await import('stream');
            const stream = Readable.from(buffer);

            const request = new RecognizeBusinessLicenseRequest({
                body: stream,
            });
            const response = await client.recognizeBusinessLicense(request);

            const body = response?.body;
            if (!body) {
                return { success: false, error: 'OCR 响应为空' };
            }

            const rawData: any = body.data ? JSON.parse(body.data) : null;

            if (!rawData) {
                return {
                    success: false,
                    error: body.message || '识别失败，未返回数据',
                    requestId: body.requestId,
                };
            }

            return {
                success: true,
                data: {
                    ...rawData.data,
                },
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'OCR 识别请求异常',
            };
        }
    }
}