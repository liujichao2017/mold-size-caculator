// path: src/types/index.ts

import type { materialList, moldMaterialList } from './constants';

type ProductDimensions = {
  length: number;
  width: number;
  height: number;
};

type Product = {
  productId: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
    volume: number;
  };
  productMaterial: (typeof materialList)[number]['name'];
};

type Mold = {
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  weight: number;
  cavityCount: number;
  moldMaterial: (typeof moldMaterialList)[number]['name'];
};

type Machine = {
  name: string;
  injectionVolume: number;
  moldWidth: number;
  moldHeight: number;
  machiningFee: number;
};

type Quote = {
  unit: string;
  products: Product[];
  mold: Mold;
};

type MockQuote = {
  unit: string;
  products: Product[];
  mold: Mold;
};

type ServerResponse = {
  product: {
    name: string;
    rawMaterialPrice: number;
    processingFee: number;
  }[];
  mold: {
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
  };
  machine: {
    name: string;
    injectionVolume: number;
    moldWidth: number;
    moldHeight: number;
  };
  totalProductsFee: number;
  totalprocessingFee: number;
  moldFee: number;
  totalFee: number;
};

export type {
  Product,
  ProductDimensions,
  Mold,
  Machine,
  Quote,
  MockQuote,
  ServerResponse,
};
