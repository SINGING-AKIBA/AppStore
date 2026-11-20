import { Repository } from "typeorm";
import { Provide } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Base } from "@/app/common/service/Base";
import { Settings as SettingsModel } from "@/app/common/model/Settings";
import { Settings as CommonSettingsService } from "@/app/common/service/Settings";

@Provide()
export class Settings extends Base {
  @InjectEntityModel(SettingsModel)
  model: Repository<SettingsModel>;
  @Inject()
  commonSettings: CommonSettingsService;
  protected selectFields:string[];
  protected filterWhere() {
    
  }

  async appStoreLogo(): Promise<string> {
    const value = await this.commonSettings.getConfig("app_store_logo");
    let logo = "";

    if (typeof value === "string") {
      const imageSource = value.match(/<img[^>]+src=[\"']([^\"']+)[\"']/i)?.[1];
      logo = imageSource || value.replace(/<[^>]*>/g, "").trim();
    } else if (value && typeof value === "object") {
      const configuredValue = value.logo || value.url || value.src;
      logo = typeof configuredValue === "string" ? configuredValue.trim() : "";
    }

    // Only return image locations; never expose arbitrary setting content to the client.
    return /^(https?:\\/\\/|\\/|data:image\\/)/i.test(logo) ? logo : "";
  }
}
