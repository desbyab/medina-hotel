/* ============================================
   create-payment.js — GlobalPay Nigeria
   Zenith Bank Payment Gateway
============================================ */

exports.handler = async function (event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        error: "Method not allowed",
      }),
    };
  }

  try {
    const { fullName, email, phone, address, amount } = JSON.parse(event.body);

    if (!fullName || !email || !phone || !amount) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Missing required fields",
        }),
      };
    }

    const apiKey = process.env.GLOBALPAY_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "GLOBALPAY_API_KEY is missing from Netlify environment variables",
        }),
      };
    }

    const firstName = fullName.trim().split(" ")[0];
    const lastName =
      fullName.trim().split(" ").slice(1).join(" ") || ".";

    const payload = {
      amount: Number(amount),
      merchantTransactionReference: `MADINA-${Date.now()}`,
      redirectUrl: "https://madina-hotel-uyo.netlify.app/index.html",
      customer: {
        firstName,
        lastName,
        currency: "USD",
        phoneNumber: phone,
        address: address || "Uyo, Akwa Ibom, Nigeria",
        emailAddress: email,
      },
    };

    console.log("Sending GlobalPay payload:");
    console.log(JSON.stringify(payload, null, 2));

    const gpResponse = await fetch(
      "https://paygw.globalpay.com.ng/globalpay-paymentgateway/api/paymentgateway/generate-payment-link",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "language": "en",
          "apikey": apiKey,
        },
        body: JSON.stringify(payload),
      }
    );

    const rawText = await gpResponse.text();

    console.log("GlobalPay HTTP Status:", gpResponse.status);
    console.log("GlobalPay Raw Response:", rawText);

    let data;

    try {
      data = JSON.parse(rawText);
    } catch (err) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "GlobalPay returned invalid JSON",
          rawResponse: rawText,
        }),
      };
    }

    if (gpResponse.ok && data?.isSuccessful && data?.data?.checkoutUrl) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          checkoutUrl: data.data.checkoutUrl,
        }),
      };
    }

    return {
      statusCode: gpResponse.status || 400,
      headers,
      body: JSON.stringify({
        error: "GlobalPay payment link generation failed",
        globalpayResponse: data,
      }),
    };
  } catch (err) {
    console.error(err);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: err.message,
      }),
    };
  }
};
