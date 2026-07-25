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
        from sqlalchemy.future import select
        
        mobile_number = "+910000000000"
        
        # Check if admin already exists
        result = await session.execute(select(User).where(User.mobile_number == mobile_number))
        existing_user = result.scalars().first()

        if existing_user:
            print("User already exists. Upgrading role to admin and resetting password...")
            existing_user.role = "admin"
            existing_user.password_hash = get_password_hash("admin123")
            await session.commit()
            print("=========================================")
            print("✅ ADMIN ACCOUNT UPDATED SUCCESSFULLY!")
            print(f"Mobile Number: {mobile_number}")
            print(f"Password: admin123")
            print("=========================================")
        else:
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
                print(f"Failed to create admin: {e}")

if __name__ == "__main__":
    asyncio.run(create_admin())
