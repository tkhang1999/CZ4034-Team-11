from django.shortcuts import render

# Create your views here.
from django.contrib.auth.models import User, Group
from rest_framework import generics
from rest_framework import permissions
from .serializers import UserSerializer, GroupSerializer


class UserViewSet(generics.ListAPIView):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    # permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(generics.ListAPIView):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.order_by('name')
    serializer_class = GroupSerializer
    # permission_classes = [permissions.IsAuthenticated]
