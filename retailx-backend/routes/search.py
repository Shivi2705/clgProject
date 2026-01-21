from flask import Blueprint, jsonify, request

# ✅ Correct imports
from extensions import mongo
from repositories.products_repository import format_product

search_bp = Blueprint('search_bp', __name__)

@search_bp.route("", methods=["GET"])
def search_products():
    query = request.args.get('q', '').strip()
    category = request.args.get('category', '').strip()

    # Agar dono khali hain toh empty list
    if not query and not category:
        return jsonify([])

    # Filter build karein
    filters = []
    if query:
        filters.append({"name": {"$regex": query, "$options": "i"}})
        filters.append({"brand": {"$regex": query, "$options": "i"}})
        filters.append({"tags": {"$regex": query, "$options": "i"}})
    
    if category:
        filters.append({"category": {"$regex": category, "$options": "i"}})

    search_filter = {"$or": filters}

    products = list(mongo.db.products.find(search_filter))
    result = [format_product(p) for p in products]
    return jsonify(result)