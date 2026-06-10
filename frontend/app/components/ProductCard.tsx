"use client";

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  category: string;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-all duration-200">
      <div className="h-52 overflow-hidden bg-white flex items-center justify-center p-6">
        <img
          src={product.image}
          alt={product.title}
          className="max-h-full w-auto object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="p-4 border-t border-gray-100">
        <span className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">
          {product.category}
        </span>
        <h3 className="font-medium text-sm text-gray-900 mt-1 line-clamp-1">
          {product.title}
        </h3>
        <p className="text-gray-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        <p className="text-gray-900 font-semibold text-sm mt-3">
          ${product.price}
        </p>
      </div>
    </div>
  );
}
