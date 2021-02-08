from django.urls import path

from . import views


app_name = 'apiv1'
urlpatterns = [
    path('users/', views.UserViewSet.as_view()),
    path('groups/', views.GroupViewSet.as_view()),
]