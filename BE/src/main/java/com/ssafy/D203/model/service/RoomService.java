package com.ssafy.D203.model.service;

import java.util.Map;

import com.ssafy.D203.model.dto.Room;
import com.ssafy.D203.model.dto.User;


public interface RoomService {
    /**
     * 방 생성
     * 
     * @param user
     */
    public void insert(Room room);


}
