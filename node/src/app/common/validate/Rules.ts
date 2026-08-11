import { Rule } from "@midwayjs/validation";
import { ApiProperty } from "@midwayjs/swagger";
import * as Joi from "joi";
import { Base } from "@/app/common/validate/Base";

export class Rules extends Base {
  @Rule(Joi.string().max(1020).optional().allow(null, ""))
  @ApiProperty({ description: "" })
  ptype: string;
  @Rule(Joi.string().max(1020).optional().allow(null, ""))
  @ApiProperty({ description: "" })
  v0: string;
  @Rule(Joi.string().max(1020).optional().allow(null, ""))
  @ApiProperty({ description: "" })
  v1: string;
  @Rule(Joi.string().max(1020).optional().allow(null, ""))
  @ApiProperty({ description: "" })
  v2: string;
  @Rule(Joi.string().max(1020).optional().allow(null, ""))
  @ApiProperty({ description: "" })
  v3: string;
  @Rule(Joi.string().max(1020).optional().allow(null, ""))
  @ApiProperty({ description: "" })
  v4: string;
  @Rule(Joi.string().max(1020).optional().allow(null, ""))
  @ApiProperty({ description: "" })
  v5: string;
  @Rule(Joi.string().max(1020).optional().allow(null, ""))
  @ApiProperty({ description: "" })
  v6: string;
}
