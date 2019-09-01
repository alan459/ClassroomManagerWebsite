
class OutputView {

    static UnselectedCourseMsg = "Please select a course";

    constructor(elementId) {
        this.element = document.getElementById(elementId);
        this.elementId = elementId;
    }

    displayStudents(students) {
        this.element.innerHTML = "";
        const currentCourseId = baseView.courseSelection.getIdOfSelectedCourse();
        students.forEach(student => this.element.appendChild(OutputView.studentListItem(student, currentCourseId)));
    }

    // called from html when sort asc or des is clicked
    sort(reverse) {
        if (!baseView.courseSelection.hasSelectedCourse()) {
            alert(OutputView.UnselectedCourseMsg);
            return;
        }

        const students = controller.getStudentsForCurrentCourse();

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
            //change = new ChangeMade(OperationsEnums.DELETE_STUDENT, studentId, courseId);

            //controller.newChange(change);

            controller.deleteStudentFromServer(studentId, courseId);
            var div = this.parentElement;
            div.style.display = "none";
        }

        return span
    }
}