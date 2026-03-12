export type SocialPlatform =
  | "instagram"
  | "facebook"
  | "youtube"
  | "tiktok"
  | "site";

export interface ISocialLinkBase {
  platform: SocialPlatform;
  label: string;
  url: string;
  active: boolean;
  order: number;
}

export interface ISocialLink extends ISocialLinkBase {
  id: string;
}

export type ICreateSocialLinkInput = Omit<ISocialLink, "id">;

export type IUpdateSocialLinkInput = Partial<ICreateSocialLinkInput> &
  Pick<ISocialLink, "id">;