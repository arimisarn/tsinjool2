# import os
# from supabase import create_client, Client
# from django.conf import settings
# import logging

# logger = logging.getLogger(__name__)

# # Charger les variables depuis settings
# SUPABASE_URL = getattr(settings, "SUPABASE_URL", None)
# SUPABASE_SERVICE_ROLE_KEY = getattr(settings, "SUPABASE_SERVICE_ROLE_KEY", None)

# if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
#     logger.error("❌ Supabase URL ou Service Role Key manquante dans les settings.")
#     raise ValueError("SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définis dans .env")

# try:
#     supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
#     logger.info("✅ Supabase client initialisé avec succès.")
# except Exception as e:
#     logger.exception("❌ Erreur lors de l'initialisation de Supabase client.")
#     raise e




import os
from supabase import create_client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    supabase = None
    print("❌ Supabase désactivé : variables manquantes.")
else:
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
