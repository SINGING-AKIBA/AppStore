import { Rule } from "@midwayjs/validation";
import { ApiProperty } from "@midwayjs/swagger";
import * as Joi from "joi";
export abstract class Base {
    @Rule(Joi.alternatives(Joi.number(), Joi.array().items(Joi.number())))
    @ApiProperty({ description: "ID" })
    id: number;
    @Rule(Joi.number().label("页码").allow('').optional())
    @ApiProperty({ description: "页码" })
    page: number;
    @Rule(Joi.number().label("分页大小").allow('').optional())
    @ApiProperty({ description: "分页大小" })
    pageSize: number;
    @Rule(Joi.array().items(Joi.number()).label("IDs").allow('').optional())
    @ApiProperty({ description: "IDs" })
    ids: string[];
    @Rule(() => Joi.alternatives([Joi.string(),Joi.number(),Joi.date()]).allow('').optional().label("创建时间"))
    @ApiProperty({ description: "创建时间" })
    create_time: Date|string|number;
    @Rule(() => Joi.alternatives([Joi.string(),Joi.number(),Joi.date()]).allow('').optional().label("更新时间"))
    @ApiProperty({ description: "更新时间" })
    update_time: Date|string|number;
}