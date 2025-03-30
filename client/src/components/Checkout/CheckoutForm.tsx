import React, { Dispatch, SetStateAction, useState } from 'react';
import FormInput from '../utils/FormInput';
import FormRow from '../utils/FormRow';
import { useNavigate } from 'react-router';

export default function CheckoutForm(): React.ReactElement {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [zip, setZip] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [payment, setPayment] = useState('cash');
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    stateFn: Dispatch<SetStateAction<string>>
  ) => {
    stateFn(e.target.value);
  };

  // const handleResetForm = () => {
  //   setName('');
  //   setEmail('');
  //   setPhone('');
  //   setAddress('');
  //   setZip('');
  //   setCity('');
  //   setCountry('');
  //   setPayment('');
  // };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      name,
      email,
      phone,
      address,
      zip,
      city,
      country,
      payment,
    };
    console.log(data);
    const transactionId = Date.now().toString();
    navigate(`/checkout/${transactionId}/success`);
    // dispatch({
    //   type: 'cart/emptyCart',
    // });
    // handleResetForm();
  };

  return (
    <div className=" pb-12 px-12 bg-white rounded-md w-full ">
      <h1 className="text-h3 uppercase font-bold mb-10 pt-13.5  ">Checkout</h1>
      <form
        onSubmit={(e) => handleSubmit(e)}
        method="post"
        id="checkout-form"
        action=""
      >
        <h6 className="text-small mb-4 text-accent uppercase tracking-[1px]">
          Billing Details
        </h6>
        <FormRow>
          <FormInput
            label="Name"
            name="name"
            type="text"
            placeholder="Alexei Ward"
            value={name}
            required
            onChange={(e) => {
              handleChange(e, setName);
            }}
          />

          <FormInput
            label="Email Adress"
            name="email"
            type="email"
            required
            placeholder="alexei@mail.com"
            value={email}
            onChange={(e) => {
              handleChange(e, setEmail);
            }}
          />
        </FormRow>
        <FormRow>
          <FormInput
            label="Phone Number"
            name="phone"
            type="tel"
            required
            placeholder="+1 202-555-0136"
            value={phone}
            onChange={(e) => {
              handleChange(e, setPhone);
            }}
          />
        </FormRow>
        <h6 className="text-small mb-4 text-accent uppercase tracking-[1px]">
          Shipping Info
        </h6>
        <FormRow>
          <FormInput
            label="Address"
            name="address"
            type="text"
            placeholder="1137 Williams Avenue"
            value={address}
            onChange={(e) => {
              handleChange(e, setAddress);
            }}
            full
          />
        </FormRow>
        <FormRow>
          <FormInput
            label="Zip Code"
            name="zip"
            type="text"
            placeholder="10001"
            value={zip}
            onChange={(e) => {
              handleChange(e, setZip);
            }}
          />
          <FormInput
            label="City"
            name="city"
            type="text"
            placeholder="New York"
            value={city}
            onChange={(e) => {
              handleChange(e, setCity);
            }}
          />
        </FormRow>
        <FormRow>
          <FormInput
            label="Country"
            name="country"
            type="text"
            placeholder="United States"
            value={country}
            onChange={(e) => {
              handleChange(e, setCountry);
            }}
          />
        </FormRow>
        <h6 className="text-small mb-4 text-accent uppercase tracking-[1px]">
          Payment Details
        </h6>
        <div className="grid gap-4 md:gap-0 md:grid-cols-2 ">
          <span className="text-small font-bold">Payment Method</span>
          <div className="flex flex-col gap-4 md:gap-9 ">
            <FormInput
              label="Cash on Delivery"
              name="payment"
              type="radio"
              value="cash"
              onChange={(e) => {
                handleChange(e, setPayment);
              }}
              checked={payment === 'cash'}
              required
            />
            <FormInput
              label="Stripe"
              name="payment"
              type="radio"
              value="stripe"
              onChange={(e) => {
                handleChange(e, setPayment);
              }}
              required
              checked={payment === 'stripe'}
            />
            <FormInput
              label="Viva Wallet"
              name="payment"
              type="radio"
              value="viva"
              checked={payment === 'viva'}
              onChange={(e) => {
                handleChange(e, setPayment);
              }}
              required
            />
          </div>
        </div>
      </form>
    </div>
  );
}
