from hashlib import new
from flask import Flask, jsonify, request, json, session
from flask_session import Session
from flask_cors import CORS
from random import randrange
from flask_sqlalchemy import SQLAlchemy
import fastf1
import fastf1.plotting
import pandas as pd
import requests
import datetime
from datetime import timedelta
from set_values import driver_key_val_pair, team_color_pair
# import asyncio

app = Flask(__name__)

# Flask Session config
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=1)
app.config['SESSION_TYPE'] = 'filesystem'
# app.config['SESSION_FILE_DIR'] = './flask_session/'
app.config['SESSION_FILE_THRESHOLD'] = 5
app.config["SECRET_KEY"] = "OCML3BRawWEUeaxcuKHLpw"
app.config['SESSION_COOKIE_NAME'] = "F1 Cookie"
Session(app)

# SQL Alchemy config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///example.db'
app.config['SQLALCHEMY_BINDS'] = {
    "year": "sqlite:///year.db",
    "race": "sqlite:///race.db",
    "event": "sqlite:///event.db",
    "driver": "sqlite:///driver.db",
    "selections": "sqlite:///selections.db",
}
db = SQLAlchemy(app)
CORS(app)
fastf1.Cache.enable_cache('../f1_cache')
# global g_selected_year


class Year(db.Model):
    __bind_key__ = 'year'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(80), unique=True)

    def __str__(self):
        return f'{self.id} {self.content}'


class Selections(db.Model):
    __bind_key__ = 'selections'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(80), unique=True)
    # driver_list = db.Column(db.JSON, unique=True)

    def __str__(self):
        return f'{self.id} {self.content}'


class Race(db.Model):
    __bind_key__ = 'race'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(80), unique=True)

    def __str__(self):
        return f'{self.id} {self.content}'


class Event(db.Model):
    __bind_key__ = 'event'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(80), unique=True)

    def __str__(self):
        return f'{self.id} {self.content}'


class Driver(db.Model):
    __bind_key__ = 'driver'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(80), unique=True)

    def __str__(self):
        return f'{self.id}, {self.content}'


class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)

    def __str__(self):
        return f'{self.id} {self.content}'


db.create_all()
db.drop_all(bind='selections')
db.session.commit()


def serializer(todo):
    return {'id': todo.id,
            'content': todo.content}


@app.route('/api/getyear', methods=['GET'])
def getyear():
    curr_year = datetime.datetime.now().year+1
    year_db_len = len(Year.query.all())
    latest_entry = Year.query.filter_by(id=year_db_len).first().content
    if str(latest_entry) > str(curr_year):
        db.session.add(
            Year(content=(int(latest_entry)+1)))
    db.session.commit()
    return jsonify([*map(serializer, Year.query.all())])


@app.route('/api/getrace', methods=['GET'])
def getrace():
    # if not Selections.query.all():
    #     return jsonify([])
    return jsonify([*map(serializer, Race.query.all())])


@app.route('/api/getevent', methods=['GET'])
def getevent():
    # if len(Selections.query.all()) <= 2:
    #     return jsonify([])
    return jsonify([*map(serializer, Event.query.all())])


@app.route('/api/getdriver', methods=['GET'])
def getdriver():
    return jsonify([*map(serializer, Driver.query.all())])


@app.route('/api/selectyear', methods=['POST'])
def selectyear():
    if request.method == 'POST':
        selected_year = request.get_json(force=True)

        session['YEAR'] = str(selected_year)
        # print("######################"+str(session))
        # selected_year_session = session.get("YEAR")
        # app.logger.info(type(selected_year_session))

        # Setting up Selections db
        db.create_all(bind='selections')
        if not Selections.query.all():
            db.session.add(Selections(id=1, content=selected_year))
            db.session.commit()
        else:
            db.drop_all(bind='selections')
            db.create_all(bind='selections')
            db.session.add(Selections(id=1, content=selected_year))
            db.session.commit()

        f1_season = fastf1.get_event_schedule(int(selected_year))
        event_records = f1_season[['RoundNumber', 'EventName']]
        circuit_list = list(
            f1_season['EventName'][datetime.datetime.now() > f1_season['Session5Date']])
        db.create_all(bind='race')
        db.drop_all(bind='race')
        db.create_all(bind='race')
        for race in circuit_list:
            db.session.add(Race(content=race))
        db.session.commit()
        return {"201": selected_year}


@app.route('/api/selectrace', methods=['POST'])
def selectrace():
    if request.method == 'POST':
        selected_race = request.get_json(force=True)
        session['RACE'] = str(selected_race)
        # selected_year = session.get("YEAR")
        # app.logger.info(selected_year)
        # selected_year = 2021

        # Setting up Selections db
        db.create_all(bind='selections')
        if len(Selections.query.all()) < 2:
            db.session.add(Selections(id=2, content=selected_race))
        else:
            for i in range(2, len(Selections.query.all())+1):
                Selections.query.filter_by(id=i).delete()
            db.session.add(Selections(id=2, content=selected_race))
        db.session.commit()
        selected_year = Selections.query.filter_by(id=1).first().content
        f1_session = fastf1.get_event(int(selected_year), selected_race)
        f1_session_list = [f1_session['Session1'], f1_session['Session2'],
                           f1_session['Session3'], f1_session['Session4'], f1_session['Session5']]
        db.create_all(bind='event')
        db.drop_all(bind='event')
        db.create_all(bind='event')
        for event in f1_session_list:
            db.session.add(Event(content=event))
        db.session.commit()
        return {"201": selected_race}


