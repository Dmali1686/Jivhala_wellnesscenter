from fastapi import APIRouter
from app.api.endpoints import leads, success_stories, vlogs

api_router = APIRouter()
api_router.include_router(leads.router, prefix="/leads", tags=["leads"])
api_router.include_router(success_stories.router, prefix="/stories", tags=["success_stories"])
api_router.include_router(vlogs.router, prefix="/vlogs", tags=["vlogs"])
