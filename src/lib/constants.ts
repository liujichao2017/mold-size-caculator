// path: src/lib/constants.ts

const materialList = [
  {
    name: 'ABS',
    density: 0.0012,
    price: 0.013,
  },
  {
    name: 'ASA',
    density: 0.0012,
    price: 0.026,
  },
  {
    name: 'HDPE',
    density: 0.001,
    price: 0.011,
  },
  {
    name: 'LDPE',
    density: 0.001,
    price: 0.011,
  },
  {
    name: 'PA6',
    density: 0.0012,
    price: 0.017,
  },
  {
    name: 'PA66',
    density: 0.0012,
    price: 0.022,
  },
  {
    name: 'PA66-GF15',
    density: 0.0013,
    price: 0.021,
  },
  {
    name: 'PA66-GF20',
    density: 0.00135,
    price: 0.02,
  },
  {
    name: 'PA66-GF30',
    density: 0.0014,
    price: 0.019,
  },
  {
    name: 'PA66-GF35',
    density: 0.00145,
    price: 0.019,
  },
  {
    name: 'PA66-GF40',
    density: 0.0015,
    price: 0.019,
  },
  {
    name: 'PA66-GF45',
    density: 0.00155,
    price: 0.019,
  },
  {
    name: 'PA66-GF50',
    density: 0.0016,
    price: 0.022,
  },
  {
    name: 'PA6-GF15',
    density: 0.0013,
    price: 0.016,
  },
  {
    name: 'PA6-GF20',
    density: 0.0013,
    price: 0.016,
  },
  {
    name: 'PA6-GF30',
    density: 0.0014,
    price: 0.015,
  },
  {
    name: 'PA6-GF35',
    density: 0.00145,
    price: 0.015,
  },
  {
    name: 'PA6-GF40',
    density: 0.0015,
    price: 0.018,
  },
  {
    name: 'PA6-GF50',
    density: 0.0016,
    price: 0.019,
  },
  {
    name: 'PBT',
    density: 0.00135,
    price: 0.016,
  },
  {
    name: 'PBT+GF10',
    density: 0.00145,
    price: 0.012,
  },
  {
    name: 'PBT+GF20',
    density: 0.0015,
    price: 0.012,
  },
  {
    name: 'PBT+GF30',
    density: 0.00155,
    price: 0.013,
  },
  {
    name: 'PC',
    density: 0.0012,
    price: 0.023,
  },
  {
    name: 'PC+ABS',
    density: 0.0012,
    price: 0.025,
  },
  {
    name: 'PC+ASA',
    density: 0.0012,
    price: 0.024,
  },
  {
    name: 'PC+PBT',
    density: 0.00125,
    price: 0.03,
  },
  {
    name: 'PMMA',
    density: 0.0012,
    price: 0.021,
  },
  {
    name: 'POM',
    density: 0.00145,
    price: 0.017,
  },
  {
    name: 'PP',
    density: 0.001,
    price: 0.01,
  },
  {
    name: 'PP-EPDM',
    density: 0.0011,
    price: 0.022,
  },
  {
    name: 'PP-EPDM-T10',
    density: 0.001,
    price: 0.02,
  },
  {
    name: 'PP-EPDM-T15',
    density: 0.00105,
    price: 0.02,
  },
  {
    name: 'PP-EPDM-T20',
    density: 0.0011,
    price: 0.02,
  },
  {
    name: 'PP-EPDM-T25',
    density: 0.00115,
    price: 0.02,
  },
  {
    name: 'PP-EPDM-T30',
    density: 0.0012,
    price: 0.02,
  },
  {
    name: 'PP-GF20',
    density: 0.00115,
    price: 0.01,
  },
  {
    name: 'PP-GF30',
    density: 0.0012,
    price: 0.011,
  },
  {
    name: 'PP-GF40',
    density: 0.00125,
    price: 0.012,
  },
  {
    name: 'PPO',
    density: 0.0011,
    price: 0.0285,
  },
  {
    name: 'PP-T10',
    density: 0.001,
    price: 0.018,
  },
  {
    name: 'PP-T20',
    density: 0.0011,
    price: 0.018,
  },
  {
    name: 'PP-T30',
    density: 0.00115,
    price: 0.018,
  },
  {
    name: 'PP-T40',
    density: 0.00125,
    price: 0.018,
  },
  {
    name: 'GPPS',
    density: 0.0012,
    price: 0.011,
  },
  {
    name: 'HIPS',
    density: 0.0012,
    price: 0.0117,
  },
  {
    name: 'TPU',
    density: 0.0012,
    price: 0.03,
  },
  {
    name: 'TPV',
    density: 0.0011,
    price: 0.024,
  },
  {
    name: 'TPE',
    density: 0.0012,
    price: 0.025,
  },
] as const;

const moldMaterialList = [
  {
    name: 'NAK80',
    density: 0.0012,
    price: 0.013,
  },
  {
    name: 'NAK80-GF10',
    density: 0.0012,
    price: 0.013,
  },
] as const;

