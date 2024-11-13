import { db } from "./prisma";
import { type MoldConstantSettingItem } from "./validations/mold-constant";
import { type MoldPriceDifferSettingItem } from "./validations/mold-price-differ";
import { type MoldOperatingExpenseSettingItem } from "./validations/mold-operating-expense";
import { type MachinePriceSettingItem } from "./validations/machine-price";
import { type MaterialPriceSettingItem } from "./validations/material";
  

const getMoldPriceDifferSettingList = async (): Promise<MoldPriceDifferSettingItem[]> => {
  try {
    // 获取模具价格差异
    const moldPriceSolutionAllRules = await db.moldPriceDifferSetting.findMany({
      where: {
        deleted: 0,
      },
      select:{
        name: true,
        coefficient: true
      },
      
    });
    // 转换为所需格式
    const convertedPriceDifferRules = moldPriceSolutionAllRules.map(rule => ({
      name: rule.name,
      coefficient: rule.coefficient
    }));
    return convertedPriceDifferRules;

  } catch (error) {
    console.error(error);
    return [];
  }
};

const getMoldOperatingExpenseSettingList = async (): Promise<MoldOperatingExpenseSettingItem[]> => {
  try {
    const moldOperatingExpenseAllRules = await db.moldOperatingExpenseSetting.findMany({
      where: {
        isDeleted: 0,
      },
      select:{
        maxWeight: true,
        price: true
      },
      orderBy: {
        maxWeight: 'asc',
      },
    });
    // 转换为所需格式
    const convertedOperatingExpenseRules = moldOperatingExpenseAllRules.map(rule => ({
      maxWeight: rule.maxWeight,
      price: rule.price
    }));
    return convertedOperatingExpenseRules;

  } catch (error) {
    console.error(error);
    return [];
  }
};

const getMachinePriceSettingList = async (): Promise<MachinePriceSettingItem[]> => {
  try {
    const machinePriceAllRules = await db.machinePriceSetting.findMany({
      where: {
        isDeleted: 0,
      },
      select:{
        name: true,
        injectionVolume: true,
        moldWidth: true,
        moldHeight: true,
        machiningFee: true
      },
      orderBy: {
        name: 'asc',
      },
    });
    // 转换为所需格式
    const convertedMachinePriceRules = machinePriceAllRules.map(rule => ({
      name: rule.name,
      injectionVolume: Number(rule.injectionVolume),
      moldWidth: Number(rule.moldWidth),
      moldHeight: Number(rule.moldHeight),
      machiningFee: Number(rule.machiningFee)
    }));
    return convertedMachinePriceRules;

  } catch (error) {
    console.error(error);
    return [];
  }
};

const getMaterialPriceSettingList = async (): Promise<MaterialPriceSettingItem[]> => {
  try {
    const materialPriceAllRules = await db.materialPriceSetting.findMany({
      where: {
        isDeleted: 0,
      },
      select:{
        name: true,
        density: true,
        price: true
      },
      orderBy: {
        name: 'asc',
      },
    });
    // 转换为所需格式
    const convertedMaterialPriceRules = materialPriceAllRules.map(rule => ({
      name: rule.name,
      density: Number(rule.density),
      price: Number(rule.price)
    }));
    return convertedMaterialPriceRules;

  } catch (error) {
    console.error(error);
    return [];
  }
};

const getMoldConstantSettingList = async (): Promise<MoldConstantSettingItem[]> => {
  try {
    const moldConstantAllRules = await db.moldConstantSetting.findMany({
      where: {
        isDeleted: 0,
      },
      select:{
        constantName: true,
        constantValue: true
      },
      
    });
    // 转换为所需格式
    const convertedMoldConstantRules = moldConstantAllRules.map(rule => ({
      constantName: rule.constantName,
      constantValue: Number(rule.constantValue)
    }));
    return convertedMoldConstantRules;

  } catch (error) {
    console.error(error);
    return [];
  }
};

export 
{ 
  getMoldPriceDifferSettingList,
  getMoldOperatingExpenseSettingList,
  getMachinePriceSettingList,
  getMaterialPriceSettingList,
  getMoldConstantSettingList
};
