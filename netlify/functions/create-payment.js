/* ============================================
   create-payment.js — GlobalPay Nigeria
   Zenith Bank Payment Gateway
   ============================================ */

exports.handler = async function (event) {

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

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
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    const apiKey = process.env.GLOBALPAY_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'API key not configured' }),
      };
    }

    const gpResponse = await fetch(
      'https://paygw.globalpay.com.ng/globalpay-paymentgateway/api/paymentgateway/generate-payment-link',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'language':     'en',
          'apiKey':       apiKey,
        },
        body: JSON.stringify({
          amount: parseFloat(amount).toFixed(2),
          merchantTransactionReference: `MADINA-${Date.now()}`,
          redirectUrl: 'https://madina-hotel-uyo.netlify.app/index.html',
          customer: {
            firstName:    fullName.split(' ')[0],
            lastName:     fullName.split(' ').slice(1).join(' ') || fullName,
            currency:     'USD',
            phoneNumber:  phone,
            address:      address || 'Uyo, Akwa Ibom, Nigeria',
            emailAddress: email,
          },
        }),
      }
    );

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
      body: JSON.stringify({ error: err.message }),
    };
  }
};
