import os
import sys
from sqlalchemy import Table, Column, ForeignKey, Integer, String, ARRAY
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine

Base = declarative_base()

association_table = Table('association', Base.metadata,
                          Column('course_id', Integer,
                                 ForeignKey('courses.id')),
                          Column('student_id', Integer,
                                 ForeignKey('students.id'))
                          )


class Course(Base):
    __tablename__ = 'courses'

    id = Column(Integer, primary_key=True)
    name = Column(String(250), nullable=False)
    teacher = Column(String(250), nullable=False)
    students = relationship("Student",
                            secondary=association_table,
                            backref="course")

    @property
    def serialize(self):
        """Return object data in easily serializeable format"""
        return {
            'name': self.name,
            'id': self.id,
            'teacher': self.teacher,
            'students': [student.id for student in self.students],
        }


class Student(Base):
    __tablename__ = 'students'

    id = Column(Integer, primary_key=True)
    name = Column(String(250), nullable=False)

    @property
    def serialize(self):
        """Return object data in easily serializeable format"""
        return {
            'name': self.name,
            'id': self.id,
        }


engine = create_engine('sqlite:///classes.db')


Base.metadata.create_all(engine)
