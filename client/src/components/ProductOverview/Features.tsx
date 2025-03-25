import { ProductOverviewProps } from '../../types/ProductTypes';

export default function Features({
  product,
}: ProductOverviewProps): React.ReactElement {
  return (
    <section className="flex flex-col md:flex-row mt-40 gap-31.5">
      <div>
        <h3 className="font-bold tracking-[1.14px] uppercase text-h3 mb-8">
          Features
        </h3>
        <p className="opacity-50 md:max-w-[68ch]">{product.features}</p>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between md:flex-col md:justify-start">
        <h3 className="font-bold tracking-[1.14px] uppercase text-h3 mb-8">
          In the box
        </h3>
        <div className="flex flex-col gap-2">
          {product?.includes?.map((item, index) => (
            <p className="inline-flex gap-6 items-center" key={index}>
              <span className="text-accent  font-bold">{item.quantity}x</span>
              <span className=" opacity-50 gap-6 capitalize">{item.item}</span>
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
