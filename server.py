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
  courses2 = session.query(Course).all()
  return jsonify([r.serialize for r in courses2])


@app.route('/addstudent', methods=['GET', 'POST'])
def addStudent():
  if request.method == "POST":
    newStudentName = request.form.get("StudentName")
    courseName = request.form.get("CourseName")

    course = session.query(Course).filter_by(name=courseName).first()

    newStudent = Student(name=newStudentName)
    session.add(newStudent)
    course.students.append(newStudent)
    session.commit()

    return "success"

  return "fail"



if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5000)
