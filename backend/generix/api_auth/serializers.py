
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth import password_validation, authenticate
from django.core import exceptions
from .models import UserProfile

UserModel = get_user_model()


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile details"""
    profile_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = ['phone_number', 'company', 'position', 'profile_image', 'profile_image_url', 'is_email_verified']
        
    def get_profile_image_url(self, obj):
        """Get URL for profile image"""
        if obj.profile_image:
            return obj.profile_image.url
        return None


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user details with profile information"""
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = UserModel
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']


class CreateUserSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    profile = UserProfileSerializer(required=False)
    
    class Meta:
        model = UserModel
        fields = ['id', 'email', 'username', 'password', 'first_name', 'last_name', 'profile']
        extra_kwargs = {'password': {'write_only': True}, 'email': {'required': True}}

    # This hashes the password
    def create(self, validated_data):
        profile_data = validated_data.pop('profile', {})
        user = super().create(validated_data)
        user.set_password(user.password)
        user.save()
        
        # Update profile if profile data provided
        if profile_data:
            for attr, value in profile_data.items():
                setattr(user.profile, attr, value)
            user.profile.save()
            
        return user

    def validate_email(self, value):
        """
        Validate that the email is unique.
        """
        if UserModel.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate(self, data):
        # Invoke password validator
        user = UserModel(**data)
        password = data.get('password')
        errors = {}
        try:
            password_validation.validate_password(password=password, user=user)
        except exceptions.ValidationError as e:
            errors['password'] = list(e.messages)
        if errors:
            raise serializers.ValidationError(errors)
        return super().validate(data)




    # The password is already excluded by write_only=True in extra_kwargs
    def to_representation(self, instance):
        user_representation = super().to_representation(instance)
        # No need to pop password as it's already excluded
        return user_representation


class LoginSerializer(serializers.Serializer):
    """Serializer for user login and token generation"""
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128, write_only=True)
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if not user.is_active:
                    raise serializers.ValidationError("User account is disabled.")
                data['user'] = user
                return data
            else:
                raise serializers.ValidationError("Unable to log in with provided credentials.")
        else:
            raise serializers.ValidationError("Must include 'username' and 'password'.")


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change endpoint"""
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    
    def validate_new_password(self, value):
        # Use Django's password validator
        password_validation.validate_password(value)
        return value


class UpdateUserProfileSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile"""
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    email = serializers.EmailField(source='user.email', required=False)
    
    class Meta:
        model = UserProfile
        fields = ['phone_number', 'company', 'position', 'profile_image', 
                  'first_name', 'last_name', 'email']
                  
    def validate_email(self, value):
        """
        Validate that the email is unique.
        """
        user = self.instance.user
        if UserModel.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def update(self, instance, validated_data):
        # Update User model fields if provided
        user_data = validated_data.pop('user', {})
        user = instance.user
        
        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()
        
        # Update UserProfile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance