"""
Base declaration and basic setup of database

"""
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine 
engine = create_engine('sqlite:///school.db', echo=True)
Session = sessionmaker(bind=engine)
# create a Session
session = Session()
Base = declarative_base()