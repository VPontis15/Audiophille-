export default function DashboardSingleProduct(): React.ReactElement {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Product Name</h1>
        <p className="text-sm text-gray-500">Product description goes here.</p>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Product Details</h2>
        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-500">Price: $100</span>
          <span className="text-sm text-gray-500">Stock: 50</span>
        </div>
      </div>
    </div>
  );
}
