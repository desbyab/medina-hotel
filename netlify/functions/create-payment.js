/* ============================================
   create-payment.js
   ============================================
   WHAT THIS FILE DOES:
   This is a tiny "back office" script that runs
   on Netlify's servers — NOT in the browser.

   The website (booking.js) sends booking details
   here. This file then talks to GlobalPay
   (Zenith Bank's payment gateway) using the
   secret API key — which stays hidden on the
   server and is never visible to website visitors.

   GlobalPay responds with a "checkoutUrl" — a link
   to a secure payment page (where Zenith Bank
   transfer, card, USSD etc. are offered). This
   file passes that link back to the website,
   which then redirects the guest there.

   WHERE THE API KEY LIVES:
   The API key is NOT written in this file.
   Instead, it's stored in Netlify's dashboard under:
     Site configuration → Environment variables
   as a variable named GLOBALPAY_API_KEY.
   This file reads it securely at runtime using
   process.env.GLOBALPAY_API_KEY.
   ============================================ */

exports.handler = async function (event) {

  // Only allow POST requests (booking submissions)
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // 1. Read the booking details sent from the website
    const { fullName, email, phone, address, amount } = JSON.parse(event.body);

    // 2. Basic validation
    if (!fullName || !email || !phone || !amount) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required booking details' }),
      };
    }

    // 3. Get the secret API key from Netlify's environment variables
    //    (set this in the Netlify dashboard — see deployment guide)
    const apiKey = process.env.GLOBALPAY_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Payment gateway not configured. Missing API key.' }),
      };
    }

    // 4. Call GlobalPay's "Generate Payment Link" endpoint
    const response = await fetch(
      'https://paygw.globalpay.com.ng/globalpay-paymentgateway/api/paymentgateway/generate-payment-link',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'language': 'en',
          'apikey': apiKey,
        },
        body: JSON.stringify({
          FullName: fullName,
          Currency: 'NGN',
          Amount: amount,          // amount in Naira (e.g. 130000.00)
          PhoneNumber: phone,
          Address: address || 'Uyo, Akwa Ibom State, Nigeria',
          Email: email,
          apikey: apiKey.toLowerCase(), // GlobalPay docs require lowercase here
        }),
      }
    );

    const data = await response.json();

    // 5. If GlobalPay returns a checkout link, send it back to the website
    if (data && data.data && data.data.checkoutUrl) {
      return {
        statusCode: 200,
        body: JSON.stringify({ checkoutUrl: data.data.checkoutUrl }),
      };
    }

    // 6. Otherwise, something went wrong — pass the error along
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Could not generate payment link',
        details: data,
      }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
