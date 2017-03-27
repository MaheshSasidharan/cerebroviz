CREATE TABLE ResponseTexts (
	responseTextId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	userId INT UNSIGNED NOT NULL,
	questionId INT UNSIGNED NOT NULL,	
	response TEXT,
	reg_date TIMESTAMP,
	FOREIGN KEY (userId) REFERENCES Users(userId),
	FOREIGN KEY (questionId) REFERENCES Questions(questionId)
);

ALTER TABLE ResponseTexts ADD UNIQUE UNQ_userId_questionId(userId, questionId);
