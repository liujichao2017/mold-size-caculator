import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const INITIAL_DATA = {
  moldConstants: [
    {  constantName: 'profitCoefficient', constantValue: 1.5, constantDescription: '利润系数' },
    // ... 其他初始数据
  ],
  // 其他表的初始数据
  materialList: [
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
    }
  ],
  machineList: [
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
    }
  ],
  operatingExpenseList: [
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
  ],
  exportPriceList: [
    { maxWeight: 100, coefficient: 1.3 },
    { maxWeight: 200, coefficient: 1.28 },
    { maxWeight: 300, coefficient: 1.26 },
    { maxWeight: 400, coefficient: 1.24 },
    { maxWeight: 500, coefficient: 1.22 },
    { maxWeight: 600, coefficient: 1.2 },
    { maxWeight: 700, coefficient: 1.18 },
    { maxWeight: 800, coefficient: 1.16 },
    { maxWeight: 900, coefficient: 1.14 },
    { maxWeight: 1000, coefficient: 1.12 },
    { maxWeight: 9999, coefficient: 1.1 },
  ],
  moldPriceDifferList: [
    { name: 'P20', coefficient: 0 },
    { name: 'NAK80', coefficient: 15 },
    { name: '718H', coefficient: 5 },
    { name: 'H13', coefficient: 25 },
    { name: 'S136', coefficient: 25 },
  ],
}

async function main() {
  try {
    // 初始化模具常量数据
    for (const constant of INITIAL_DATA.moldConstants) {
      await prisma.moldConstantSetting.upsert({
        where: {
          constantName: constant.constantName,
        },
        update: {}, // 如果存在则不更新
        create: {
          constantName: constant.constantName,
          constantValue: constant.constantValue,
          isDeleted: 0,
          constantDescription: constant.constantDescription,
        },
      })
    }
    // 初始化原材料数据
    for (const material of INITIAL_DATA.materialList) {
      await prisma.materialPriceSetting.upsert({
        where: {
          name: material.name,
        },
        update: {}, // 如果存在则不更新
        create: {
          density: material.density,
          price: material.price,
          isDeleted: 0,
          name: material.name,
        },
      })
    }
    // 初始化机器加工费数据
    for (const machine of INITIAL_DATA.machineList) {
      await prisma.machinePriceSetting.upsert({
        where: {
          name: machine.name,
        },  
        update: {}, // 如果存在则不更新
        create: {
          name: machine.name,
          injectionVolume: machine.injectionVolume,
          machiningFee: machine.machiningFee,
          moldWidth: machine.moldWidth,
          moldHeight: machine.moldHeight,
          isDeleted: 0,
        },
      })
    }
    // 初始化模具价格差异系数数据
    for (const moldPriceDiffer of INITIAL_DATA.moldPriceDifferList) {
      await prisma.moldPriceDifferSetting.upsert({
        where: {
          name: moldPriceDiffer.name,
        },
        update: {}, // 如果存在则不更新
        create: {
          name: moldPriceDiffer.name,
          coefficient: moldPriceDiffer.coefficient,
          deleted: 0,
        },
      })
    }
    // 初始化运营费用数据
    for (const operatingExpense of INITIAL_DATA.operatingExpenseList) {
      await prisma.moldOperatingExpenseSetting.upsert({
        where: {
          maxWeight: operatingExpense.maxWeight,
        },
        update: {}, // 如果存在则不更新
        create: {
          maxWeight: operatingExpense.maxWeight,
          price: operatingExpense.price,
          isDeleted: 0,
        },
      })
    }
    // 初始化出口价格系数数据
    for (const exportPrice of INITIAL_DATA.exportPriceList) {
      await prisma.moldExportPriceSetting.upsert({
        where: {
          maxWeight: exportPrice.maxWeight,
        },
        update: {}, // 如果存在则不更新
        create: {
          maxWeight: exportPrice.maxWeight,
          coefficient: exportPrice.coefficient,
          isDeleted: 0,
        },
      })
    }
    console.log('Seed completed successfully')
  } catch (error) {
    console.error('Seed error:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    void prisma.$disconnect()
  })
