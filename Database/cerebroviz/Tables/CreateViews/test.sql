SELECT q.questionId, q.question, q.assessmentId, a.nickName, a.name, a.description
	FROM Assessments a
	LEFT JOIN  Questions q 
		ON q.assessmentId = a.assessmentIddfdf

/*
SELECT q.questionId, q.question, q.assessmentId, a.nickName, a.name, a.description
	FROM Questions q 
	JOIN Assessments a 
		ON q.assessmentId = a.assessmentId

SELECT q.questionId, q.question, q.assessmentId, a.nickName, a.name, a.description
	FROM Questions q 
	RIGHT JOIN Assessments a 
		ON q.assessmentId = a.assessmentId


/*
#CREATE View vw_AssessmentQuestions as (
	SELECT q.questionId, q.question, q.assessmentId, a.nickName, a.name, a.description, r.responseTextId, r.response, r.userId 
	FROM Questions q 
	JOIN Assessments a 
		ON q.assessmentId = a.assessmentId
	LEFT JOIN ResponseTexts r 
		ON q.questionId = r.questionId
	
#);

*/