const machineList = [
  {
    name: '120T',
    injectionVolume: 153,
    moldWidth: 360,
    moldHeight: 380,
    machiningFee: 1,
  },
  {
    name: '150T',
    injectionVolume: 300,
    moldWidth: 470,
    moldHeight: 520,
    machiningFee: 1.5,
  },
  {
    name: '180T',
    injectionVolume: 350,
    moldWidth: 500,
    moldHeight: 520,
    machiningFee: 2,
  },
  {
    name: '200T',
    injectionVolume: 450,
    moldWidth: 530,
    moldHeight: 550,
    machiningFee: 2.5,
  },
  {
    name: '250T',
    injectionVolume: 600,
    moldWidth: 580,
    moldHeight: 600,
    machiningFee: 3,
  },
  {
    name: '300T',
    injectionVolume: 800,
    moldWidth: 635,
    moldHeight: 650,
    machiningFee: 3.5,
  },
  {
    name: '350T',
    injectionVolume: 1000,
    moldWidth: 690,
    moldHeight: 600,
    machiningFee: 4,
  },
  {
    name: '400T',
    injectionVolume: 1377,
    moldWidth: 700,
    moldHeight: 660,
    machiningFee: 5,
  },
  {
    name: '550T',
    injectionVolume: 2400,
    moldWidth: 820,
    moldHeight: 550,
    machiningFee: 6,
  },
  {
    name: '650T',
    injectionVolume: 3000,
    moldWidth: 930,
    moldHeight: 900,
    machiningFee: 8,
  },
  {
    name: '800T',
    injectionVolume: 3500,
    moldWidth: 1000,
    moldHeight: 1000,
    machiningFee: 10,
  },
  {
    name: '1100T',
    injectionVolume: 4636,
    moldWidth: 1160,
    moldHeight: 1160,
    machiningFee: 15,
  },
  {
    name: '1850T',
    injectionVolume: 7339,
    moldWidth: 1550,
    moldHeight: 1650,
    machiningFee: 30,
  },
  {
    name: '2500T',
    injectionVolume: 10000,
    moldWidth: 2000,
    moldHeight: 2000,
    machiningFee: -1,
  },
] as const;

const fixedLossRate = 0.05; // 固定损耗率，TODO：未来根据颜色会有不同

const moldPriceSolutionOneRules = [
  { maxWeight: 100, price: 9000 },
  { maxWeight: 200, price: 10000 },
  { maxWeight: 300, price: 11000 },
  { maxWeight: 400, price: 12000 },
  { maxWeight: 500, price: 13000 },
  { maxWeight: 600, price: 14000 },
  { maxWeight: 700, price: 15000 },
  { maxWeight: 800, price: 16000 },
  { maxWeight: 900, price: 17000 },
  { maxWeight: 1000, price: 18000 },
] as const;

const moldPriceSolutionTwoRules = [
  { maxWeight: 1100, price: 19000 },
  { maxWeight: 1200, price: 19500 },
  { maxWeight: 1300, price: 20000 },
  { maxWeight: 1400, price: 20500 },
  { maxWeight: 1500, price: 21000 },
  { maxWeight: 1600, price: 21500 },
  { maxWeight: 1700, price: 22000 },
  { maxWeight: 1800, price: 22500 },
  { maxWeight: 1900, price: 23000 },
  { maxWeight: 2000, price: 23500 },
  { maxWeight: 2100, price: 24000 },
  { maxWeight: 2200, price: 24500 },
  { maxWeight: 2300, price: 25000 },
  { maxWeight: 2400, price: 25500 },
] as const;

const marginSpaceRules = [
  { maxLength: 200, spacing: 30 },
  { maxLength: 300, spacing: 35 },
  { maxLength: 400, spacing: 40 },
  { maxLength: 500, spacing: 45 },
  { maxLength: 600, spacing: 50 },
  { maxLength: 700, spacing: 55 },
  { maxLength: 800, spacing: 60 },
  { maxLength: 900, spacing: 65 },
  { maxLength: 1000, spacing: 70 },
  { maxLength: 2000, spacing: -1 },
] as const;

const borderSpaceRules = [
  { maxLength: 200, spacing: 60 },
  { maxLength: 400, spacing: 80 },
  { maxLength: 600, spacing: 90 },
  { maxLength: 800, spacing: 100 },
  { maxLength: 900, spacing: 110 },
  { maxLength: 1000, spacing: 120 },
  { maxLength: 2000, spacing: -1 },
] as const;

const moldStructureHeightRules = [
  { maxHeight: 50, height: 140 },
  { maxHeight: 100, height: 170 },
  { maxHeight: 150, height: 200 },
  { maxHeight: 200, height: 230 },
  { maxHeight: 250, height: 260 },
  { maxHeight: 300, height: 280 },
  { maxHeight: 350, height: 300 },
  { maxHeight: 400, height: 320 },
  { maxHeight: 450, height: 340 },
  { maxHeight: 500, height: 360 },
] as const;

export {
  materialList,
  moldMaterialList,
  machineList,
  fixedLossRate,
  marginSpaceRules,
  borderSpaceRules,
  moldStructureHeightRules,
  moldPriceSolutionOneRules,
  moldPriceSolutionTwoRules,
};
