
/* ======= Model ======= */
const model =
{
    currentCourse: null,
    courses: [],
    changesMade: [],

    init: function (data) {
        this.courses = data;
    },
};

/* ======= Controller ======= */
const controller = {

    init: function (urlToConnectTo, elementIds) {
        $.getJSON(urlToConnectTo, function (data) {
            model.init(data);
            baseView.init(elementIds, controller.getCourses());
        });
    },

    postStudentToServer: function (studentName) {
        $.post(`/classroom/api/courses/${model.currentCourse.id}/students/`,
            {
                StudentName: studentName,
            },
            function (returnData) {
                newStudent = {
                    name: studentName,
                    id: returnData.newId
                }
                model.currentCourse.students.push(newStudent);

                controller.addStudentToOutput(newStudent)
            }
        );
    },

    deleteStudentFromServer: function (studentId, courseId) {
        $.ajax({
            url: `/classroom/api/courses/${courseId}/students/${studentId}`,
            type: 'DELETE',
            success: function (result) {
                console.log(result)
            }
        });
    },

    getTeacherForCurrentCourse: function () {
        return model.currentCourse['teacher'];
    },

    getStudentsForCurrentCourse: function () {
        return model.currentCourse['students'];
    },

    getCourses: function () {
        return model.courses;
    },

    // set the currently-selected course to the id of the passed in course
    setCurrentcourse: function (courseNum) {
        model.currentCourse = model.courses[courseNum];
    },

    addStudentToOutput(newStudent) {
        baseView.outputView.addStudentToOutput(newStudent);
    },
};

/* ======= View ======= */
const baseView = {
    init: function (elementIds, courses) {
        this.courseSelection = new CoursesDropdownMenu(elementIds.courseDropdownId, courses);
        this.outputView = new OutputView(elementIds.outputAreaId);

        this.studentInputField = document.getElementById(elementIds.studentFieldId);
        this.teacherField = document.getElementById(elementIds.teacherFieldId);
    }
}



const elementIds = {
    courseDropdownId: 'courseID',
    outputAreaId: 'studentsInCourseOutput',
    studentFieldId: 'studentName',
    teacherFieldId: 'teacherID'
}

const serverUrl = 'http://0.0.0.0:5000/courseInfo';

// make it go!
controller.init(serverUrl, elementIds);

