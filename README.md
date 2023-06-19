# AWS API Key Generator
There are two ways in which we can generate the the first Access Keys.

### 1. Using `AWS Developer Tools Console`
  - Sign in to your aws console.
  - Navigate to the following page: `https://console.aws.amazon.com/iamv2/home?#/security_credentials`
  - Open the Developer Tools Console.
  - Copy the script in the link below and paste it into the DevTools Console:<br/>
      [AWS Access Key Generator via DevTools Console](https://github.com/riyalohia/aws-api-key-generator/blob/main/awsConsoleScript.js)
  - Pass your username to the `createAccessKey` function in the script and execute the code.

<br/>

### 2. Using `Puppeteer`
  
  We can automate the above steps using Puppeteer (A Node library for controlling headless Chrome over the DevTools Protocol). Inside the [script](https://github.com/riyalohia/aws-api-key-generator/blob/main/awsPuppeteer/index.js), we have perfomed following operations:

  - Utilized Puppeteer to sign in to the AWS console using the AWS `/authenticate` API endpoint.
  - Retrieved AWS cookies and tokens through Puppeteer after user signin.
  - Passed the cookies and tokens to the `/iam` API endpoint to generate access key.

  To execute the script, follow these instructions:
  - Begin by cloning this repository:
    ```
    git@github.com:riyalohia/aws-api-key-generator.git
    ```
  - Navigate to the cloned repository using the command `cd aws-api-key-generator`.
  - Make sure you have node (>= 16.8.0) installed.
  - Run the command`npm install`.
  - Create a file named `.env` in the root directory of the repository and include your details within it.
    ```.env
    ACCOUNT_ID=<YOUR-AWS-ACCOUNT-ID>
    ACCOUNT_USERNAME=<YOUR-AWS-ACCOUNT-USERNAME>
    ACCOUNT_PASSWORD=<YOUR-AWS-ACCOUNT-PASSWORD>
    ```
  - Execute the command node `awsPuppeteerScript.js`.
