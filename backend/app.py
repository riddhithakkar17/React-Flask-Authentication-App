from flask import Flask, request
from flask_httpauth import HTTPBasicAuth
from models.User import User
from create_models import session, Base, engine
import json
import base64
import datetime
from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app)

auth = HTTPBasicAuth()
app.config['CORS_HEADERS'] = 'Content-Type'

def drop_all_tables():
    User.__table__.drop(engine,checkfirst=True)

#drop_all_tables()
Base.metadata.create_all(engine)

@app.route('/', methods = ['GET'])
@cross_origin()
def hello():
    return 'Hello, World!'

@app.route("/user", methods = ['GET'])
@cross_origin()
@auth.login_required
def get_all_user():
    output = []
    for user in session.query(User).all():
        output.append(user.as_dict())
    print(output)
    return json.dumps(output)

@auth.verify_password
def authenticate(username, password):
    print(username)
    if password == session.query(User).filter(User.username==username).first().password:
        return True
    else:
        return False

@app.route("/user/<id>", methods = ['GET'])
@cross_origin()
@auth.login_required
def get_user_id(id):
    if request.method == "GET":
        sing_user = session.query(User).filter(User.id==id).first()
        return json.dumps(sing_user.as_dict())

@app.route("/username/<username>", methods = ['GET'])
@cross_origin()
@auth.login_required
def get_user_username(username):
    if request.method == "GET":
        sing_user = session.query(User).filter(User.username == username).first()
        return json.dumps(sing_user.as_dict())

@app.route("/user", methods = ['POST'])
@cross_origin()
def user():
    if request.method == "POST":
        data = json.loads(request.data)
        new_usr = User(
            email=data["email"],
            name=data["name"],
            bio=data["bio"],
            phone=data["phone"],
            username=data["username"],
            password=data["password"]
            )
        session.add(new_usr)
        session.commit()
        return json.dumps(True)

@app.route("/user", methods=['PUT'])
@cross_origin()
@auth.login_required
def update_user():
    data = json.loads(request.data)
    oldUser = session.query(User).filter(User.id==data["id"]).first()
    oldUser.id=data['id']
    oldUser.email=data["email"]
    oldUser.name=data["name"]
    oldUser.bio=data["bio"]
    oldUser.phone=data["phone"]
    oldUser.username=data["username"]
    oldUser.password=data["password"]
    session.commit()
    return json.dumps(True)

@app.route("/login",methods=['POST'])
@cross_origin()
@auth.login_required
def authenticate():
    data = json.loads(request.data)
    print(data)
    username_password = base64.b64decode(data["code"]).decode("utf-8")
    print(username_password)
    singUser = session.query(User).filter(User.username==username_password.split(":")[0]).first()
    singUser.last_login_time = datetime.datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
    session.commit()
    return json.dumps(True)


@app.route("/get_base/<id>", methods=["GET"])
@cross_origin()
def get_base_(id):
    msg = session.query(User).filter(User.id==id).first().username+":"+session.query(User).filter(User.id==id).first().password
    print(msg)
    return base64.b64encode(msg.encode("ascii"))

@app.route("/base_decode/<hash>", methods=["GET"])
@cross_origin()
def get_base_id(hash):
    return base64.b64decode(hash)

@app.route("/forgotPassword", methods=["POST"])
@cross_origin()
def forgotPassword():
    data = json.loads(request.data)
    username = data["username"]
    password = data["password"]
    singUser = session.query(User).filter(User.username==username).first()
    if singUser != None:
        singUser.username = username
        singUser.password = password
        session.commit()
    else:
        return json.dumps(False)
    return json.dumps(True)


if __name__ == '__main__':
      app.run(host='0.0.0.0', port=80)