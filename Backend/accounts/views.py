from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterView(APIView):
    res = ""
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            res = Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            res = Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return res


class LoginView(APIView):
   def post(self, request):
       usernameOrEmail = request.data.get('username') or request.data.get('email')
       password = request.data.get('password')
       
       if usernameOrEmail and password:
           user = authenticate(username=usernameOrEmail, password=password)

           if not user:
               try:
                   user_by_email = User.objects.get(email=usernameOrEmail)
                   user = authenticate(username=user_by_email.username, password=password)
               except User.DoesNotExist:
                   user = None
           
           if user:
               refresh = RefreshToken.for_user(user)
               return Response({
                   'refresh': str(refresh),
                   'access': str(refresh.access_token),
               }, status=status.HTTP_200_OK)
           else:
               return Response({
                   'error': 'Invalid credentials'
               }, status=status.HTTP_401_UNAUTHORIZED)
       else:
           return Response({
               'error': 'Username/email and password required'
           }, status=status.HTTP_400_BAD_REQUEST)


class UserDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)