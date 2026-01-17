from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

from extensions import mongo, bcrypt, jwt
from routes.auth_routes import auth_bp
from routes.admin_routes import admin_bp
from routes.seller_routes import seller_bp
from routes.preferences_routes import preferences_bp
from routes.products import product_bp
from routes.search import search_bp
from routes.payment_routes import payment_bp
from routes.user_routes import user_bp
from routes.order import orders_bp
from routes.recommendations import recommendation_bp
from routes.chat import chat_bp
from routes.cart_routes import cart_bp 

load_dotenv()

app = Flask(__name__)

CORS(
    app,
    resources={r"/api/*": {"origins": "*"}},
    supports_credentials=True
)

from flask_cors import CORS

CORS(
    app,
    resources={r"/api/*": {"origins": "*"}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)


# CONFIG
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config["JWT_HEADER_NAME"] = "Authorization"
app.config["JWT_HEADER_TYPE"] = "Bearer"

# INIT EXTENSIONS
mongo.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)

# ROUTES
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(admin_bp, url_prefix="/api/admin")
app.register_blueprint(seller_bp, url_prefix="/api/seller")
app.register_blueprint(preferences_bp, url_prefix="/api")
app.register_blueprint(product_bp, url_prefix="/api/products")
app.register_blueprint(search_bp, url_prefix="/api/search")
app.register_blueprint(payment_bp)
app.register_blueprint(user_bp)
app.register_blueprint(orders_bp)
app.register_blueprint(recommendation_bp, url_prefix="/api/recommendations")
app.register_blueprint(chat_bp, url_prefix="/api/chat")
# UPDATED: Cart Blueprint register kiya (Iska prefix /api/cart already route file mein set hai)
app.register_blueprint(cart_bp) 



@app.route("/test-db")
def test_db():
    mongo.db.test.insert_one({"msg": "Mongo connected"})
    return {"status": "MongoDB connected"}

if __name__ == "__main__":
    app.run(debug=True)