@app.route('/api/selectevent', methods=['POST'])
def selectevent():
    if request.method == 'POST':
        selected_event = request.get_json(force=True)
        # selected_year = 2021
        # selected_race = "Bahrain Grand Prix"

        # Setting up Selections db
        db.create_all(bind='selections')
        if len(Selections.query.all()) < 3:
            db.session.add(Selections(id=3, content=selected_event))
        else:
            for i in range(3, len(Selections.query.all())+1):
                Selections.query.filter_by(id=i).delete()
            db.session.add(Selections(id=3, content=selected_event))

        selected_year = Selections.query.filter_by(id=1).first().content
        selected_race = Selections.query.filter_by(id=2).first().content

        # selected_year = session.get("YEAR")
        # selected_race = session.get("RACE")
        # round_number = 1

        f1_season = fastf1.get_event_schedule(int(selected_year))
        event_records = f1_season[['RoundNumber', 'EventName']]
        round_number = pd.DataFrame(event_records)[event_records['EventName']
                                                   == selected_race]['RoundNumber']

        driver_list = [x[:3] for x in requests.get(
            "http://ergast.com/api/f1/{}/{}/drivers".format(selected_year, round_number.iloc[0])).text.split('code="')[1:]]
        db.create_all(bind='driver')
        db.drop_all(bind='driver')
        db.create_all(bind='driver')
        for driver in driver_list:
            db.session.add(Driver(content=driver))
        db.session.commit()
        return {"201": selected_event}


@app.route('/api/selectdriver', methods=['POST'])
def selectdriver():
    if request.method == 'POST':
        # list of multi select drivers (real-time changes)
        selected_drivers = request.get_json(force=True)
        new_s = ''.join(selected_drivers)
        # app.logger.info("##########", selected_drivers)
        # new_s = json.dumps(selected_drivers)

        db.create_all(bind='selections')
        if len(Selections.query.all()) < 4:
            try:
                Selections.query.filter_by(id=4).delete()
                db.session.add(Selections(id=4, content=new_s))
            except:
                db.session.add(Selections(id=4, content=new_s))
            db.session.commit()
        else:
            for i in range(4, len(Selections.query.all())+1):
                Selections.query.filter_by(id=i).delete()
                db.session.commit()
            db.session.add(Selections(id=4, content=new_s))
        db.session.commit()
        # app.logger.info(
        #     "##########", Selections.query.filter_by(id=4).first().content)
        return {"201": selected_drivers}


@app.route('/api/lap_number_time')
def getChartData():
    # Get Data from Sessions
    # selected_year = 2022
    # selected_race = "Emilia Romagna Grand Prix"
    # selected_event = "Race"
    # selected_drivers = ["HAM", 'MSC']

    # How to Wait until options are selected?
    selected_year = Selections.query.filter_by(id=1).first().content
    selected_race = Selections.query.filter_by(id=2).first().content
    selected_event = Selections.query.filter_by(id=3).first().content
    app.logger.info(
        "###########Year Race Event Selections done", selected_event)
    # try:
    new_s = Selections.query.filter_by(id=4).first().content
    # selected_drivers = json.loads(new_s)
    selected_drivers = []
    for index in range(0, len(new_s), 3):
        selected_drivers. append(new_s[index: index + 3])

    # Call the API with data
    fastf1_session = fastf1.get_session(
        int(selected_year), selected_race, selected_event)
    fastf1_session.load(telemetry=False, laps=True, weather=False)

    lap_time_number = fastf1_session.laps[[
        'Driver', 'LapTime', 'Compound', 'TyreLife', 'LapNumber']].copy()
    lap_time_number = lap_time_number[lap_time_number['Driver'].isin(
        selected_drivers)]
    lap_time_number['LapTime'] = lap_time_number['LapTime'].fillna(
        timedelta(0))
    lap_time_number['Year'] = selected_year
    lap_time_number['Compound'] = lap_time_number['Compound'].fillna("")
    lap_time_number['TyreLife'] = lap_time_number['TyreLife'].fillna(-1)
    lap_time_number['LapTime'] = pd.to_numeric(
        lap_time_number['LapTime'])/1000000

    # TimeDelta
    lap_time_number_cov = lap_time_number.to_dict('records')
    final_dict = {}
    for data in lap_time_number_cov:
        primary_key = data['Driver']
        data[primary_key] = data.pop('LapTime')

        driv_lap = fastf1_session.laps.pick_driver(primary_key).pick_fastest()
        try:
            team = driv_lap['Team']
            color = team_color_pair[team]
        except:
            color = "#ffffff"
        data['color'] = color

        if primary_key not in final_dict:
            final_dict[primary_key] = [data]
        else:
            final_dict[primary_key].append(data)
    return jsonify(final_dict)


@app.route('/api/speed_distance')
def speed_distance():
    selected_year = 2021
    selected_race = "Bahrain Grand Prix"
    selected_event = "Race"
    round_number = 1
    selected_drivers = ['HAM', 'MSC']
    fastf1_session = fastf1.get_session(
        selected_year, selected_race, selected_event)
    fastf1_session.load(telemetry=True, laps=True, weather=False)

    driv_tel = {}
    for driver in selected_drivers:
        driv_lap = fastf1_session.laps.pick_driver(driver).pick_fastest()
        color = fastf1.plotting.team_color(driv_lap['Team'])
        driv_tel[driver] = driv_lap.get_car_data().add_distance(
        )[['Speed', 'Distance', 'RPM', 'nGear', 'Throttle', 'Brake', 'DRS']]
        driv_tel[driver]['Brake'] = driv_tel[driver]['Brake'].astype(int)
        driv_tel[driver]['color'] = color
        driv_tel[driver] = driv_tel[driver].to_dict('records')
    return jsonify(driv_tel)


if __name__ == '__main__':
    app.run(debug=True)
