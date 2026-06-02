import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    OPENF1_BASE_URL: str = os.getenv("OPENF1_BASE_URL", "https://api.openf1.org/v1")

settings = Settings()