from pydantic import AnyHttpUrl
from user_reg_and_prof_mngmnt.schemas import BasicProfile, Invites
from user_reg_and_prof_mngmnt.models import UserProfile as UserProfileModel
from database_connection import user_collection, invites_ref
from config import get_settings


BOT_TOKEN = get_settings().bot_token

def get_user_by_id(telegram_user_id: str) -> BasicProfile:
    """
    Retrieve a user by their telegram user ID.

    Args:
        telegram_user_id (str): The telegram user ID of the user to retrieve.

    Returns:
        BasicProfile: The user data if found, otherwise None.
    """
    user = user_collection.find_one({"telegram_user_id": telegram_user_id})

    if user:
        user_data: dict = BasicProfile(
            telegram_user_id=user.get("telegram_user_id", None),
            username=user.get("username", None),
            firstname=user.get("firstname", None),
            image_url=user.get("image_url", None),
            level=user.get("level", None),
            total_coins=user.get("total_coins", None),
            referral_url=user.get("referral_url", None),
            is_active=user.get("is_active", None)
        )
        return user_data
    return None


# insert new user in database
def insert_new_user(new_user: UserProfileModel):
    user_collection.insert_one(new_user.model_dump())

def insert_new_invite_ref(new_invite_ref: Invites):
    invites_ref.insert_one(new_invite_ref.model_dump())


def serialize_any_http_url(url: AnyHttpUrl):
  """
  Serializes a pydantic AnyHttpUrl object into a string.

  Args:
    url: The AnyHttpUrl object to serialize.

  Returns:
    The URL as a string.
  """
  if isinstance(url, AnyHttpUrl):
    return str(url)
  else:
    return url

referral_url_prefix = "https://t.me/Bored_Tap_Bot?start="


