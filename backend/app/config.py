from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DB_HOST: str = "localhost"
    DB_USER: str = "livabl_user"
    DB_PASSWORD: str = "5757"
    DB_NAME: str = "livabl"

settings = Settings()