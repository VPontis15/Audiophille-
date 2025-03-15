import Button from '../utils/Button';
import ZSpeakerDesktop from '../../assets/desktop/image-speaker-zx9.png';
import ZSpeakerTablet from '../../assets/tablet/image-speaker-zx9.png';
import ZSpeakerMobile from '../../assets/mobile/image-speaker-zx9.png';

export default function ProductsShowcase(): React.ReactElement {
  return (
    <section className="max-w-container mx-auto mb-24 grid gap-12">
      <div className="h-[536px] circle-pattern bg-accent rounded-xl relative grid place-items-center grid-cols-[50%_50%] text-white ">
        <div className="relative overflow-hidden h-full w-full">
          <img
            srcSet={`${ZSpeakerMobile} 550w, ${ZSpeakerTablet} 1024w, ${ZSpeakerDesktop} 1280w`}
            sizes="(max-width: 550px) 100vw, (max-width: 1024px) 50vw, 50vw"
            src={ZSpeakerDesktop}
            className="max-w-[410px] object-cover w-full absolute -bottom-3 left-[20%]"
            alt="ZX9 speaker"
          />
        </div>
        <div className="space-y-6 relative z-10">
          <h2 className="text-h1 max-w-[9ch] uppercase leading-[1] font-bold">
            ZX9 speaker
          </h2>
          <p className="max-w-[30ch] ">
            Upgrade to premium speakers that are phenomenally built to deliver
            truly remarkable sound.
          </p>
          <Button secondary>See Product</Button>
        </div>
      </div>
      <div className="h-[320px] rounded-xl z7speaker w-full object-cover pl-8 md:pl-24">
        <div className="gap-4 md:gap-8 flex flex-col pt-24 h-full items-start">
          <h4 className="text-h4  uppercase font-bold leading-[1]">
            ZX7 speaker
          </h4>
          <Button secondary>See Product</Button>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-7.5">
        <div className=" h-[320px] rounded-xl earphones w-full object-cover" />
        <div className="">
          <div className=" flex flex-col  h-full items-start justify-center gap-8 rounded-xl  bg-grey pl-8 py-12 ">
            <h4 className="text-h4  uppercase font-bold leading-[1]">
              YX1 earphones
            </h4>
            <Button secondary>See Product</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
