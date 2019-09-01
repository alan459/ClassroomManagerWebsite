/* ======= Model ======= */
const model =
{
    currentCourse: null,
    courses: [],

    init: function (data) {
        this.courses = data;
        console.log(data);
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


class CoursesDropdownMenu {

    constructor(elementId, courses) {
        this.element = document.getElementById(elementId);
        //this.outerView = outerView;

        // render this view (update the DOM elements with the right values)
        this.addCoursesToDropDownMenu(courses);
    }

    /* Populate courses for dropdown menu. */
    render() {
        this.addCoursesToDropDownMenu(controller.getCourses());
    }

    addCoursesToDropDownMenu(courses) {
        courses.forEach(course => {
            const option = document.createElement("option");
            option.id = course.id;
            option.text = course.name;
            this.element.appendChild(option);
        });
    }

    // fetches course info whenever a new course is selected, including teacher and students
    courseChanged() {
        const selectedIndex = this.element.selectedIndex;
        if (selectedIndex == 0) {
            baseView.teacherField.value = '';
            baseView.outputView.element.innerHTML = '';
            return;
        }

        controller.setCurrentcourse(selectedIndex - 1);

        // set teacher for selected course from model
        baseView.teacherField.value = controller.getTeacherForCurrentCourse();

        baseView.outputView.displayStudents(controller.getStudentsForCurrentCourse());
    }

    getIdOfSelectedCourse() {
        return this.element.options[this.element.selectedIndex].id;
    }

    hasSelectedCourse() {
        return this.element.selectedIndex != 0;
    }
}

class OutputView {

    static UnselectedCourseMsg = "Please select a course";

    constructor(elementId) {
        this.element = document.getElementById(elementId);
        this.elementId = elementId;
    }

    displayStudents(studentNames) {
        this.element.innerHTML = "";
        const currentCourseId = baseView.courseSelection.getIdOfSelectedCourse();
        studentNames.forEach(name => this.element.appendChild(OutputView.studentListItem(name, currentCourseId)));
    }

    // called from html when sort asc is clicked
    sortAscending() {
        if (!baseView.courseSelection.hasSelectedCourse()) {
            alert(OutputView.UnselectedCourseMsg);
            return;
        }

        const sortedStudents = controller.getStudentsForCurrentCourse().sort();
        this.displayStudents(sortedStudents);
    }

    // called from html when sort des is clicked
    sortDescending() {
        if (!baseView.courseSelection.hasSelectedCourse()) {
            alert(OutputView.UnselectedCourseMsg);
            return;
        }
        const sortedStudents = controller.getStudentsForCurrentCourse().sort().reverse();
        this.displayStudents(sortedStudents);
    }

    // called from html when student is added - "Add Student" button is clicked
    studentAdded() {
        if (!baseView.courseSelection.hasSelectedCourse()) {
            alert(OutputView.UnselectedCourseMsg);
            return;
        }

        // add student to model and database
        const studentName = baseView.studentInputField.value;
        if (studentName === '') {
            alert("Blank student name entered");
            return;
        }

        // posts student to server and calls addStudentToOutput() if successful
        controller.postStudentToServer(studentName);
    }

    addStudentToOutput(student) {
        // add new student in course to output area
        const newStudentRow =
            OutputView.studentListItem(
                student, baseView.courseSelection.getIdOfSelectedCourse());

        this.element.appendChild(newStudentRow);

        // empty the student input field
        baseView.studentInputField.value = '';
    }

    static studentListItem(student, courseId) {
        var li = document.createElement("li");
        li.className = "col list-group-item";
        li.id = student.id
        console.log(courseId);
        var text = document.createTextNode(student.name);
        li.appendChild(text);
        li.appendChild(this.closeButton(student.id, courseId));

        return li;
    }

    static closeButton(studentId, courseId) {
        var span = document.createElement("SPAN");
        var txt = document.createTextNode("\u00D7");
        span.className = "close";
        span.appendChild(txt);
        span.id = span.onclick = function () {
            controller.deleteStudentFromServer(studentId, courseId);
            var div = this.parentElement;
            div.style.display = "none";
        }

        return span
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

