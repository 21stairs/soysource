package com.ssafy.D203.model.dao;

import com.ssafy.D203.model.dto.User;

public interface UserDao {
    /**
     * 사용자 정보를 추가한다.
     * @param user
     * @return
     */
    int insert(User user);

}
