export default function SignupImage(): React.ReactElement {
  return (
    <div className="relative  signup-bg-wrapper ">
      <img
        src="/images/signup-bg.webp"
        alt="Signup Background"
        className="block w-full h-100 aspect-video md:h-screen   object-cover "
      />
      <div className="signup-overlay grid place-items-center"></div>
    </div>
  );
}
