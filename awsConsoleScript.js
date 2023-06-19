/**
 * To execute the code, follow these steps:
 * 1. Sign in to your aws console.
 * 2. Navigate to the following page: `https://console.aws.amazon.com/iamv2/home?#/security_credentials`
 * 3. Open the Developer Tools Console.
 * 4. Copy the provided code and paste it into the DevTools Console.
 * 5. Pass your username to the createAccessKey function and execute the code.
 */

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

const createAccessKey = async (UserName) => {
  const cookies = document.cookie;
  const region = getCookie('noflush_Region');
  const csrfToken = document.querySelector('meta[name="awsc-csrf-token"]')?.content;

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
  }

  // API call to create Access Key
  try {
    const response = await fetch(`https://${region}.console.aws.amazon.com/iamv2/api/iam`, {
      body: JSON.stringify(payload),
      method: 'POST',
      headers: {
        cookie: cookies,
        authority: `${region}.console.aws.amazon.com`,
        'x-csrf-token': csrfToken,
        'content-type': 'application/json'
      }
    });
    const accessKey = await response.json();

    console.log(`AccessKeyId: ${accessKey.AccessKey.AccessKeyId}`);
    console.log(`SecretAccessKey: ${accessKey.AccessKey.SecretAccessKey}`);
  } catch (err) {
    console.log(err);
  }

};

// Pass your username as an argument to the function below
createAccessKey('test-user');