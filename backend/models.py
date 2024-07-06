from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

class TblStudentData(db.Model):
    __table__name = "tbl_student_data"
    student_data_id = db.Column(db.Integer, primary_key = True, autoincrement = True)
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    dob = db.Column(db.String)
    email = db.Column(db.String, unique = True)
    program = db.Column(db.String)
    degree = db.Column(db.String)
    college = db.Column(db.String)
    eligible_to_vote = db.Column(db.Boolean)

class TblRegister(db.Model):
    __table__name = "tbl_register"
    register_id = db.Column(db.Integer, primary_key = True, autoincrement = True)
    email = db.Column(db.String, db.ForeignKey('tbl_student_data.email'))
    password = db.Column(db.String)


class TblFaceRegister(db.Model):
    __table__name = "tbl_face_register"
    face_register_id = db.Column(db.Integer, primary_key = True, autoincrement = True)
    email = db.Column(db.String, db.ForeignKey('tbl_student_data.email'))
    face_register_status = db.Column(db.Boolean, default = False)

class TblElectionsDetails(db.Model):
    __table__name = "tbl_elections_details"
    elections_details_id = db.Column(db.Integer, primary_key = True, autoincrement = True)
    elections_title = db.Column(db.String)
    elections_date = db.Column(db.String)
    elections_start_time = db.Column(db.String)
    elections_end_time = db.Column(db.String)
    info = db.Column(db.String)

class TblCandidatesData(db.Model):
    __table__name = "tbl_candidates_data"
    candidate_id = db.Column(db.Integer, primary_key = True, autoincrement = True)
    candidate_name = db.Column(db.String)
    candidate_email = db.Column(db.String)
    candidate_age = db.Column(db.Integer)
    elections_details_id = db.Column(db.Integer,  db.ForeignKey('tbl_elections_details.elections_details_id'))
    running_to_be = db.Column(db.String)
    manifesto = db.Column(db.String)

class TblVotedStatus(db.Model):
    __table__name = "tbl_voted_status"
    voted_status_id = db.Column(db.Integer, primary_key = True, autoincrement = True)
    email = db.Column(db.String, db.ForeignKey('tbl_student_data.email'))
    voted = db.Column(db.Boolean, default = False)


