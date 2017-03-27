CREATE TABLE Assessments (
	assessmentId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	name varchar(50) NOT NULL,
	nickName varchar(20) NOT NULL,
	description varchar(300) NOT NULL,
	sequence int not null,
	reg_date TIMESTAMP
)
