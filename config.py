"""
Configuration for MyCanvaApp.
Prompt: Add production configuration variables and settings here.
"""
import os

class Config:
    # Basic settings
    SECRET_KEY = os.environ.get("SECRET_KEY") or "your-secret-key"
    DEBUG = False
    
    # Database settings
    DATABASE_URI = os.environ.get("DATABASE_URI") or "sqlite:///production.db"
    DATABASE_POOL_SIZE = int(os.environ.get("DATABASE_POOL_SIZE") or 5)
    DATABASE_POOL_TIMEOUT = int(os.environ.get("DATABASE_POOL_TIMEOUT") or 30)
    
    # Security settings
    SESSION_COOKIE_SECURE = True
    CSRF_ENABLED = True
    SSL_REQUIRED = True
    
    # Logging
    LOG_LEVEL = os.environ.get("LOG_LEVEL") or "ERROR"
    LOG_FILE = os.environ.get("LOG_FILE") or "app.log"
    
    # Performance
    CACHE_TYPE = os.environ.get("CACHE_TYPE") or "redis"
    CACHE_REDIS_URL = os.environ.get("REDIS_URL") or "redis://localhost:6379/0"
    
    # File storage
    UPLOAD_FOLDER = os.environ.get("UPLOAD_FOLDER") or "uploads"
    MAX_CONTENT_LENGTH = int(os.environ.get("MAX_CONTENT_LENGTH") or 16 * 1024 * 1024)
