package com.teamdev.filehub.processes.user.register;

public class ConfirmationEmail {
    private static final String CONFIRMATION_EMAIL_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 10px 0;
            border-bottom: 1px solid #dddddd;
        }
        .header img {
            max-width: 100px;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .content h1 {
            font-size: 24px;
            color: #333333;
        }
        .content p {
            font-size: 16px;
            color: #666666;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 20px 0;
            font-size: 16px;
            color: #ffffff;
            background-color: #28a745;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            padding: 10px 0;
            border-top: 1px solid #dddddd;
            font-size: 12px;
            color: #666666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="" alt="Company Logo">
        </div>
        <div class="content">
            <h1>Email Confirmation</h1>
            <p>Hello, Client!</p>
            <p>Thank you for registering on FileHub. Please confirm your email by clicking the button below.</p>
            <a href="%s" class="button">Confirm Email</a>
            <p>If the button doesn't work, copy and paste the following URL into your browser:</p>
            <p>%s</p>
        </div>
        <div class="footer">
            <p>If you did not register on our website, please ignore this email.</p>
            <p>&copy; 2024 Vladyslav Kuksiuk. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
            """;

    public static String confirmationEmailText(String confirmationLink) {
        return String.format(CONFIRMATION_EMAIL_TEMPLATE, confirmationLink, confirmationLink);
    }
}
