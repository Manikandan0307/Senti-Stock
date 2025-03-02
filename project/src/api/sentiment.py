import mysql.connector
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import bcrypt
from textblob import TextBlob

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})  # Allow requests from your React app

# Database connection function
def get_db_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='Mrperfect@123',
        database='stock_portal'
    )

# User registration route
@app.route('/register', methods=['POST'])
@cross_origin(origin='http://localhost:5173')
def register():
    data = request.get_json()
    name = data.get('name')
    mobile_number = data.get('mobile_number')
    age = data.get('age')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirm_password')

    if not name or not mobile_number or not age or not email or not password or not confirm_password:
        return jsonify({'error': 'All fields are required'}), 400

    if password != confirm_password:
        return jsonify({'error': 'Passwords do not match'}), 400

    # Convert age to an integer
    try:
        age = int(age)
    except ValueError:
        return jsonify({'error': 'Invalid age format'}), 400

    if age < 18:
        return jsonify({'error': 'You must be 18 or older to register'}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
        existing_user = cursor.fetchone()
        if (existing_user):
            return jsonify({'error': 'Email already registered'}), 400

        cursor.execute('''
            INSERT INTO users (name, mobile_number, age, email, password)
            VALUES (%s, %s, %s, %s, %s)
        ''', (name, mobile_number, age, email, hashed_password))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'Registration successful!'}), 201

    except mysql.connector.Error as err:
        return jsonify({'error': f"Database error: {err}"}), 500

# User login route
@app.route('/login', methods=['POST'])
@cross_origin(origin='http://localhost:5173')
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({'error': 'Invalid email or password'}), 400

        stored_password = user[5]
        if bcrypt.checkpw(password.encode('utf-8'), stored_password.encode('utf-8')):
            cursor.close()
            conn.close()
            return jsonify({'message': 'Login successful!'}), 200
        else:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Invalid email or password'}), 400

    except mysql.connector.Error as err:
        return jsonify({'error': f"Database error: {err}"}), 500

# Sentiment analysis route
@app.route('/analyze-sentiment', methods=['POST'])
@cross_origin(origin='http://localhost:5173')
def analyze_sentiment():
    data = request.get_json()
    text = data.get('text')

    if not text:
        return jsonify({'error': 'Text is required'}), 400

    blob = TextBlob(text)
    polarity = blob.sentiment.polarity

    if polarity > 0:
        sentiment = 'positive'
    elif polarity < 0:
        sentiment = 'negative'
    else:
        sentiment = 'neutral'

    return jsonify({'sentiment': sentiment, 'polarity': polarity}), 200

# Home route
@app.route('/')
def home():
    return "Welcome to the Stock and Mutual Fund API!"

if __name__ == '__main__':
    app.run(debug=False, port='0.0.0.0')
