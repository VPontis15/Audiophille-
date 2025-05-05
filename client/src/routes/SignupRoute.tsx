import Button from '../components/utils/Button';

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

      <div className="flex flex-col gap-4 items-center justify-center h-screen ">
        <h2 className="bg-gradient-to-r from-accent to-hover bg-clip-text text-5xl font-extrabold  text-transparent ">
          Audiophile
        </h2>
        <p className="text-sm max-w-[60ch] text-center">
          Signup to create an account and enjoy exclusive offers and discounts
          on our products. Join our community of audiophiles and experience the
          best in sound quality.
        </p>
        <form className="bg-white p-6 rounded shadow-md w-full max-w-sm">
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>
          <Button type="submit" primary className="">
            Signup now
          </Button>
        </form>
      </div>
    </div>
  );
}
