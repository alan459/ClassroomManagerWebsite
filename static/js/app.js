/* ======= Model ======= */
const model = {
    currentCourse: null,
    currentStudents: null,
    courses: {},
    students: {},

    init: function (courses) {
        console.log('Initializing model with courses: ', courses);
        this.courses = courses;
    },

    addStudents: function (students) {
        this.students = students;
    },

    addStudent: function (student) {
        this.students[student.id] = student;
    },

    getStudent: function (id) {
        return this.students[id];
    },

    setCurrentCourse: function (courseId) {
        this.currentCourse = this.courses[courseId];

        this.currentStudents = this.studentsForCurrentCourse();
    },

    studentsForCurrentCourse: function () {
        const studentObjects = this.currentCourse.students.map(studentId => {
            return model.students[studentId];
        })
        return studentObjects;
    }
};


const messenger = {
    getFromServer: function (urlToConnectTo, elementIds) {
        $.getJSON(urlToConnectTo + "/api/courses/JSON", function (data) {
            controller.coursesRetrieved(data);
        });

        $.getJSON(urlToConnectTo + "/api/students/JSON", function (studentsArr) {
            controller.studentsRetrieved(studentsArr);
        });
    },

    postStudentToServer: function (studentName) {
        $.ajax({
            url: `/api/students/JSON`,
            type: "post",
            data: {
                name: studentName,
            },
            success: function (returnData) {
                const student = {
                    'id': returnData.id,
                    'name': returnData.name
                }
                controller.studentAddedToServer(student);
            }
        });
    },

    updateCourseOnServer: function (courseId, studentId) {
        $.ajax({
            url: `/api/courses/${courseId}/JSON`,
            type: "put",
            dataType: "json",
            data: {
                "courseId": courseId,
                "studentId": studentId,
            }
        });
    },

    deleteStudentFromServer: function (studentId) {
        $.ajax({
            url: `/api/students/${studentId}/JSON`,
            type: 'delete',
            success: function (result) {
                console.log("Delete request for student sent, result: ", result);
            }
        });
    },
}

/* ======= Controller ======= */
const controller = {

    init: function (urlToConnectTo, elementIds) {
        console.log("Initializing Controller");

        // upon sucess, coursesRetrieved() and studentsRetrieved() called
        messenger.getFromServer(urlToConnectTo, elementIds);
    },


    coursesRetrieved: function (courses) {
        console.log("Retrieved courses: ", courses);
        model.init(courses);
        baseView.init(elementIds, courses);
    },

    studentsRetrieved: function (studentsArr) {
        console.log("Retrieved students: ", studentsArr);

        // convert students array to map
        const studentsMap = studentsArr.reduce(function (map, obj) {
            map[obj.id] = obj;
            return map;
        }, {});

        model.addStudents(studentsMap);
    },

    sortStudents: function (reverse) {
        baseView.outputView.sort(reverse, model.currentStudents, baseView.courseSelection.hasSelectedCourse());
    },

    studentAdded: function (reverse) {
        const studentName = baseView.studentInputField.value;

        if (baseView.inputValid(studentName))
            // calls studentAddedToServer() upon success
            messenger.postStudentToServer(studentName);
        else
            alert("Failed to post student to server.");
    },

    studentAddedToServer: function (student) {
        console.log("Post success, current course", model.currentCourse);

        model.currentCourse.students.push(student.id);
        messenger.updateCourseOnServer(model.currentCourse.id, student.id);

        //console.log("model.getStudent(studentId)", model.getStudent(studentId));
        model.addStudent(student);
        baseView.addStudentToOutput(student);
    },

    // set the currently-selected course to the id of the passed in course
    setCurrentcourse: function (courseNum) {
        model.setCurrentCourse(courseNum);

        // set teacher for selected course from model
        baseView.teacherField.value = model.currentCourse['teacher'];

        baseView.outputView.displayStudents(model.currentStudents, baseView.courseSelection.getIdOfSelectedCourse());
    },

    // fetches course info whenever a new course is selected, including teacher and students
    courseChanged: function () {
        const selectedIndex = baseView.courseSelection.getIdOfSelectedCourse();
        if (selectedIndex == 0) {
            baseView.emptyTeacherAndStudentFields();
            return;
        }

        this.setCurrentcourse(selectedIndex - 1);
    },

    deleteStudentFromServer: function (studentId) {
        messenger.deleteStudentFromServer(studentId);
    }
};


const elementIds = {
    courseDropdownId: 'courseID',
    outputAreaId: 'studentsInCourseOutput',
    studentFieldId: 'studentName',
    teacherFieldId: 'teacherID'
}

const serverUrl = 'http://0.0.0.0:5000';

// make it go!
controller.init(serverUrl, elementIds);