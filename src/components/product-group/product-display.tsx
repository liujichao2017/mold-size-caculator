interface ProductDisplayProps {
  product: {
    productMaterial: string;
    productColor: string;
    productVolume: number;
    productLength: number;
    productWidth: number;
    productHeight: number;
    productQuantity: number;
    productWeight: number;
  };
}

export function ProductDisplay({ product }: ProductDisplayProps) {
  return (
    <div className="p-3 bg-muted rounded-lg text-sm">
      <div className="grid grid-cols-3 gap-2">
        <span>Material: {product.productMaterial}</span>
        <span>Color: {product.productColor}</span>
        <span>Volume: {product.productVolume.toLocaleString()} mm³</span>
        <span>Length: {product.productLength} mm</span>
        <span>Width: {product.productWidth} mm</span>
        <span>Height: {product.productHeight} mm</span>
        <span>Quantity: {product.productQuantity.toLocaleString()}</span>
        <span>Weight: {product.productWeight.toLocaleString()} g</span>
        <span className="col-span-1"></span>
      </div>
    </div>
  );
}