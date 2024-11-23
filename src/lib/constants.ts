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
    price: 0.02,
  },
  {
    name: 'GPPS',
    density: 0.0012,
    price: 0.015,
  },
  {
    name: 'HDPE',
    density: 0.001,
    price: 0.011,
  },
  {
    name: 'HIPS',
    density: 0.0012,
    price: 0.012,
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
    name: 'PA66-GF',
    density: 0.0013,
    price: 0.021,
  },
  {
    name: 'PA6-GF',
    density: 0.0013,
    price: 0.016,
  },
  {
    name: 'PBT',
    density: 0.00135,
    price: 0.02,
  },
  {
    name: 'PBT+GF',
    density: 0.00155,
    price: 0.018,
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
    name: 'PCTG',
    density: 0.0012,
    price: 0.03,
  },
  {
    name: 'PET',
    density: 0.0014,
    price: 0.016,
  },
  {
    name: 'PLA',
    density: 0.0013,
    price: 0.04,
  },
  {
    name: 'PMMA',
    density: 0.0012,
    price: 0.023,
  },
  {
    name: 'POM',
    density: 0.00145,
    price: 0.02,
  },
  {
    name: 'PP',
    density: 0.001,
    price: 0.011,
  },
  {
    name: 'PP-EPDM',
    density: 0.0011,
    price: 0.022,
  },
  {
    name: 'PP-GF',
    density: 0.00125,
    price: 0.012,
  },
  {
    name: 'PPO',
    density: 0.0011,
    price: 0.03,
  },
  {
    name: 'PPS',
    density: 0.0014,
    price: 0.072,
  },
  {
    name: 'PPSU',
    density: 0.0013,
    price: 0.19,
  },
  {
    name: 'PP-TD',
    density: 0.001,
    price: 0.018,
  },
  {
    name: 'PVC',
    density: 0.0014,
    price: 0.018,
  },
  {
    name: 'SAN',
    density: 0.0011,
    price: 0.019,
  },
  {
    name: 'TPE',
    density: 0.0012,
    price: 0.025,
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
] as const;

const moldMaterialList = [
  {
    name: 'NAK80',
    density: 0.00000785,
    price: 0.013,
  },
  {
    name: '718H',
    density: 0.00000785,
    price: 0.013,
  },
  {
    name: 'P20',
    density: 0.00000785,
    price: 0.013,
  },
  {
    name: 'H13',
    density: 0.00000785,
    price: 0.013,
  },
  {
    name: 'S136',
    density: 0.00000785,
    price: 0.013,
  },
] as const;

const machineList = [
  {
    name: '120T',
    injectionVolume: 153,
    moldWidth: 360,
    moldHeight: 380,
    machiningFee: 1.2,
  },
  {
    name: '150T',
    injectionVolume: 260,
    moldWidth: 425,
    moldHeight: 450,
    machiningFee: 1.5,
  },
  {
    name: '170T',
    injectionVolume: 300,
    moldWidth: 470,
    moldHeight: 520,
    machiningFee: 1.8,
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
    name: '450T',
    injectionVolume: 1700,
    moldWidth: 740,
    moldHeight: 700,
    machiningFee: 6,
  },
  {
    name: '500T',
    injectionVolume: 2100,
    moldWidth: 780,
    moldHeight: 750,
    machiningFee: 7,
  },
  {
    name: '550T',
    injectionVolume: 2400,
    moldWidth: 820,
    moldHeight: 800,
    machiningFee: 8,
  },
  {
    name: '650T',
    injectionVolume: 2446,
    moldWidth: 930,
    moldHeight: 900,
    machiningFee: 10,
  },
  {
    name: '800T',
    injectionVolume: 3468,
    moldWidth: 1000,
    moldHeight: 1000,
    machiningFee: 15,
  },
  {
    name: '1100T',
    injectionVolume: 4636,
    moldWidth: 1160,
    moldHeight: 1160,
    machiningFee: 20,
  },
  {
    name: '1850T',
    injectionVolume: 7339,
    moldWidth: 1550,
    moldHeight: 1650,
    machiningFee: 35,
  },
] as const;

