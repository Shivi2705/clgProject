from extensions import mongo
from bson import ObjectId
import re

def format_product(p):
    if not p:
        return None

    return {
        "id": str(p.get("_id")),
        "name": p.get("name"),
        "description": p.get("description"),
        "category": p.get("category"),
        "subCategory": p.get("subCategory"),
        "brand": p.get("brand"),
        "price": p.get("price"),
        "discount": p.get("discount", 0),
        "finalPrice": p.get("finalPrice"),
        "stock": p.get("stock", 0),
        "rating": p.get("rating", 0),
        "reviewsCount": p.get("reviewsCount", 0),
        "imageURL": p.get("imageURL") or (
            p.get("images", [""])[0] if p.get("images") else ""
        ),
        "tags": p.get("tags", []),
        "isActive": p.get("isActive", True),
        "highlights": p.get("highlights", []),
        "specs": p.get("specs", {}),
        "aiMetadata": p.get("aiMetadata", {}),
        "images": p.get("images", [])
    }


def get_all_products():
    products = mongo.db.products.find({"isActive": True})
    return [format_product(p) for p in products]


def get_product_by_id(product_id):
    product = mongo.db.products.find_one({"_id": ObjectId(product_id)})
    return format_product(product)

def get_products_by_search(search_query):
    # Regex makes it case-insensitive (toys matches Toys)
    regex = re.compile(search_query, re.IGNORECASE)
    
    # Search in name, category, OR brand
    products = mongo.db.products.find({
        "isActive": True,
        "$or": [
            {"name": regex},
            {"category": regex},
            {"brand": regex}
        ]
    })
    return [format_product(p) for p in products]

def get_products_by_category(category_name):
    # Case-insensitive exact match for category
    regex = re.compile(f"^{category_name}$", re.IGNORECASE)
    products = mongo.db.products.find({"category": regex, "isActive": True})
    return [format_product(p) for p in products]