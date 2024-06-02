package com.teamdev.filehub.postman;

import com.google.common.flogger.FluentLogger;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;

import java.io.IOException;

public class SendGridEmailService implements EmailService {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final Email sender = new Email("vlad.kuksiuk2@gmail.com");
    private final SendGrid sendGrid;

    public SendGridEmailService(String apiKey) {
        this.sendGrid = new SendGrid(apiKey);
    }

    @Override
    public void sendEmail(String recipient, String subject, String text) {
        Email to = new Email(recipient);
        Content content = new Content("text/html", text);
        Mail mail = new Mail(sender, subject, to, content);

        try {
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            var response = sendGrid.api(request);
            logger.atInfo()
                    .log("[EMAIL SERVICE] - Email sent - Status: %d - Response : %s \n", response.getStatusCode(), response.getBody());
        } catch (IOException e) {
            logger.atInfo()
                    .log("[EMAIL SERVICE] - Email not sent");
        }
    }
}
