package com.teamdev.filehub.postman;

import com.sendgrid.helpers.mail.Mail;

public interface EmailService {

    void sendEmail(String recipient, String subject, String text);
}
