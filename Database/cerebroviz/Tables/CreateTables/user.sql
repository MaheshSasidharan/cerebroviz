CREATE TABLE Users (
	userId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	ip varchar(30) NOT NULL,
	sessionId VARCHAR(19) NOT NULL,
	reg_date TIMESTAMP
)
