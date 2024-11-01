'use client';

import { useState } from 'react';
import { calculateMoldPrice, calculateMoldSize } from './moldCalculator';
import { Mold, Product, ProductDimensions } from './type';

export default function MoldTest() {
  const [loading, setLoading] = useState(false);
  const [inputJson, setInputJson] = useState<string>('');
  const [moldMaterial, setMoldMaterial] = useState<string>('');
  const [productDimensions, setProductDimensions] = useState<
    ProductDimensions[]
  >([]);
  const [moldLayout, setMoldLayout] = useState<Mold | null>(null);

  const [moldPrice, setMoldPrice] = useState<number>(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputJson(e.target.value);
  };

  const extractDimensions = (
    products: Product[] //定义类型
  ): Array<Pick<ProductDimensions, 'length' | 'width' | 'height'>> => {
    return products.map((item) => ({
      length: item.dimensions.length,
      width: item.dimensions.width,
      height: item.dimensions.height,
    }));
  };

  const parseProducts = () => {
    try {
      const parsedData = JSON.parse(inputJson);

      const parsedProducts = parsedData.products;
      console.log('parsedProducts: ', parsedProducts);
      const dimensionsArray = extractDimensions(parsedProducts);
      //获取模具的材料
      setMoldMaterial(parsedData.mold.moldMaterial);
      setProductDimensions(dimensionsArray);
      alert('JSON parsed ok.');
    } catch (error) {
      console.log(error);
      alert('Invalid JSON input. Please check your input and try again.');
    }
  };

  const calculate = async () => {
    if (productDimensions.length === 0) {
      alert('No products to calculate. Please input some products.');
      return;
    }
    try {
      setLoading(true);
      const result = calculateMoldSize(productDimensions, moldMaterial);
      const price = await calculateMoldPrice(result);
      setMoldLayout(result);
      setMoldPrice(price);
    } catch (error) {
      console.log(error);
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-col w-1/2 items-center mx-auto min-h-screen relative">
      <h1>Mold Layout Calculator</h1>
      <textarea
        rows={10}
        cols={50}
        value={inputJson}
        onChange={handleInputChange}
        placeholder='Enter products as a JSON array, e.g., 
        [{"length":54,"width":85.5,"height":4.5},{"length":48,"width":75.5,"height":20},{"length":50.5,"width":70.5,"height":21.5},{"length":75,"width":75,"height":7.7}]'
      ></textarea>
      <br />
      <button className="bg-amber-500 p-1" onClick={parseProducts}>
        Parse Products
      </button>
      <br />
      <br />

      <button className="bg-amber-500 p-1" onClick={calculate}>
        Calculate Mold Size
      </button>
      {moldLayout && (
        <div>
          <p>
            Minimum mold size: {moldLayout.dimensions.length} x{' '}
            {moldLayout.dimensions.width} ={' '}
            {moldLayout.dimensions.length * moldLayout.dimensions.width} mm²
          </p>
          <p>Minimum mold height: {moldLayout.dimensions.height} mm</p>
          <p>
            Mold Volume:{' '}
            {moldLayout.dimensions.width *
              moldLayout.dimensions.length *
              moldLayout.dimensions.height}{' '}
            mm³
          </p>
          <p>Mold Price: {moldPrice} </p>

          {/* <p>productSpacing: {moldLayout.productSpacing} mm</p>
          <p>moldSpacing: {moldLayout.moldSpacing} mm</p>
          <h1>layout:</h1>
          {moldLayout.layout &&
            moldLayout.layout.map((item, index) => {
              return (
                <div key={index}>
                  <p>layout-row:{item.row + 1}:</p>
                  <p>layout-products: {item.products.length}:</p>
                  {item.products.map((p, index) => {
                    return (
                      <div key={index}>
                        <p>product.length: {p.product.length}</p>
                        <p>product.width: {p.product.width}</p>
                        <p>product.height: {p.product.height}</p>
                        <p>product.orientation: {p.orientation}</p>
                      </div>
                    );
                  })}
                </div>
              );
            })} */}
        </div>
      )}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div className="text-xl text-gray-700">Loading...</div>
        </div>
      )}
    </div>
  );
}
