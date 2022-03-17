package com.ssafy.D203;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;

import com.ssafy.D203.model.dao.UserDao;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@EnableCaching
@SpringBootApplication
@EnableSwagger2
@MapperScan(basePackageClasses = UserDao.class)
public class SSFMApplication {

	public static void main(String[] args) {
		SpringApplication.run(SSFMApplication.class, args);
	}
	
	   @Bean
	    public Docket postsApi() {
	       final ApiInfo apiInfo = new ApiInfoBuilder()
	               .title("간장공장 공장장 Rest api")
	               .description("<h3>간장공장 공장장 Rest api의 문서 제공</h3>")
	               .contact(new Contact("윤승일", "https://edu.ssafy.com", "liqurt@gmail.com"))
	               .license("MIT License")
	               .version("1.0")
	               .build();
	       
	        Docket docket = new Docket(DocumentationType.SWAGGER_2)
	                .groupName("SSAFY D203")
	                .apiInfo(apiInfo)
	                .select()
	                .apis(RequestHandlerSelectors.basePackage("com.ssafy.D203.controller.rest"))
//	              .paths(PathSelectors.ant("/book/**"))
	                .build();
	        return docket;
	    }


}
