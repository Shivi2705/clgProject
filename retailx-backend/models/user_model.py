from extensions import mongo

class User:
    @staticmethod
    def find_by_email(email):
        return mongo.db.users.find_one({"email": email})

    @staticmethod
    def create_user(name, email, password):
        return mongo.db.users.insert_one({
            "name": name,
            "email": email,
            "password": password
        })
