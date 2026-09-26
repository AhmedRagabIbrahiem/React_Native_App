import type { MenuItem } from "@/types/menu";

/** Placeholder menu data — replace with API or local DB later */
export const MENU_ITEMS: MenuItem[] = [
  {
    id: "1",
    name: "Espresso",
    description: "Rich single shot",
    price: "$3.50",
  },
  {
    id: "2",
    name: "Cappuccino",
    description: "Espresso with steamed milk foam",
    price: "$4.50",
    imageUrl: "../../assets/images/cappuccino.png",
  },
  {
    id: "3",
    name: "Latte",
    description: "Smooth espresso with steamed milk",
    price: "$4.75",
  },
  {
    id: "4",
    name: "Croissant",
    description: "Buttery, flaky pastry",
    price: "$3.25",
  },
];
