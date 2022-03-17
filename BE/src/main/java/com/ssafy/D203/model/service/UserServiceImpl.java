package com.ssafy.D203.model.service;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ssafy.D203.model.dao.UserDao;
import com.ssafy.D203.model.dto.User;

@Service
public class UserServiceImpl implements UserService {
    
    private static UserServiceImpl instance = new UserServiceImpl();

    private UserServiceImpl() {}

    public static UserServiceImpl getInstance() {
        return instance;
    }
    
    @Autowired
    private UserDao userDao;

    @Override
    public void insert(User user) {
        userDao.insert(user);

    }

}
