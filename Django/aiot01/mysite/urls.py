from django.urls import path, include

# url 패턴 정의
urlpatterns = [
    # ...
    path('api/', include('chargingstations.urls')),
    # ...
]