package com.teamdev.database.user;

import com.google.common.testing.NullPointerTester;
import com.google.common.truth.Truth;
import com.teamdev.util.LocalDateTimeUtil;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertThrows;

class AuthenticationDataTest {

    @Test
    void createAuthorizationDataTest() {

        LocalDateTime expireTime = LocalDateTime.now(LocalDateTimeUtil.TIME_ZONE)
                                                .plusDays(1);

        AuthenticationData authenticationData = new AuthenticationData("user",
                                                                       "BF487GW87FB4W874FO8W7WB4F",
                                                                       expireTime.toString());

        Truth.assertWithMessage("User id reading failed.")
             .that(authenticationData.userId())
             .matches("user");

        Truth.assertWithMessage("Authentication token reading failed.")
             .that(authenticationData.authenticationToken())
             .matches("BF487GW87FB4W874FO8W7WB4F");

        Truth.assertWithMessage("Authorization time reading failed.")
             .that(authenticationData.expireTime())
             .isEqualTo(expireTime.toString());

    }

    @Test
    void invalidUserIdTest() {

        assertThrows(IllegalStateException.class, () -> {
            AuthenticationData authenticationData =
                    new AuthenticationData("",
                                           "BF487GW87FB4W874FO8W7WB4F",
                                           LocalDateTime.now(LocalDateTimeUtil.TIME_ZONE)
                                                        .plusDays(1)
                                                        .toString());
        }, "User authorization data creation with illegal userId passed.");

    }

    @Test
    void invalidTokenTest() {

        assertThrows(IllegalStateException.class, () -> {
            AuthenticationData authenticationData =
                    new AuthenticationData("user",
                                           "",
                                           LocalDateTime.now(LocalDateTimeUtil.TIME_ZONE)
                                                        .plusDays(1)
                                                        .toString());
        }, "User authorization data creation with illegal authentication token passed.");

    }

    @Test
    void nullTest() {

        NullPointerTester tester = new NullPointerTester();
        tester.setDefault(String.class, "VGF847VF487VF48");
        tester.testAllPublicConstructors(AuthenticationData.class);

    }
}