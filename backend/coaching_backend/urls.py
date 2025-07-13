from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Vue pour tester la racine
def health_check(request):
    return JsonResponse(
        {"status": "ok", "message": "🎯 Le backend Django sur Render fonctionne !"}
    )

urlpatterns = [
    path("", health_check),  # racine
    path("admin/", admin.site.urls),

    # ✅ Préfixes API différents pour chaque app
    path("api/accounts/", include("accounts.urls")),
    path("api/chat/", include("chat.urls")),
    path("api/evaluation/", include("evaluation.urls")),  # contient generate-path/
]

# Pour servir les fichiers media en mode DEBUG
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
