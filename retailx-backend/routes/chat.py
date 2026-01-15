import os
import traceback
from flask import Blueprint, request, jsonify
from google import genai
from google.genai.errors import ClientError
from extensions import mongo

chat_bp = Blueprint("chat_bp", __name__)

# Gemini Client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def get_products_from_db(query):
    try:
        query = query.lower() if query else ""
        generic_keywords = ["what", "have", "items", "products", "list", "inventory", "show", "all", "beauty"]

        if any(word in query for word in generic_keywords) or len(query) < 3:
            results = list(mongo.db.products.find({"isActive": True}).limit(8))
        else:
            search_query = {
                "$or": [
                    {"name": {"$regex": query, "$options": "i"}},
                    {"tags": {"$regex": query, "$options": "i"}},
                    {"category": {"$regex": query, "$options": "i"}},
                    {"aiMetadata.style": {"$regex": query, "$options": "i"}},
                    {"aiMetadata.concern": {"$regex": query, "$options": "i"}}
                ]
            }
            results = list(mongo.db.products.find(search_query).limit(5))

        product_list = ""
        for p in results:
            product_list += (
                f"- {p.get('name')} (Brand: {p.get('brand')})\n"
                f"  Price: ₹{p.get('finalPrice')} | Rating: {p.get('rating')}⭐\n"
                f"  Best for: {p.get('aiMetadata', {}).get('style', 'General')} styles and "
                f"{p.get('aiMetadata', {}).get('concern', 'daily use')} concerns.\n"
            )

        print("Checking DB:", mongo.db.name, "Collection:", mongo.db.products.count_documents({}))
        return product_list or "No products found."

    except Exception as e:
        print("DB Error:", e)
        return "Product data unavailable."


@chat_bp.route("/", methods=["POST", "OPTIONS"])
def chat_endpoint():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    try:
        data = request.get_json()
        if not data or "message" not in data:
            return jsonify({"reply": "Message missing"}), 400

        user_message = data["message"]
        context_data = get_products_from_db(user_message)

        system_instruction = f"""
You are the RetailX Beauty Expert ✨.

Available Products:
{context_data}

RULES:
- Use Markdown
- Bold product names
- ₹ for prices
- ⭐ for ratings
- Friendly, premium tone
- End with a helpful question
"""

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=f"{system_instruction}\nUser: {user_message}"
        )

        return jsonify({"reply": response.text})

    except ClientError as ce:
        # 🔥 QUOTA / BILLING ERROR HANDLED
        if "RESOURCE_EXHAUSTED" in str(ce):
            return jsonify({
                "reply": "✨ Our beauty assistant is a bit busy right now. Please try again in a minute!"
            }), 200

        traceback.print_exc()
        return jsonify({"reply": "AI service error"}), 500

    except Exception:
        traceback.print_exc()
        return jsonify({"reply": "Server error"}), 500
