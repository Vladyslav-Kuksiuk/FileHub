package com.teamdev.filehub.postman;

public interface EmailService {

    void sendEmail(String recipient, String subject, String text);
}
