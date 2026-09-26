export type DesignScreenId = "home" | "menu" | "reservation" | "checkout";

export interface DesignNavigateMessage {
  type: "navigate";
  screen: DesignScreenId;
}
