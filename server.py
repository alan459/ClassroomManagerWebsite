from flask import Flask, render_template, request, redirect, jsonify, url_for
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database_setup import Course, Student, Base

app = Flask(__name__)

engine = create_engine('sqlite:///classes.db')
Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)
session = DBSession()


@app.route('/')
@app.route('/classroom/')
def showMainPage():

    return render_template('ClassroomManager.html')


@app.route('/courseInfo')
def getCourses():
    # query courses from database and return in JSON format
    courses = session.query(Course).all()
    return jsonify([r.serialize for r in courses])


@app.route('/classroom/api/courses/<int:course_id>/students/', methods=['POST'])
def addStudent(course_id):
    # if request.method == "POST":
    newStudentName = request.form.get("StudentName")

    course = session.query(Course).get(course_id)
    newStudent = Student(name=newStudentName)

    session.add(newStudent)
    course.students.append(newStudent)

    session.commit()
    print newStudent.id

    return jsonify({
        'status': 'success',
        'newId': newStudent.id
    })


@app.route('/classroom/api/courses/<int:course_id>/students/<int:student_id>', methods=['DELETE'])
def deleteStudentFromCourse(course_id, student_id):
    course = session.query(Course).get(course_id)
    student = session.query(Student).get(student_id)

    if not student or not course:
        return "Fail"

    course.students.remove(student)

    return jsonify({'result': True})


if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5000)
