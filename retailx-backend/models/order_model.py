from extensions import mongo
from datetime import datetime

class Order:
    @staticmethod
    def create_order(email, items, total, address_details):
        order_data = {
            "email": email,           # Ye sabse imp hai Dashboard ke liye
            "items": items,
            "total": total,
            "address_details": address_details,
            "status": "Processing",
            "created_at": datetime.utcnow()
        }
        return mongo.db.orders.insert_one(order_data)