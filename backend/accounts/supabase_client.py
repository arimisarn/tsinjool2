import logging
from django.conf import settings
from supabase import create_client, Client

logger = logging.getLogger(__name__)


def get_supabase_client() -> Client:
    SUPABASE_URL = getattr(settings, "SUPABASE_URL", None)
    SUPABASE_SERVICE_ROLE_KEY = getattr(settings, "SUPABASE_SERVICE_ROLE_KEY", None)

    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        logger.error("❌ Supabase URL ou Service Role Key manquante dans les settings.")
        raise ValueError(
            "SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définis dans .env"
        )

    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        logger.info("✅ Supabase client initialisé avec succès.")
        return supabase
    except Exception as e:
        logger.exception("❌ Erreur lors de l'initialisation de Supabase client.")
        raise e
