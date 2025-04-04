import Button from '../utils/Button';
import heroImage from '../../assets/desktop/image-hero.jpg';
import heroImageTablet from '../../assets/tablet/image-header.jpg';
import heroImageMobile from '../../assets/mobile/image-header.jpg';
import { preload } from 'react-dom';
export default function Hero(): React.ReactElement {
  preload(heroImage, {
    as: 'image',
    imageSrcSet: `${heroImageMobile} 550w, ${heroImageTablet} 850w, ${heroImage} 1024w`,
    imageSizes: '(max-width: 550px) 550px, (max-width: 850px) 850px, 1024px',
  });
  return (
    <>
      <div className="absolute  inset-0 -z-10 w-full h-[95vh] md:h-screen overflow-hidden">
        <picture>
          <source media="(max-width: 550px)" srcSet={heroImageMobile} />
          <source
            media="(max-width: 850px) and (min-width: 551px)"
            srcSet={heroImageTablet}
          />
          <img
            fetchPriority="high"
            className="w-full h-full object-cover "
            src={heroImage}
            alt="Hero background"
            aria-hidden="true"
          />
        </picture>
      </div>
      <div className=" max-w-container min-h-[75vh] md:min-h-[90vh] mx-auto   ">
        <div className="text-white flex flex-col items-center md:items-start pt-24   text-center md:text-left h-full  gap-4 ">
          <p className="text-[14px] opacity-50 uppercase tracking-[10px]">
            {' '}
            New product
          </p>
          <h1 className=" text-[2.25rem] md:text-h1  uppercase max-w-[20ch] leading-[1.2]">
            XX99 Mark II Headphones
          </h1>
          <p className="max-w-[40ch] opacity-50">
            Experience natural, lifelike audio and exceptional build quality
            made for the passionate music enthusiast.
          </p>
          <Button lg className="justify-self-start" primary>
            See Product
          </Button>
        </div>
      </div>
    </>
  );
}
