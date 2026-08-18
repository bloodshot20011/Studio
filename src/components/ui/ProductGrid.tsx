import { Product } from "@/types";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-gutter">
      {products.map((product) => (
        <div key={product.id} className="break-inside-avoid mb-gutter">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
