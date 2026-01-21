from flask import Blueprint, jsonify, request
from repositories.products_repository import get_products_by_search, get_products_by_category, get_all_products

product_routes = Blueprint("product_routes", __name__, url_prefix="/api/products")

@product_routes.route("/", methods=["GET"])
def get_products():
    try:
        # 1. Get parameters from the URL
        query = request.args.get('q')
        category = request.args.get('category')

        # 2. Logic: If there is a search query (?q=toys)
        if query:
            print(f"DEBUG: Searching for query: {query}")
            products = get_products_by_search(query)
            return jsonify(products), 200

        # 3. Logic: If there is a category filter (?category=Toys)
        if category:
            print(f"DEBUG: Filtering by category: {category}")
            products = get_products_by_category(category)
            return jsonify(products), 200

        # 4. Default: Return everything if no params
        return jsonify(get_all_products()), 200

    except Exception as e:
        print(f"SERVER ERROR: {e}")
        return jsonify({"error": str(e)}), 500