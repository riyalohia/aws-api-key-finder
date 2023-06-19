import puppeteer from 'puppeteer';
import { 
  getFormBodyPayload,
  getCookiesString,
  getRedirectURL,
  makeApiCall,
  getSignInPageURl
} from './util.js';

const authenticateUser = async (page, region) => {
  const apiUrl = 'https://signin.aws.amazon.com/authenticate';
  const payload = {
    redirect_uri: getRedirectURL(region),
    code_challenge_method: 'SHA-256',
    action: 'iam-user-authentication',
    account: process.env.ACCOUNT_ID,
    username: process.env.ACCOUNT_USERNAME,
    password: process.env.ACCOUNT_PASSWORD,
    'client_id': 'arn:aws:iam::015428540659:user/iamv2',
  };

  const cookies = await getCookiesString(page);

  const requestOptions = {
    body: getFormBodyPayload(payload),
    method: 'POST',
    headers: {
      cookie: cookies,
      authority: 'signin.aws.amazon.com',
      path: '/authenticate',
      accept: 'application/json, text/plain, */*',
      Scheme: 'https',
      'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  };

  const userAuthentication = await makeApiCall(apiUrl, requestOptions)
  return userAuthentication;
};

const createAccessKey = async (UserName, region = 'us-east-1') => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(getSignInPageURl(region));

  // Authenticate User before generating access key
  const userAuthentication = await authenticateUser(page, region);

  // API call to create Access Key
  if (userAuthentication.state !== 'FAIL') {
    await page.goto(getRedirectURL(region));

    const apiUrl = `https://${region}.console.aws.amazon.com/iamv2/api/iam`;
    const authenticatedCookies = await getCookiesString(page);
    const csrfToken = await page.evaluate(() => {
      return document.querySelector('meta[name="awsc-csrf-token"]')?.content
        || document.querySelector('meta[name="csrf_token"]')?.content;
    });

    const payload = {
      headers: {
        'X-Amz-User-Agent': 'aws-sdk-js/2.850.0 promise',
        'Content-Type': 'application/x-amz-json-1.0',
        'X-Amz-Target': 'AWSIdentityManagementV20100508.CreateAccessKey'
      },
      path: '/',
      method: 'POST',
      params: {},
      contentString: JSON.stringify({ UserName }),
      operation: 'createAccessKey',
      region
    };

    const requestOptions = {
      body: JSON.stringify(payload),
      method: 'POST',
      headers: {
        cookie: authenticatedCookies,
        authority: `${region}.console.aws.amazon.com`,
        'x-csrf-token': csrfToken,
        'content-type': 'application/json'
      }
    };

    const accessKey = await makeApiCall(apiUrl, requestOptions);
    console.log(`AccessKeyId: ${accessKey.AccessKey.AccessKeyId}`);
    console.log(`SecretAccessKey: ${accessKey.AccessKey.SecretAccessKey}`);
  } else {
    console.log('User Authentication Failed');
  }

  await browser.close();
};

export default createAccessKey;