const size = {
  px: 1,
  $0: 0,
  "$0.5": 2,
  $1: 4,
  "$1.5": 6,
  $2: 8,
  "$2.5": 10,
  $3: 12,
  "$3.5": 14,
  $4: 16,
  $5: 20,
  $6: 24,
  $7: 28,
  $8: 32,
  $9: 36,
  $10: 40,
  $11: 44,
  $12: 48,
  $14: 56,
  $16: 64,
  $20: 80,
  $24: 96,
  $28: 112,
  $32: 128,
  $36: 144,
  $40: 160,
  $44: 176,
  $48: 192,
  $52: 208,
  $56: 224,
  $60: 240,
  $64: 256,
  $72: 288,
  $80: 320,
  $96: 384,
  true: 0,
};

const spaces = Object.entries(size);

const spacesNegative = spaces.slice(1).map(([k, v]) => [`-${k.slice(1)}`, -v]);

const space = Object.fromEntries([...spaces, ...spacesNegative]);

const zIndex = {
  $0: 0,
  $10: 10,
  $20: 20,
  $30: 30,
  $40: 40,
  $50: 50,
};

const radius = {
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  "2xl": 16,
  "3xl": 24,
  "4xl": 32,
  full: 999999,
  none: 0,
  true: 0,
};

const shadow = {
  "2xs": "0 1px rgba(0, 0, 0, 0.05)",
  xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px  rgba(0, 0, 0, 0.1)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  none: "0 0 #000000",
};

export const tokens = {
  radius,
  zIndex,
  space,
  size,
  shadow,
} as const;
