from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail


User = get_user_model()

class RegisterView(APIView):
    res = ""
    @swagger_auto_schema(
        operation_description="User register",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['username', 'email', 'password'],
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING, description='Username'),
                'email': openapi.Schema(type=openapi.TYPE_STRING, description='Email'),
                'password': openapi.Schema(type=openapi.TYPE_STRING, description='Password'),
            },
        ),
        responses={
            200: openapi.Response(
                description="Success",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'user': openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'id': openapi.Schema(type=openapi.TYPE_INTEGER),
                                'username': openapi.Schema(type=openapi.TYPE_STRING),
                                'email': openapi.Schema(type=openapi.TYPE_STRING),
                                'is_staff': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                            }
                        ),
                    }
                )
            ),
            400: openapi.Response(description="Bad request"),
            401: openapi.Response(description="Invalid credentials"),
        }
    )
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            res = Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            res = Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return res


class LoginView(APIView):
    @swagger_auto_schema(
        operation_description="User login",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['username', 'password'],
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING, description='Username or email'),
                'password': openapi.Schema(type=openapi.TYPE_STRING, description='Password'),
            },
        ),
        responses={
            200: openapi.Response(
                description="Success",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'refresh': openapi.Schema(type=openapi.TYPE_STRING),
                        'access': openapi.Schema(type=openapi.TYPE_STRING),
                        'user': openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'id': openapi.Schema(type=openapi.TYPE_INTEGER),
                                'username': openapi.Schema(type=openapi.TYPE_STRING),
                                'email': openapi.Schema(type=openapi.TYPE_STRING),
                                'is_staff': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                            }
                        ),
                    }
                )
            ),
            400: openapi.Response(description="Bad request"),
            401: openapi.Response(description="Invalid credentials"),
        }
    )
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
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'is_staff': user.is_staff,
                    }
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
    @swagger_auto_schema(
        operation_description="Отримати інформацію про поточного авторизованого користувача",
        operation_summary="Деталі користувача",
        tags=['User'],
        responses={
            200: openapi.Response(
                description="Інформація про користувача",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'id': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID користувача'),
                        'username': openapi.Schema(type=openapi.TYPE_STRING, description="Ім'я користувача"),
                        'email': openapi.Schema(type=openapi.TYPE_STRING, description='Email користувача'),
                        'first_name': openapi.Schema(type=openapi.TYPE_STRING, description="Ім'я"),
                        'last_name': openapi.Schema(type=openapi.TYPE_STRING, description='Прізвище'),
                        'is_staff': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Чи є адміністратором'),
                        'date_joined': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME, description='Дата реєстрації'),
                    }
                )
            ),
            401: openapi.Response(description="Не авторизований - потрібен валідний токен"),
        }
    )
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
