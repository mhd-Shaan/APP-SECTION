import ProductCard from './ProductCard';

const ProductGrid = () => {
  const products = new Array(12).fill({
    name: 'Engine Oil',
    price: 599,
    image: '/engine-oil.png', // sample image path
  });

  return (
    <div className="grid grid-cols-4 gap-4">
      {products.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
