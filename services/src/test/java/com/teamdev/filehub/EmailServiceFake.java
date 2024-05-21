package com.teamdev.filehub;

import com.teamdev.filehub.postman.EmailService;

public class EmailServiceFake implements EmailService {
    @Override
    public void sendEmail(String recipient, String letter, String text) {

    }
}
