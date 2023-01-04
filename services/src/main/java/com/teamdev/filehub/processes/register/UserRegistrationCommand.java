package com.teamdev.filehub.processes.register;

import com.teamdev.filehub.processes.Command;

import javax.annotation.Nonnull;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * A {@link Command} implementation which is intended to store
 * data about user registration.
 */
public class UserRegistrationCommand implements Command {

    private final String login;
    private final String password;

    public UserRegistrationCommand(@Nonnull String login,
                                   @Nonnull String password) throws FieldValidationException {

        String loginPatternRegex = "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@" +
                "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";

        Pattern loginPattern = Pattern.compile(loginPatternRegex);
        Matcher loginMatcher = loginPattern.matcher(login);

        if (!loginMatcher.matches()) {
            throw new FieldValidationException("email", "Email validation failed.");
        }

        String passwordPatternRegex = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$";
        Pattern passwordPattern = Pattern.compile(passwordPatternRegex);
        Matcher passwordMatcher = passwordPattern.matcher(password);

        if (!passwordMatcher.matches()) {
            throw new FieldValidationException("password", "Password validation failed.");
        }

        this.login = login;
        this.password = password;
    }

    public String login() {
        return login;
    }

    public String password() {
        return password;
    }
}
