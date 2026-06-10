import CardGrid from "./components/CardGrid";

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Products</h1>
        <p className="text-sm text-gray-500 mb-8">Browse our collection</p>
        <CardGrid />
      </div>
    </main>
  );
}
