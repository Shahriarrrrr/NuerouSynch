from rest_framework import serializers
from accounts.models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'full_name', 'password','department', 'interested_field','publications', 'profile_image']

    def create(self, validated_data):
        password = validated_data.pop('password')  # Extract password
        user = CustomUser(**validated_data)        # Create instance (without password)
        user.set_password(password)                # Hash the password
        user.save()                                # Save to DB
        return user
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance