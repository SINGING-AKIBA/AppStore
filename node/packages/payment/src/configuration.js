"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentConfiguration = void 0;
const core_1 = require("@midwayjs/core");
const DefaultConfig = __importStar(require("./config/config.default"));
let PaymentConfiguration = class PaymentConfiguration {
    async onReady() {
        // TODO something
    }
};
PaymentConfiguration = __decorate([
    (0, core_1.Configuration)({
        namespace: 'payment',
        importConfigs: [
            {
                default: DefaultConfig,
            },
        ],
    })
], PaymentConfiguration);
exports.PaymentConfiguration = PaymentConfiguration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlndXJhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbmZpZ3VyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBK0M7QUFDL0MsdUVBQXlEO0FBVWxELElBQU0sb0JBQW9CLEdBQTFCLE1BQU0sb0JBQW9CO0lBQy9CLEtBQUssQ0FBQyxPQUFPO1FBQ1gsaUJBQWlCO0lBQ25CLENBQUM7Q0FDRixDQUFBO0FBSlksb0JBQW9CO0lBUmhDLElBQUEsb0JBQWEsRUFBQztRQUNiLFNBQVMsRUFBRSxTQUFTO1FBQ3BCLGFBQWEsRUFBRTtZQUNiO2dCQUNFLE9BQU8sRUFBRSxhQUFhO2FBQ3ZCO1NBQ0Y7S0FDRixDQUFDO0dBQ1csb0JBQW9CLENBSWhDO0FBSlksb0RBQW9CIn0=