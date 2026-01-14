from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user_model import User
from models.order_model import Order

orders_bp = Blueprint("orders", __name__, url_prefix="/api/orders")

@orders_bp.route("/create", methods=["POST"])
@jwt_required()
def create_order():
    try:
        email = get_jwt_identity()
        data = request.get_json()

        address = data.get("address")
        items = data.get("items")
        total = data.get("total")

        # Validation
        if not address or not items or total is None:
            return jsonify({"error": "Missing required order data"}), 400

        # 1. Update User Profile (Latest Address save karne ke liye)
        User.save_contact_and_address(
            email=email,
            contact={"email": address.get("email"), "phone": address.get("phone")},
            address=address
        )

        # 2. Save Order to Database
        result = Order.create_order(email, items, total, address)

        if result.inserted_id:
            return jsonify({
                "message": "Order successfully recorded", 
                "order_id": str(result.inserted_id)
            }), 201
        
        return jsonify({"error": "Failed to save order to database"}), 500

    except Exception as e:
        print(f"❌ BACKEND ERROR: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500