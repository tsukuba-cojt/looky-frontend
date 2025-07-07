export const tabs = [
  {
    name: "index",
    href: "/",
    key: "try_on",
    icon: "galleryHorizontalEnd",
  },
  {
    name: "discover",
    href: "/discover",
    key: "discover",
    icon: "search",
  },
  {
    name: "collections",
    href: "/collections",
    key: "collections",
    icon: "grid2x2",
  },
  {
    name: "settings",
    href: "/settings",
    key: "settings",
    icon: "circleUserRound",
  },
];

export const genders = ["man", "woman", "other"] as const;

export const categories = ["tops", "bottoms", "dresses"] as const;

export const subcategories = {
  tops: ["t_shirts", "blouses", "tank_tops", "polos", "tunics", "hoodies"],
  bottoms: ["jeans", "pants", "shorts", "leggings", "skirts", "capris"],
  dresses: [
    "casual_dresses",
    "evening_dresses",
    "cocktail_dresses",
    "summer_dresses",
    "maxi_dresses",
    "shirt_dresses",
  ],
} as const;

export const colors = {
  red: "#E53935",
  pink: "#D81B60",
  purple: "#8E24AA",
  indigo: "#3949AB",
  blue: "#1E88E5",
  cyan: "#00ACC1",
  teal: "#00897B",
  green: "#43A047",
  lime: "#C0CA33",
  yellow: "#FDD835",
  amber: "#FFB300",
  orange: "#FB8C00",
  brown: "#6D4C41",
  gray: "#757575",
  black: "#000000",
  white: "#FFFFFF",
} as const;

export const languages = ["en", "ja", "system"] as const;

export const themes = ["light", "dark", "system"] as const;
