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

