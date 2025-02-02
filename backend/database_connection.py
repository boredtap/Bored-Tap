from config import get_settings
from pymongo import MongoClient
from user_reg_and_prof_mngmnt.schemas import BasicProfile


connection_string: str = get_settings().mongodb_connection_string
client: MongoClient = MongoClient(connection_string)


def get_db():
    """

    """
    try:
        # ping the server to check connectivity
        client.server_info()
        db = client['bored-tap']
        return db
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        raise e

db = get_db()
user_collection = db['users']
