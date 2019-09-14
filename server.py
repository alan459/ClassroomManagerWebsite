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


@app.route('/api/courses/JSON')
def getCourses():
    # query courses from database and return in JSON format
    courses = session.query(Course).all()
    return jsonify([r.serialize for r in courses])


@app.route('/api/courses/<int:course_id>/JSON', methods=['PUT'])
def addStudentToCourse(course_id):
    course = session.query(Course).get(course_id)
    if not course:
        return jsonify({
            'status': 'failed',
            'msg': "course id " + course_id + " not found",
            'id': course_id
        })

    newStudentId = request.form.get("studentId")
    student = session.query(Student).get(newStudentId)

    if not student:
        return jsonify({
            'status': 'failed',
            'msg': "student id " + newStudentId + " not found",
            'id': newStudentId
        })

    course.students.append(student)
    session.commit()

    return jsonify({
        'status': 'success',
        'id': newStudentId,
        'name': student.name
    })


@app.route('/api/students/JSON', methods=['GET'])
def getStudents():
    # query students from database and return in JSON format
    students = session.query(Student).all()
    return jsonify([r.serialize for r in students])


@app.route('/api/students/JSON', methods=['POST'])
def addStudent():
    newStudentName = request.form.get("name")
    newStudent = Student(name=newStudentName)

    session.add(newStudent)
    session.commit()

    return jsonify({
        'status': 'success',
        'id': newStudent.id,
        'name': newStudent.name
    })


@app.route('/api/students/<int:student_id>/JSON', methods=['DELETE'])
def deleteStudent(student_id):
    student = session.query(Student).get(student_id)
    if not student:
        return "Fail"

    session.delete(student)

    return jsonify({'result': True})


if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5000)
