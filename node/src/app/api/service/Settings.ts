import { Repository } from "typeorm";
import { Inject, Provide } from "@midwayjs/core";
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

  private normalizeLogo(value: any): string {
    let logo = "";

    if (typeof value === "string") {
      const imageSource = value.match(/<img[^>]+src=[\"']([^\"']+)[\"']/i)?.[1];
      logo = imageSource || value.replace(/<[^>]*>/g, "").trim();
    } else if (value && typeof value === "object") {
      const configuredValue = value.logo || value.url || value.src;
      logo = typeof configuredValue === "string" ? configuredValue.trim() : "";
    }

    // Only return image locations; never expose arbitrary setting content to the client.
    return /^(https?:\/\/|\/|data:image\/)/i.test(logo) ? logo : "";
  }

  private normalizeBrandText(value: any, fallback: string, maxLength: number): string {
    const text = typeof value === "string" ? value.trim().slice(0, maxLength) : "";
    return text || fallback;
  }

  async appStoreLogo(): Promise<string> {
    const [branding, legacyLogo] = await Promise.all([
      this.commonSettings.getConfig("app_store_branding"),
      this.commonSettings.getConfig("app_store_logo"),
    ]);
    const configuredLogo = branding && typeof branding === "object" ? branding.logo : "";
    return this.normalizeLogo(configuredLogo || legacyLogo);
  }

  async appStoreBranding(): Promise<{ logo: string; title: string; subtitle: string }> {
    const [branding, legacyLogo] = await Promise.all([
      this.commonSettings.getConfig("app_store_branding"),
      this.commonSettings.getConfig("app_store_logo"),
    ]);
    const values = branding && typeof branding === "object" ? branding : {};

    return {
      logo: this.normalizeLogo(values.logo || legacyLogo),
      title: this.normalizeBrandText(values.title, "APP STORE", 40),
      subtitle: this.normalizeBrandText(values.subtitle, "CURATED APPS", 60),
    };
  }
}
