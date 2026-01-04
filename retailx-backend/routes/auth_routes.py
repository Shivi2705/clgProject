from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from extensions import bcrypt
from models.user_model import User
import re

auth_bp = Blueprint("auth", __name__)

# 🔐 Password validator
def is_strong_password(password):
    if len(password) < 8:
        return False
    if not re.search(r"[A-Z]", password):
        return False
    if not re.search(r"[a-z]", password):
        return False
    if not re.search(r"[0-9]", password):
        return False
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False
    return True


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not all([name, email, password]):
        return jsonify({"message": "All fields are required"}), 400

    if not is_strong_password(password):
        return jsonify({
            "message": "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
        }), 400

    if User.find_by_email(email):
        return jsonify({"message": "User already exists"}), 400

    hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")
    User.create_user(name, email, hashed_pw)

    token = create_access_token(identity=email)
    return jsonify({"token": token, "message": "User registered successfully"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = User.find_by_email(email)
    if not user:
        return jsonify({"message": "Invalid credentials"}), 401

    if not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"message": "Invalid credentials"}), 401

    token = create_access_token(identity=email)
    return jsonify({"token": token, "message": "Login successful"}), 200
