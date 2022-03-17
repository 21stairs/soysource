package com.ssafy.cafe.dao;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.D203.model.dao.CommentDao;
import com.ssafy.D203.model.dao.OrderDao;
import com.ssafy.D203.model.dao.OrderDetailDao;
import com.ssafy.D203.model.dao.ProductDao;
import com.ssafy.D203.model.dao.StampDao;
import com.ssafy.D203.model.dao.UserDao;
import com.ssafy.D203.model.dto.Comment;
import com.ssafy.D203.model.dto.User;

@SpringBootTest
//@Transactional
@TestMethodOrder(OrderAnnotation.class)
abstract class AbstractDaoTest {

    @Autowired
    UserDao uDao;
    @Autowired
    ProductDao pDao;
    @Autowired
    OrderDao oDao;
    @Autowired
    OrderDetailDao dDao;
    @Autowired
    CommentDao cDao;
    @Autowired
    StampDao sDao;
}
