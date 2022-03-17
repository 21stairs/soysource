package com.ssafy.D203.model.dto;

import io.swagger.annotations.ApiModelProperty;

public class User {
	//field

	@ApiModelProperty(hidden=true)
	private int userOrder;
	
	@ApiModelProperty(hidden=true)
	private int ranking;
	
	@ApiModelProperty(hidden=true)
	private boolean ready;
	
	@ApiModelProperty(hidden=true)
	private double score;
	
	@ApiModelProperty(hidden=true)
	private int userId;
	
	private String userName;
	//getter setter
	public int getUserOrder() {
		return userOrder;
	}
	public void setUserOrder(int userOrder) {
		this.userOrder = userOrder;
	}
	public int getRanking() {
		return ranking;
	}
	public void setRanking(int ranking) {
		this.ranking = ranking;
	}
	public boolean isReady() {
		return ready;
	}
	public void setReady(boolean ready) {
		this.ready = ready;
	}
	public double getScore() {
		return score;
	}
	public void setScore(double score) {
		this.score = score;
	}
	public int getUserId() {
		return userId;
	}
	public void setUserId(int userId) {
		this.userId = userId;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	//constructor
	public User(int userOrder, int ranking, boolean ready, double score, int userId, String userName) {
		super();
		this.userOrder = userOrder;
		this.ranking = ranking;
		this.ready = ready;
		this.score = score;
		this.userId = userId;
		this.userName = userName;
	}
	public User(int userOrder, int ranking, boolean ready, double score,String userName) {
		super();
		this.userOrder = userOrder;
		this.ranking = ranking;
		this.ready = ready;
		this.score = score;
		this.userName = userName;
	}
	public User() {}
}
