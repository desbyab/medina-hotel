/* ============================================
   create-payment.js — GlobalPay Nigeria
   Zenith Bank Payment Gateway
   ============================================ */

exports.handler = async function (event) {

  // Allow CORS so the browser can call this function
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle preflight OPTIONS request from browser
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { fullName, email, phone, address, amount } = JSON.parse(event.body);

    if (!fullName || !email || !phone || !amount) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields', received: { fullName, email, phone, amount } }),
      };
    }

    const apiKey = process.env.GLOBALPAY_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'API key not configured in Netlify environment variables' }),
      };
    }

    // GlobalPay Nigeria (Zenith Bank) endpoint
    const gpResponse = await fetch(
      'https://paygw.globalpay.com.ng/globalpay-paymentgateway/api/paymentgateway/generate-payment-link',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'language':     'en',
          'apikey':       apiKey,
        },
        body: JSON.stringify({
          FullName:    fullName,
          Currency:    'NGN',
          Amount:      parseFloat(amount).toFixed(2),
          PhoneNumber: phone,
          Address:     address || 'Uyo, Akwa Ibom, Nigeria',
          Email:       email,
          apikey:      apiKey,
        }),
      }
    );

    // Log the raw response for debugging
    const rawText = await gpResponse.text();
    console.log('GlobalPay raw response:', rawText);
    console.log('GlobalPay status:', gpResponse.status);

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'GlobalPay returned invalid response', raw: rawText }),
      };
    }

    // Try different possible response structures
    const checkoutUrl =
      data?.data?.checkoutUrl ||
      data?.checkoutUrl ||
      data?.data?.CheckoutUrl ||
      data?.CheckoutUrl ||
      data?.data?.paymentUrl ||
      data?.paymentUrl ||
      null;

    if (checkoutUrl) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ checkoutUrl }),
      };
    }

    // Return full response so we can debug
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: 'No checkout URL in response',
        globalpayResponse: data,
      }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message, stack: err.stack }),
    };
  }
};
