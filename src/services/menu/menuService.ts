import { MENU_ITEMS } from "@/constants/menu";
import type { MenuItem } from "@/types/menu";

/** Replace with apiGet('/menu') when backend is ready */
export async function getMenuItems(): Promise<MenuItem[]> {
  return MENU_ITEMS;
}
