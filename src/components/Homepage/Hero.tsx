import Button from '../utils/Button';
export default function Hero(): React.ReactElement {
  return (
    <div className=" max-w-container mx-auto items-center justify-center  grid grid-cols-2 ">
      <div className="text-white grid pt-24  self-center h-full  gap-4 ">
        <h3 className="text-[14px] opacity-50 uppercase tracking-[10px]">
          {' '}
          New product
        </h3>
        <h1 className="text-h1 uppercase leading-[1.2]">
          {' '}
          XX99 Mark II Headphones
        </h1>
        <p className="max-w-[40ch] opacity-50">
          Experience natural, lifelike audio and exceptional build quality made
          for the passionate music enthusiast.
        </p>
        <Button className="justify-self-start" primary>
          See Product
        </Button>
      </div>
      <div className="hero-img"></div>
    </div>
  );
}
