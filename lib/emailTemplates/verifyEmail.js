export default function verifyEmailTemplate({ name, verifyUrl }) {
  return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body {
            font-family: sans-serif;
            background-color: #111827;
            color: #f9fafb;
            padding: 24px;
            margin: 0;
          }
          .container {
            max-width: 480px;
            margin: auto;
            background-color: #1f2937;
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 0 12px rgba(0,0,0,0.3);
          }
          h2 {
            color: #f472b6;
            font-size: 24px;
            margin-bottom: 16px;
          }
          p {
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 16px;
          }
          .button {
            display: inline-block;
            background-color: #f472b6;
            color: #fff;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            margin-top: 12px;
          }
          .footer {
            font-size: 12px;
            color: #9ca3af;
            margin-top: 32px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Welcome to QupDate, ${name} 💖</h2>
          <p>You're almost ready to start discovering matches and attending events in Bergen.</p>
          <p>Click the button below to verify your profile and earn your verified badge:</p>
          <a href="${verifyUrl}" class="button">✔ Verify My Profile</a>
          <div class="footer">
            This link expires in 24 hours.
          </div>
        </div>
      </body>
    </html>
  `;
}
