CREATE View vw_AssessmentQuestions as (
	SELECT q.questionId, q.question, a.assessmentId, a.nickName, a.name, a.description
	FROM Questions q 
	RIGHT JOIN Assessments a 
		ON q.assessmentId = a.assessmentId
	ORDER BY a.sequence
);
/*
CREATE View vw_AssessmentQuestions as (
	SELECT q.questionId, q.question, q.assessmentId, a.nickName, a.name, a.description, r.responseTextId, r.response, r.userId 
	FROM Questions q 
	JOIN Assessments a 
		ON q.assessmentId = a.assessmentId
	LEFT JOIN ResponseTexts r 
		ON q.questionId = r.questionId
);


CREATE View vw_AssessmentQuestions as (
	SELECT q.questionId, q.question, q.assessmentId, a.nickName, a.name, a.description, r.responseTextId, r.response, r.userId 
	FROM Questions q 
	JOIN Assessments a 
		ON q.assessmentId = a.assessmentId
	JOIN ResponseTexts r 
		ON q.questionId = r.questionId
	
);
*/
