import productImg from '../../assets/desktop/product-yx1-earphones/image-product.jpg';

export default function ProductImages(): React.ReactElement {
  return (
    <section className="max-w-container mx-auto">
      <div className="images-grid grid">
        <div className="space-y-7.5">
          <img
            className=" img-1 rounded-md object-cover"
            src={productImg}
            alt=""
          />
          <img
            className=" img-2 rounded-md object-cover"
            src={productImg}
            alt=""
          />
        </div>
        <img
          className=" img-3 rounded-md object-cover "
          src={productImg}
          alt=""
        />
      </div>
    </section>
  );
}
