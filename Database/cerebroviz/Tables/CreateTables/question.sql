CREATE TABLE Questions (
	questionId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	question TEXT NOT NULL,
	assessmentId INT UNSIGNED NOT NULL,
	reg_date TIMESTAMP,
	FOREIGN KEY (assessmentId) REFERENCES Assessments(assessmentId)
)
