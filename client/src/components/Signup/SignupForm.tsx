import { useState } from 'react';
import Button from '../utils/Button';
import ErrorMessage from '../utils/ErrorMessage';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import API from '../../api/API';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router';
const errorStyle =
  'mt-2 self-start justify-self-start px-4 py-1 absolute top-0 ';

const inputStyle = `border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-accent`;

export default function SignupForm(): React.ReactElement {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [passwordInputType, setPasswordInputType] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPasswordInputType, setConfirmPasswordInputType] =
    useState('password');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessages, setErrorMessages] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();
  const api = new API();

  const signupMutation = useMutation({
    mutationFn: (userData: {
      name: string;
      email: string;
      password: string;
      confirmedPassword: string;
    }) => {
      setIsLoading(true);
      return api.singUp('users/signup', userData);
    },
    onSuccess: () => {
      navigate('/');
      toast.success(
        'Signup successful! Please check your email for verification.'
      );
      // Reset form fields if needed
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setIsLoading(false);
      // Redirect to the homepage
    },
    onError: (error: AxiosError) => {
      // Use 'any' or create a proper type for the error
      console.error('Error during signup:', error);

      // Check if it's an Axios error with a response from the server
      if (error.response && error.response.data) {
        // Extract the error message from the server response
        const serverErrorMessage =
          error.response.data.message || 'Signup failed';
        toast.error(serverErrorMessage);
      } else {
        // Fallback to the generic error message
        toast.error(error.message);
      }
      setIsLoading(false);
    },
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);

    // Check validation during typing
    if (value.length > 0 && value.length >= 3) {
      setErrorMessages((prev) => ({
        ...prev,
        name: '',
      }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (!value) {
      setErrorMessages((prev) => ({
        ...prev,
        email: 'Email is required',
      }));
    }
    if (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)) {
      setErrorMessages((prev) => ({
        ...prev,
        email: '',
      }));
    }
  };

  const handleEmailBlur = () => {
    // Validate on blur
    if (!email) {
      setErrorMessages((prev) => ({
        ...prev,
        email: 'Email is required',
      }));
    } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
      setErrorMessages((prev) => ({
        ...prev,
        email: 'Please enter a valid email address',
      }));
    } else {
      setErrorMessages((prev) => ({
        ...prev,
        email: '',
      }));
    }
  };

  const handlePasswordBlur = () => {
    // Validate on blur
    if (password.length < 8 && password.length > 0) {
      setErrorMessages((prev) => ({
        ...prev,
        password: 'Password must be at least 8 characters',
      }));
    } else if (!password) {
      setErrorMessages((prev) => ({
        ...prev,
        password: 'Password is required',
      }));
    } else {
      setErrorMessages((prev) => ({
        ...prev,
        password: '',
      }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (e.target.value.length >= 8) {
      setErrorMessages((prev) => ({
        ...prev,
        password: '',
      }));
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  const handleNameBlur = () => {
    // Validate on blur
    if (name.length < 3 && name.length > 0) {
      setErrorMessages((prev) => ({
        ...prev,
        name: 'Name must be at least 3 characters',
      }));
    } else if (!name) {
      setErrorMessages((prev) => ({
        ...prev,
        name: 'Name is required',
      }));
    } else {
      setErrorMessages((prev) => ({
        ...prev,
        name: '',
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
    setPasswordInputType((prev) => (prev === 'password' ? 'text' : 'password'));
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
    setConfirmPasswordInputType((prev) =>
      prev === 'password' ? 'text' : 'password'
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields before submission
    let hasErrors = false;
    const newErrorMessages = { ...errorMessages };

    // Validate name
    if (!name || name.length < 3) {
      newErrorMessages.name = !name
        ? 'Name is required'
        : 'Name must be at least 3 characters';
      hasErrors = true;
    } else {
      newErrorMessages.name = '';
    }

    // Validate email
    if (!email) {
      newErrorMessages.email = 'Email is required';
      hasErrors = true;
    } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
      newErrorMessages.email = 'Please enter a valid email address';
      hasErrors = true;
    } else {
      newErrorMessages.email = '';
    }

    // Validate password
    if (!password) {
      newErrorMessages.password = 'Password is required';
      hasErrors = true;
    } else if (password.length < 8) {
      newErrorMessages.password = 'Password must be at least 8 characters';
      hasErrors = true;
    } else {
      newErrorMessages.password = '';
    }

    // Validate confirm password
    if (!confirmPassword) {
      newErrorMessages.confirmPassword = 'Confirm Password is required';
      hasErrors = true;
    } else if (password !== confirmPassword) {
      newErrorMessages.confirmPassword = 'Passwords do not match';
      hasErrors = true;
    } else {
      newErrorMessages.confirmPassword = '';
    }

    // Update error messages
    setErrorMessages(newErrorMessages);

    // If there are errors, don't proceed
    if (hasErrors) {
      return;
    }

    // Execute the mutation
    signupMutation.mutate({
      name,
      email,
      password,
      confirmedPassword: confirmPassword,
    });
  };

  return (
    <div className="flex flex-col px-8 max-w-lg mx-auto md:max-w-full  md:pr-8 gap-8 items-center justify-start py-10 md:pt-0 md:justify-center md:h-screen">
      <div className="flex flex-col gap-3 items-center">
        <h2 className="bg-gradient-to-r from-accent to-hover bg-clip-text text-5xl font-extrabold text-transparent">
          Audiophile
        </h2>
        <p className="text-sm max-w-[60ch] text-center">
          Signup to create an account and enjoy exclusive offers and discounts
          on our products. Join our community of audiophiles and experience the
          best in sound quality.
        </p>
      </div>

      <form
        onSubmit={(e) => handleSubmit(e)}
        className="bg-white grid gap-4 p-6 rounded-md shadow-md w-full max-w-2xl"
      >
        <div className="grid gap-1 relative">
          <label htmlFor="name" className="block capitalize text-text mb-2">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            id="name"
            className={inputStyle}
            required
          />

          <ErrorMessage isVisible={!!errorMessages.name} className={errorStyle}>
            {errorMessages.name}
          </ErrorMessage>
        </div>

        <div className="mb-4 relative">
          <label
            htmlFor="email"
            className="block capitalize text-gray-700 mb-2"
          >
            Email
          </label>
          <input
            type="email"
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            value={email}
            id="email"
            className={inputStyle}
            required
          />
          <ErrorMessage
            isVisible={!!errorMessages.email}
            className={errorStyle}
          >
            {errorMessages.email}
          </ErrorMessage>
        </div>

        <div className="mb-4 relative">
          <label htmlFor="password" className="block  text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={passwordInputType}
              name="password"
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              value={password}
              id="password"
              className={inputStyle}
              required
            />
            <div
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text cursor-pointer"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </div>
          </div>
          <ErrorMessage
            isVisible={!!errorMessages.password}
            className={errorStyle}
          >
            {errorMessages.password}
          </ErrorMessage>
        </div>

        <div className="mb-4 relative">
          <label
            htmlFor="confirm-password"
            className="block text-gray-700 mb-2"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={confirmPasswordInputType}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              id="confirm-password"
              className={inputStyle}
              required
            />{' '}
            <div
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text cursor-pointer"
            >
              {showConfirmPassword ? (
                <FaEyeSlash size={20} />
              ) : (
                <FaEye size={20} />
              )}
            </div>
          </div>
          <ErrorMessage
            isVisible={!!errorMessages.confirmPassword}
            className={errorStyle}
          >
            {errorMessages.confirmPassword}
          </ErrorMessage>
        </div>

        <Button type="submit" primary className="">
          {isLoading ? 'Signing up...' : 'Signup'}
        </Button>
      </form>
    </div>
  );
}
