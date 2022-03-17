package com.ssafy.D203.model.service;

import java.util.Map;

import com.ssafy.D203.model.dto.User;


public interface UserService {
    /**
     * 사용자 정보를 DB에 저장한다.
     * 
     * @param user
     */
    public void insert(User user);


}
