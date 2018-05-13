from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database_setup import Course, Student, Base

engine = create_engine('sqlite:///classes.db')
# Bind the engine to the metadata of the Base class so that the
# declaratives can be accessed through a DBSession instance

# initialize database:
Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)

session = DBSession()

# add to database:
student1 = Student(name="Sam Wilson")
session.add(student1)

student2 = Student(name="Alicia Carter")
session.add(student2)

student3 = Student(name="Michael Fox")
session.add(student3)

student4 = Student(name="Anna Smith")
session.add(student4)

course1 = Course(name="Algebra I", teacher="Mr. Alberts")
course1.students.append(student1)
course1.students.append(student2)
course1.students.append(student3)

course1 = Course(name="Algebra II", teacher="Mr. Wu")

course2 = Course(name="Calculus", teacher="Mr. Graham")

course3 = Course(name="Geometry", teacher="Mrs. Stein")

course4 = Course(name="Chemistry", teacher="Mr. Dalton")
course4.students.append(student1)

course5 = Course(name="Spanish I", teacher="Mrs. Ramirez")

course6 = Course(name="Spanish II", teacher="Mrs. Ramirez")
course6.students.append(student1)

course7 = Course(name="Spanish III", teacher="Mr. Gomez")
course7.students.append(student1)

session.add(course1)
session.add(course2)
session.add(course3)
session.add(course4)
session.add(course5)
session.add(course6)
session.add(course7)

session.commit()



print ("added classes to database!")