const fixedLossRate = 1.1; // 固定损耗率，TODO：未来根据颜色会有不同
const defaultMoldMaterialDensity = 0.00000785;

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
  { maxWeight: 1100, price: 20000 },
  { maxWeight: 1200, price: 20500 },
  { maxWeight: 1300, price: 21000 },
  { maxWeight: 1400, price: 21500 },
  { maxWeight: 1500, price: 22000 },
  { maxWeight: 1600, price: 22500 },
  { maxWeight: 1700, price: 23000 },
  { maxWeight: 1800, price: 23500 },
  { maxWeight: 1900, price: 24000 },
  { maxWeight: 2000, price: 24500 },
  { maxWeight: 2100, price: 25000 },
  { maxWeight: 2200, price: 25500 },
  { maxWeight: 2300, price: 26000 },
  { maxWeight: 2400, price: 26500 },
  { maxWeight: 2500, price: 27000 },
  { maxWeight: 2600, price: 27500 },
  { maxWeight: 2700, price: 28000 },
  { maxWeight: 2800, price: 28500 },
  { maxWeight: 2900, price: 29000 },
  { maxWeight: 3000, price: 29500 },
  { maxWeight: 3100, price: 30000 },
  { maxWeight: 3200, price: 30500 },
  { maxWeight: 3300, price: 31000 },
  { maxWeight: 3400, price: 31500 },
  { maxWeight: 3500, price: 32000 },
  { maxWeight: 3600, price: 32500 },
  { maxWeight: 3700, price: 33000 },
  { maxWeight: 3800, price: 33500 },
  { maxWeight: 3900, price: 34000 },
  { maxWeight: 4000, price: 34500 },
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
  { maxLength: 150, spacing: 60 },
  { maxLength: 200, spacing: 65 },
  { maxLength: 250, spacing: 70 },
  { maxLength: 300, spacing: 75 },
  { maxLength: 350, spacing: 80 },
  { maxLength: 400, spacing: 85 },
  { maxLength: 450, spacing: 90 },
  { maxLength: 500, spacing: 95 },
  { maxLength: 550, spacing: 100 },
  { maxLength: 600, spacing: 105 },
  { maxLength: 650, spacing: 110 },
  { maxLength: 700, spacing: 115 },
  { maxLength: 750, spacing: 120 },
  { maxLength: 800, spacing: 125 },
  { maxLength: 850, spacing: 130 },
  { maxLength: 900, spacing: 135 },
  { maxLength: 950, spacing: 140 },
  { maxLength: 1000, spacing: 145 },
  { maxLength: 2000, spacing: -1 },
] as const;

const moldStructureHeightRules = [
  { maxHeight: 50, height: 210 },
  { maxHeight: 60, height: 230 },
  { maxHeight: 70, height: 250 },
  { maxHeight: 90, height: 270 },
  { maxHeight: 100, height: 290 },
  { maxHeight: 110, height: 310 },
  { maxHeight: 120, height: 330 },
  { maxHeight: 140, height: 350 },
  { maxHeight: 150, height: 370 },
  { maxHeight: 160, height: 390 },
  { maxHeight: 170, height: 410 },
  { maxHeight: 180, height: 430 },
  { maxHeight: 190, height: 450 },
  { maxHeight: 200, height: 470 },
  { maxHeight: 210, height: 490 },
] as const;

const productGroupLengthDifference = 200;  //定义产品分组方案的长度差
const productGroupWidthDifference = 200;  //定义产品分组方案的宽度差
const productGroupHeightDifference = 100;  //定义产品分组方案的高度差

const productGroupLengthLimit = 300;  //定义产品分组方案的长度限制
const productGroupWidthLimit = 300;  //定义产品分组方案的宽度限制

const productGroupQuantityLimit = 5000;  //定义产品分组方案的数量限制

const productGroupWeightMinLimit = 100;  //定义最小的产品重量标准
const productGroupWeightDifferenceMinLimit = 50;  //定义产品重量差的最小值  

const productGroupWeightDifferenceList = [
  { minWeight: 100, difference: 100 },
  { minWeight: 300, difference: 150 },
  { minWeight: 600, difference: 200 },
  { minWeight: 900, difference: 250 },
  { minWeight: 1200, difference: 300 },
  { minWeight: 1500, difference: 350 },
  { minWeight: 1800, difference: 400 },
  { minWeight: 2100, difference: 450 },
  { minWeight: 2400, difference: 500 },
  { minWeight: 2700, difference: 550 },
  { minWeight: 3000, difference: 0 },
];  //定义产品重量差的最大值

export {
  materialList,
  moldMaterialList,
  machineList,
  fixedLossRate,
  defaultMoldMaterialDensity,
  marginSpaceRules,
  borderSpaceRules,
  moldStructureHeightRules,
  moldPriceSolutionOneRules,
  moldPriceSolutionTwoRules,
};
