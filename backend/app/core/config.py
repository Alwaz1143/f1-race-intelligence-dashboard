import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    OPENF1_BASE_URL: str = os.getenv(
        "OPENF1_BASE_URL",
        "https://api.openf1.org/v1"
    )

    FRONTEND_URLS: str = os.getenv(
        "FRONTEND_URLS",
        os.getenv("FRONTEND_URL", "http://localhost:5173")
    )

    @property
    def allowed_origins(self) -> list[str]:
        origins = [
            origin.strip()
            for origin in self.FRONTEND_URLS.split(",")
            if origin.strip()
        ]

        default_local_origins = [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ]

        return list(dict.fromkeys(origins + default_local_origins))


settings = Settings()