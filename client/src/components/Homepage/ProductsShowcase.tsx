import Button from '../utils/Button';
import ZSpeakerDesktop from '../../assets/desktop/image-speaker-zx9.png';
import ZSpeakerTablet from '../../assets/tablet/image-speaker-zx9.png';
import ZSpeakerMobile from '../../assets/mobile/image-speaker-zx9.png';
import circlePattern from '../../assets/pattern-circles.svg';
import zx7Speaker from '../../assets/desktop/image-speaker-zx7.jpg';
import zx7SpeakerTablet from '../../assets/tablet/image-speaker-zx7.jpg';
import zx7SpeakerMobile from '../../assets/mobile/image-speaker-zx7.jpg';
export default function ProductsShowcase(): React.ReactElement {
  return (
    <section className="max-w-container mx-auto mb-24 grid gap-12">
      <div className="md:h-[536px] circle-pattern bg-accent rounded-xl relative grid place-items-center  md:grid-cols-[50%_50%] text-white ">
        <div className="relative pt-13 md:pt-0 md:overflow-hidden grid place-items-center mb-16 md:mb-0 h-full w-full">
          <img
            className="absolute  w-[335px] top-0.5 z-0"
            src={circlePattern}
            alt=""
          />
          <picture>
            <source media="(max-width: 550px)" srcSet={ZSpeakerMobile} />
            <source media="(max-width: 850px)" srcSet={ZSpeakerTablet} />

            <img
              width={410}
              height={410}
              src={ZSpeakerDesktop}
              className=" max-w-[200px] z-10 md:max-w-[410px] object-cover md:w-full md:absolute md:-bottom-3 md:left-[20%]"
              alt="ZX9 speaker"
            />
          </picture>
        </div>
        <div className="space-y-6 relative text-center pb-16 md:pb-0 z-10">
          <h2 className="text-h1 max-w-[9ch] uppercase leading-[1] font-bold">
            ZX9 speaker
          </h2>
          <p className="max-w-[30ch] ">
            Upgrade to premium speakers that are phenomenally built to deliver
            truly remarkable sound.
          </p>
          <Button to="/products/earphones/zx9-speaker" secondary>
            See Product
          </Button>
        </div>
      </div>
      <div className="h-[320px] relative rounded-xl  w-full object-cover pl-8 md:pl-24">
        <div className="absolute inset-0 -z-10 w-full  overflow-hidden">
          <picture>
            <source media="(max-width: 550px)" srcSet={zx7SpeakerMobile} />
            <source
              media="(max-width: 850px) and (min-width: 551px)"
              srcSet={zx7SpeakerTablet}
            />
            <img
              fetchPriority="high"
              className="w-full h-full object-cover "
              width={410}
              height={410}
              src={zx7Speaker}
              alt="Hero background"
              aria-hidden="true"
            />
          </picture>
        </div>
        <div className="gap-4 md:gap-8 flex flex-col pt-24 h-full items-start">
          <h4 className="text-h4  uppercase font-bold leading-[1]">
            ZX7 speaker
          </h4>
          <Button to="/products/earphones/zx7-speaker" secondary>
            See Product
          </Button>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-7.5">
        <div className=" h-[320px] rounded-xl earphones w-full object-cover" />
        <div className="">
          <div className=" flex flex-col  h-full items-start justify-center gap-8 rounded-xl  bg-grey pl-8 py-12 ">
            <h4 className="text-h4  uppercase font-bold leading-[1]">
              YX1 earphones
            </h4>
            <Button to="/products/earphones/yx1-earphones" secondary>
              See Product
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
