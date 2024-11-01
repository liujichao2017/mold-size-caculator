'use client';

import { useState } from 'react';
import { calculateMoldSize, Mold, Product } from './moldCalculator';

export default function MoldTest() {
  const [inputJson, setInputJson] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [moldLayout, setMoldLayout] = useState<Mold | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputJson(e.target.value);
  };

  const extractDimensions = (
    products: any[] //定义类型
  ): Array<Pick<Product, 'length' | 'width' | 'height'>> => {
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

      setProducts(dimensionsArray);
      alert('JSON parsed ok.');
    } catch (error) {
      console.log(error);
      alert('Invalid JSON input. Please check your input and try again.');
    }
  };

  const calculate = () => {
    if (products.length === 0) {
      alert('No products to calculate. Please input some products.');
      return;
    }
    const result = calculateMoldSize(products);
    setMoldLayout(result);
  };

  return (
    <div className="flex-col w-1/2 items-center mx-auto">
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
            Minimum mold size: {moldLayout.moldLength} x {moldLayout.moldWidth}{' '}
            = {moldLayout.moldLength * moldLayout.moldWidth} mm²
          </p>
          <p>Minimum mold height: {moldLayout.moldHeight} mm</p>
          <p>
            Mold Volume:{' '}
            {moldLayout.moldWidth *
              moldLayout.moldLength *
              moldLayout.moldHeight}{' '}
            mm³
          </p>
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
    </div>
  );
}
