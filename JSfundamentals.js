// creating a script that gathers data, processes it, and then outputs a consistent result.
// 4 different types of data : 
// CourseInfo|AssignmentGroup|AssignmentInfo|LearnerSubmission

// let CourseInfo = ('a = ${a}, b = ${b}')


// console.log = ('a = ${a}, b = ${b}')



// let learnears = {
//      id: 125
//      score1: 47,
//      points_posibble1:50,
//      score2:150
//      points_posibble2:150

//      function weightedAverage(learnears){
//           let score1 = learnear score1
//           let points_posibble1 = learnears points_posibble1
//           let score1= learners score1
//           let points_posibble1 = learnears points_posibble1

//           let average =(score1+ score2) / (points_posibble1 + points_posibble1);
//           return average;
//      }
// } 
// console.log (weightedAverage(learnears));



function sumAges(people) {
     return people.reduce((sum, person) => sum + person.age, 0);
 }
 
 function averageAge(people) {
     const totalAge = sumAges(people);
     return people.length === 0 ? 0 : totalAge / people.length;
 }
 
 function processLearnerData(courses, assignmentGroups, submissions) {
     let learnerData = {};
     
     submissions.forEach(({ learner_id, assignment_id, submission }) => {
         if (!learnerData[learner_id]) {
             learnerData[learner_id] = { learner_id, totalWeightedScore: 0, totalWeight: 0, assignments: [] };
         }
         
         let assignmentGroup = assignmentGroups.find(group => group.assignments.some(a => a.id === assignment_id));
         if (!assignmentGroup) return;
         
         let assignment = assignmentGroup.assignments.find(a => a.id === assignment_id);
         let score = submission ? submission.score : 0;
         let weight = assignmentGroup.group_weight;
         
         learnerData[learner_id].assignments.push({ assignment_id, score, weight });
         learnerData[learner_id].totalWeightedScore += (score / assignment.points_possible) * weight;
         learnerData[learner_id].totalWeight += weight;
     });
     
     return Object.values(learnerData).map(learner => ({
         learner_id: learner.learner_id,
         final_grade: learner.totalWeight > 0 ? (learner.totalWeightedScore / learner.totalWeight) * 100 : 0,
         assignments: learner.assignments
     }));
 }

 const courses = [
     { id: 1, name: "Math" },
     { id: 2, name: "Science" }
 ];
 
 const assignmentGroups = [
     {
         id: 101,
         name: "Assigments",
         course_id: 1,
         group_weight: 40,
         assignments: [
             { id: 1001, name: "Algebra", due_at: "3-15-2015", points_possible: 100 },
             { id: 1002, name: "Geometry", due_at: "3-20-2025", points_possible: 100 }
         ]
     }
 ];
 
 const learnerSubmissions = [
     { learner_id: 1, assignment_id: 1001, submission: { submitted_at: "3-9-2025", score: 90 } },
     { learner_id: 1, assignment_id: 1002, submission: { submitted_at: "3-11-2025", score: 80 } }
 ];
 
 function processCourseData(courses, assignmentGroups, learnerSubmissions) {
     const results = [];
     
     courses.forEach(course => {
         const courseGroups = assignmentGroups.filter(group => group.course_id === course.id);
         const learners = {};
 
         courseGroups.forEach(group => {
             group.assignments.forEach(assignment => {
                 const submissions = learnerSubmissions.filter(sub => sub.assignment_id === assignment.id);
                 
                 submissions.forEach(sub => {
                     if (!learners[sub.learner_id]) {
                         learners[sub.learner_id] = { learner_id: sub.learner_id, total_score: 0, total_weight: 0 };
                     }
                     
                     const weightedScore = (sub.submission.score / assignment.points_possible) * group.group_weight;
                     learners[sub.learner_id].total_score += weightedScore;
                     learners[sub.learner_id].total_weight += group.group_weight;
                 });
             });
         });
         
         Object.values(learners).forEach(learner => {
             learner.final_score = (learner.total_weight > 0) ? (learner.total_score / learner.total_weight) * 100 : 0;
             results.push(learner);
         });
     });
     
     return results;
 }
 
 console.log(processCourseData(courses, assignmentGroups, learnerSubmissions));
 
 