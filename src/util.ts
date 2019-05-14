export interface MenuItem {
  id: string;
  title: string;
  action: string;
}

export enum ImageId {
  titleLogo = "titleLogo",
  character = "character",
  mech = "mech"
}

export const defaultColor = "#7B64FF";

export enum MainPageType {
  editor = "editor",
  settings = "settings",
  license = "license"
}
