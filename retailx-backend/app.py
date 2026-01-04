from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

from extensions import mongo, bcrypt, jwt
from routes.seller_routes import seller_bp
from routes.auth_routes import auth_bp
from routes.admin_routes import admin_bp

load_dotenv()

app = Flask(__name__)
CORS(app)

# CONFIG
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

# INIT EXTENSIONS
mongo.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)

# ROUTES
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(admin_bp, url_prefix="/api/admin")
app.register_blueprint(seller_bp)

@app.route("/test-db")
def test_db():
    mongo.db.test.insert_one({"msg": "Mongo connected"})
    return {"status": "MongoDB connected"}

if __name__ == "__main__":
    app.run(debug=True)
