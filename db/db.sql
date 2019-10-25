CREATE TABLE USERS 
(
	email varchar(50) PRIMARY KEY,
	password varchar(50),
	name varchar(50) character set utf8 not null,
	birthday date,
	photo varchar(100),
    googleId varchar(50)  ,
    facebookId varchar(50) ,
    loginType varchar(10) not null,
    point int DEFAULT 0
);

CREATE TABLE GAMEHISTORY
(
    id MEDIUMINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user1 varchar(50) not null,
    user2 varchar(50) not null,
    winner int not null, -- 0 hòa, 1 user1 thắng, 2 user2 thắng
    FOREIGN KEY (user1) REFERENCES USERS(email),
    FOREIGN KEY (user2) REFERENCES USERS(email)
)

