from rest_framework.decorators import action
from rest_framework import viewsets
from accounts.models import CustomUser
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.db import IntegrityError


class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        print(serializer.data)
        return Response(serializer.data)



class RegisterUserView(APIView):
    def post(self, request):
        # Check if phone_number is already taken
        if CustomUser.objects.filter(phone_number=request.data.get('phone_number')).exists():
            return Response({
                "error": "Phone number already exists."
            }, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            try:
                # Save the user using the serializer
                user = serializer.save()

                # Create a token for the newly created user
                token, created = Token.objects.get_or_create(user=user)

                # Return a success response with the token
                return Response({
                    "message": "User registered successfully!",
                    "token": token.key
                }, status=status.HTTP_201_CREATED)

            except IntegrityError as e:
                # Handle other unique constraint errors
                return Response({
                    "error": str(e)
                }, status=status.HTTP_400_BAD_REQUEST)

        # If serializer is invalid, return error response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)