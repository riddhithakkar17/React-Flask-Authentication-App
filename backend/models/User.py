from sqlalchemy import Column, Integer, String, DateTime
import datetime
from create_models import Base
from sqlalchemy.sql import func
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True,autoincrement=True)
    email = Column(String(120), unique=True, nullable=False)
    username = Column(String(120), unique=True, nullable=False)
    password = Column(String(120), unique=False,nullable=False)
    name = Column(String(120), unique=False, nullable=False)
    bio = Column(String(512), unique=False, nullable=True)
    phone = Column(String(10), unique=False, nullable=False)
    last_login_time = Column(String(128), unique=False, nullable=True)


    def __repr__(self):
        return '<User %r>' % self.id

    def as_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}