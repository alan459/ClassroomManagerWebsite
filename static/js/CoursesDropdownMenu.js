
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
