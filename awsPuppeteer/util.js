import fetch from 'puppeteer-fetch';

export const getCookiesString = async (page) => {
  const cookies = await page.cookies();
  const cookiesArray = cookies.map(cookie => `${cookie.name}=${cookie.value}`);
  return cookiesArray.join('; ');
};

export const getFormBodyPayload = (payload) => {
  const encodedFormArray = Object.keys(payload).map(property => {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(payload[property]);
    return `${encodedKey}=${encodedValue}`;
  });
  return encodedFormArray.join("&");
};

export const makeApiCall = async (url, requestOptions) => {
  const response = await fetch.default(url, requestOptions);
  const result = await response.json();
  return result
};

export const getRedirectURL = (region) =>
  `https://${region}.console.aws.amazon.com/iamv2/home?region=${region}#/security_credentials/`

export const getSignInPageURl = (region) => {
  const payload = {
    isauthcode: true,
    client_id: 'arn:aws:iam::015428540659:user/iamv2',
  }
  return `https://signin.aws.amazon.com/signin?redirect_uri=${encodeURIComponent(getRedirectURL(region))}${getFormBodyPayload(payload)}`
};