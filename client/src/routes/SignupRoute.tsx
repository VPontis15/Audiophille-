import SignupForm from '../components/Signup/SignupForm';

export default function SignupRoute(): React.ReactElement {
  return (
    <div className="grid md:grid-cols-2 bg-gray-100">
      <div className="relative signup-bg-wrapper ">
        <img
          src="/images/signup-bg.webp"
          alt="Signup Background"
          className="hidden md:block w-full h-screen  object-cover "
        />
        <div className="signup-overlay grid place-items-center"></div>
      </div>
      <SignupForm />
    </div>
  );
}
