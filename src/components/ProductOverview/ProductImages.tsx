import productImg from '../../assets/desktop/product-yx1-earphones/image-product.jpg';

export default function ProductImages(): React.ReactElement {
  return (
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
  );
}
