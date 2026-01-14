from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import mongo

user_bp = Blueprint("user", __name__, url_prefix="/api/user")

@user_bp.route("/dashboard-data", methods=["GET"])
@jwt_required()
def dashboard_data():
    email = get_jwt_identity()

    # 1. Fetch User Profile
    user = mongo.db.users.find_one(
        {"email": email},
        {"password": 0} 
    )

    if not user:
        return jsonify({"error": "User not found"}), 404

    # 2. Fetch Orders (Filtering by 'email' field)
    # Note: .sort("created_at", -1) use karein kyunki order mein created_at store ho raha hai
    orders_cursor = mongo.db.orders.find({"email": email}).sort("created_at", -1)
    orders = list(orders_cursor)

    # Convert ObjectIds to strings
    user["_id"] = str(user["_id"])
    for order in orders:
        order["_id"] = str(order["_id"])
        if "created_at" in order:
            order["created_at"] = order["created_at"].isoformat()

    return jsonify({
        "user": {
            "email": user.get("email"),
            "contact": user.get("contact", {}),
            "addresses": user.get("addresses", []),
            "preferences": user.get("preferences", [])
        },
        "orders": orders
    }), 200