import SignupForm from '../components/Signup/SignupForm';
import SignupImage from '../components/Signup/SignupImage';

export default function SignupRoute(): React.ReactElement {
  return (
    <div className="grid md:grid-cols-2 md:gap-4 bg-gray-100">
      <SignupImage />
      <SignupForm />
    </div>
  );
}
