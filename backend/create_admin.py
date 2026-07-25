import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.core.security import get_password_hash
from app.models.user import User

# This will load your environment variables automatically if needed
from app.core.config import settings

async def create_admin():
    engine = create_async_engine(settings.safe_database_url, echo=True)
    async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

    print("Creating admin user in database...")
    async with async_session() as session:
        # Check if admin already exists
        # In our schema, mobile_number is unique
        mobile_number = "+910000000000"
        
        # We can just create one directly
        admin_user = User(
            username="Super Admin",
            mobile_number=mobile_number,
            password_hash=get_password_hash("admin123"),
            role="admin"
        )
        
        try:
            session.add(admin_user)
            await session.commit()
            print("=========================================")
            print("✅ ADMIN CREATED SUCCESSFULLY!")
            print(f"Mobile Number: {mobile_number}")
            print(f"Password: admin123")
            print("=========================================")
        except Exception as e:
            print(f"Failed to create admin (maybe already exists?): {e}")

if __name__ == "__main__":
    asyncio.run(create_admin())
