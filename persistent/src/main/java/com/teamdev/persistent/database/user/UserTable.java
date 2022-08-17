package com.teamdev.persistent.database.user;

import com.google.common.base.Preconditions;

import javax.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.Map;

public class UserTable {

    private final Map<String, UserData> users = new HashMap<>();

    public UserData getUser(@NotNull String id) {
        Preconditions.checkState(users.containsKey(id));

        return users.get(id);
    }

    public void addUser(@NotNull UserData user) {
        Preconditions.checkState(!users.containsKey(user.getLogin()));

        users.put(user.getLogin(), user);
    }

    public void deleteUser(@NotNull String id) {
        Preconditions.checkState(users.containsKey(id));

        users.remove(id);
    }

    public void updateUser(@NotNull UserData user) {
        Preconditions.checkState(users.containsKey(user.getLogin()));

        users.put(user.getLogin(), user);
    }

}
