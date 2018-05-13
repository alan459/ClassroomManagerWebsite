/* ======= Model ======= */

var model =
{
    currentCourse: null,
    courses: [],

    init: function(data)
    {
        this.courses = data;
        this.currentCourse = this.courses[0];
    },

    addStudent: function(studentName)
    {
        this.currentCourse.students.push(studentName);

        $.post("/addstudent",
        {
            StudentName : studentName,
            CourseName: this.currentCourse['name']
        });
    },
};

/* ======= Controller ======= */

var controller = {

    init: function()
    {
        $.getJSON('http://0.0.0.0:5000/courseInfo', function(data)
        {
            model.init(data);
            courseListView.init();
        });
    },

    // add student to model and database
    addStudentToCurrentCourse: function(studentName)
    {
        model.addStudent(studentName);
    },

    getTeacherForCurrentCourse: function()
    {
        return model.currentCourse['teacher'];
    },

    getStudentsForCurrentCourse: function()
    {
        return model.currentCourse['students'];
    },

    getStudentNamesForCurrentCourse: function()
    {
        var result = [];
        for (const studentId in model.currentCourse['students'])
        {
            result.push(model.currentCourse['students'][studentId]);
        }

        return result;
    },

    getCourses: function()
    {
        return model.courses;
    },

    // set the currently-selected course to the id of the passed in course
    setCurrentcourse: function(courseNum)
    {
        model.currentCourse = model.courses[courseNum];
    },

};


/* ======= View ======= */

var courseListView = {

    init: function()
    {
        // store the DOM element for easy access later
        this.courseListElem = document.getElementById('courseID');

        // render this view (update the DOM elements with the right values)
        this.render();
    },

    render: function()
    {
        // get the courses we'll be rendering from the controller
        var courses = controller.getCourses();

        // empty the course list
        this.courseListElem.innerHTML = '';

        // loop over the courses
        var course, elem, i;
        for (i = 0; i < courses.length; i++)
        {
            // this is the course we're currently looping over
            course = courses[i];

            // make a new course list item and set its text
            elem = document.createElement('option');
            elem.textContent = course['name'];
            elem.id = course['id']

            // finally, add the element to the list
            this.courseListElem.appendChild(elem);
        }
    }
};

// make it go!
controller.init();

// fetches course info whenever a new course is selected, including teacher and students
function courseChanged()
{
    controller.setCurrentcourse(document.getElementById("courseID").selectedIndex);

    // set teacher for selected course from model
    document.getElementById("teacherID").value = controller.getTeacherForCurrentCourse();

    // empty the students list
    document.getElementById("studentsInCourseOutput").value = '';

    // get student names of students in this class and display them in output
    var studentNames = controller.getStudentNamesForCurrentCourse();
    $('#studentsInCourseOutput').val(studentNames.join('\n'));
};


// called from html when student is added - "Add Student" button is clicked
function studentAdded()
{
    // add student to model and database
    var studentName = $('#studentName').val();

    if (studentName == "")
    {
        alert("Blank student name entered");
        return;
    }

    controller.addStudentToCurrentCourse(studentName);

    // add new student in course to output text area
    $('#studentsInCourseOutput').val(function(i, text)
    {
        return text + "\n" + studentName;
    });

    // empty the student input field
    document.getElementById("studentName").value = '';
}

// callled from html when sort asc is clicked
function sortAscending()
{
    var studentNames = controller.getStudentNamesForCurrentCourse().sort();
    $('#studentsInCourseOutput').val(studentNames.join('\n'));
}

// callled from html when sort des is clicked
function sortDescending()
{
    var studentNames = controller.getStudentNamesForCurrentCourse().sort().reverse();
    $('#studentsInCourseOutput').val(studentNames.join('\n'));
}


