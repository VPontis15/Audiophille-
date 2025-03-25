import axios from 'axios';
const CREATE_ORDER_URL = import.meta.env.VITE_VIVA_URL + '/checkout/v2/orders';

interface Customer {
  email: string;
  name: string;
  phone: string;
  country: string;
}

export async function createPaymentOrder(
  amount: number,
  customer: Customer
): Promise<string> {
  const formData = {
    amount: amount,
    customerTrns:
      'Thank you for shopping with us. Your order will be shipped soon.',
    customer: {
      email: customer.email,
      fullName: customer.name,
      phone: customer.phone,
      countryCode: customer.country,
      requestLang: 'en-GB',
    },
    paymentTimeout: 300,
    paymentNotification: true,
    disableExactAmount: true,
    disableCash: true,
    disableWallet: true,
    sourceCode: import.meta.env.VITE_VIVA_SOURCE_CODE,
    merchantTrns: 'Short description of items/services purchased by customer',
  };
  const response = await axios.post(CREATE_ORDER_URL, formData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_VIVA_BEARER_TOKEN}`,
    },
  });

  return response.data.orderCode;
}
