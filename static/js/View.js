/* ======= View ======= */
const baseView = {
    init: function (elementIds, courses) {
        this.courseSelection = new CoursesDropdownMenu(elementIds.courseDropdownId, courses);
        this.outputView = new OutputView(elementIds.outputAreaId);

        this.studentInputField = document.getElementById(elementIds.studentFieldId);
        this.teacherField = document.getElementById(elementIds.teacherFieldId);
    },

    /* Called as a helper function when a student is added - "Add Student" button is clicked. */
    inputValid(studentName) {
        if (!this.courseSelection.hasSelectedCourse()) {
            alert(OutputView.UnselectedCourseMsg);
            return false;
        }

        // add student to model and database
        if (studentName === '') {
            alert("Blank student name entered");
            return false;
        }

        return true;
    },

    emptyTeacherAndStudentFields: function () {
        this.teacherField.value = '';
        this.outputView.element.innerHTML = '';
    },

    addStudentToOutput(newStudent) {
        this.outputView.addStudentToOutput(newStudent);
    },
}


class CoursesDropdownMenu {

    constructor(elementId, courses) {
        this.element = document.getElementById(elementId);

        // render this view (update the DOM elements with the right values)
        this.populateWithCourses(courses);
    }

    populateWithCourses(courses) {
        courses.forEach(course => {
            const option = document.createElement("option");
            option.id = course.id;
            option.text = course.name;
            this.element.appendChild(option);
        });
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

    displayStudents(students, currentCourseId) {
        this.element.innerHTML = "";
        students.forEach(student =>
            this.element.appendChild(OutputView.studentListItem(student, currentCourseId)));
    }

    // called from html when sort asc or des is clicked
    sort(reverse, students, validCourseIsSelected) {
        if (!validCourseIsSelected) {
            alert(OutputView.UnselectedCourseMsg);
            return;
        }

        students.sort(function (stud1, stud2) {
            const name1 = stud1.name;
            const name2 = stud2.name;
            return name1 < name2 ? -1 : name1 > name2 ? 1 : 0;
        });

        if (reverse) {
            students.reverse();
        }

        this.displayStudents(students);
    }

    addStudentToOutput(student) {
        console.log('addStudentToOutput() student: ', student);
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
            controller.deleteStudentFromServer(studentId);
            var div = this.parentElement;
            div.style.display = "none";
        }

        return span
    }
}