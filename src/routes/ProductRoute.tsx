import { useParams } from 'react-router';
import data from '../data/data.json';
import { ProductProps } from '../components/utils/Product';
import BreadCrumps from '../components/utils/BreadCrumps';
import Button from '../components/utils/Button';
import productImg from '../assets/desktop/product-yx1-earphones/image-product.jpg';

export default function ProductRoute(): React.ReactElement {
  const { slug } = useParams<{ slug: string }>();
  const product = data.find((product) => product.slug === slug) as ProductProps;

  return (
    <div className="max-w-container mx-auto product-wrapper space-y-40">
      <BreadCrumps />
      <div className="grid grid-cols-2 mt-20 gap-31.5">
        <img src={productImg} alt="" className="h-[560px]" />
        <div className="flex flex-col justify-center">
          {product.new && (
            <span className="text-hover  inline-block mb-4 text-sm font-bold uppercase tracking-[10px]">
              New Product
            </span>
          )}
          <h2 className="text-h2 tracking-[1.41px] font-bold mb-8 leading-[1.1]">
            {product?.name}
          </h2>
          <p className="opacity-50 mb-8">{product.description}</p>
          <span className="text-h6 inline-block font-bold mb-12">
            ${product.price}
          </span>
          <div className="flex gap-4 items-center">
            <div className="bg-grey">
              <button className="p-4">&minus;</button>
              <span className="font-bold inline-block p-4">1</span>
              <button className="p-4">+</button>
            </div>
            <Button className="uppercase" primary>
              Add to cart
            </Button>
          </div>
        </div>
      </div>
      <section className="flex mt-40 gap-31.5">
        <div>
          <h3 className="font-bold tracking-[1.14px] uppercase text-h3 mb-8">
            Features
          </h3>
          <p className="opacity-50 max-w-[68ch]">{product.features}</p>
        </div>
        <div>
          <h3 className="font-bold tracking-[1.14px] uppercase text-h3 mb-8">
            In the box
          </h3>
          <div className="flex flex-col gap-2">
            {product?.includes?.map((item, index) => (
              <p className="inline-flex gap-6 items-center" key={index}>
                <span className="text-accent  font-bold">{item.quantity}x</span>
                <span className=" opacity-50 gap-6 capitalize">
                  {item.item}
                </span>
              </p>
            ))}
          </div>
        </div>
      </section>
      <section className="max-w-container mx-auto">
        <div className="flex items-center gap-8">
          <div className=" grid gap-8">
            <img
              className=" h-[280px] w-[445px] rounded-md object-cover"
              src={productImg}
              alt=""
            />
            <img
              className=" h-[280px] w-[445px] rounded-md object-cover"
              src={productImg}
              alt=""
            />
          </div>
          <img
            className="w-[635px] h-[592px] rounded-md "
            src={productImg}
            alt=""
          />
        </div>
      </section>
      <section></section>
    </div>
  );
}
