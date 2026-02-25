from rest_framework import serializers
from .models import (
    Destination,
    PropertyFeature,
    Property,
    PropertyFeatureLink,
    PropertyImage,
    PropertyInquiry,
    InvestorListing
)


class DestinationListSerializer(serializers.ModelSerializer):
    """Serializer for destination list (cards view)"""
    active_properties_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Destination
        fields = [
            'id', 'slug',
            'name_en', 'name_bg',
            'short_description_en', 'short_description_bg',
            'thumbnail_image',
            'is_featured', 'order',
            'active_properties_count'
        ]


class DestinationDetailSerializer(serializers.ModelSerializer):
    """Serializer for destination detail page"""
    active_properties_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Destination
        fields = [
            'id', 'slug',
            'name_en', 'name_bg',
            'description_en', 'description_bg',
            'short_description_en', 'short_description_bg',
            'hero_image', 'thumbnail_image',
            'meta_title_en', 'meta_description_en',
            'is_featured', 'is_active', 'order',
            'active_properties_count',
            'created_at', 'updated_at'
        ]


class PropertyFeatureSerializer(serializers.ModelSerializer):
    """Serializer for property features/amenities"""
    
    class Meta:
        model = PropertyFeature
        fields = [
            'id',
            'name_en', 'name_bg',
            'icon',
            'order'
        ]


class PropertyImageSerializer(serializers.ModelSerializer):
    """Serializer for property gallery images"""
    
    class Meta:
        model = PropertyImage
        fields = [
            'id',
            'image',
            'caption_en', 'caption_bg',
            'order'
        ]


class PropertyListSerializer(serializers.ModelSerializer):
    """Serializer for property list (cards view)"""
    destination_name_en = serializers.CharField(source='destination.name_en', read_only=True)
    destination_name_bg = serializers.CharField(source='destination.name_bg', read_only=True)
    destination_slug = serializers.CharField(source='destination.slug', read_only=True)
    formatted_price = serializers.ReadOnlyField()
    
    class Meta:
        model = Property
        fields = [
            'id', 'slug',
            'title_en', 'title_bg',
            'short_description_en', 'short_description_bg',
            'destination_name_en', 'destination_name_bg', 'destination_slug',
            'property_type', 'status',
            'price', 'price_currency', 'formatted_price',
            'bedrooms', 'bathrooms', 'area_sqm',
            'city',
            'featured_image',
            'is_featured', 'order',
            'created_at'
        ]


class PropertyDetailSerializer(serializers.ModelSerializer):
    """Serializer for property detail page"""
    destination = DestinationListSerializer(read_only=True)
    features = PropertyFeatureSerializer(many=True, read_only=True)
    images = PropertyImageSerializer(many=True, read_only=True)
    formatted_price = serializers.ReadOnlyField()
    
    class Meta:
        model = Property
        fields = [
            'id', 'slug',
            'title_en', 'title_bg',
            'description_en', 'description_bg',
            'short_description_en', 'short_description_bg',
            'destination',
            'property_type', 'status',
            'price', 'price_currency', 'formatted_price',
            'bedrooms', 'bathrooms', 'area_sqm', 'plot_size_sqm',
            'address', 'city', 'postal_code',
            'latitude', 'longitude',
            'featured_image', 'video_url', 'virtual_tour_url',
            'features', 'images',
            'meta_title_en', 'meta_description_en',
            'is_featured', 'views_count',
            'created_at', 'updated_at', 'published_at'
        ]


class PropertyInquiryCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating property inquiries"""
    
    class Meta:
        model = PropertyInquiry
        fields = [
            'property',
            'full_name',
            'email',
            'phone',
            'message',
            'budget_range',
            'preferred_contact_method'
        ]
    
    def create(self, validated_data):
        return PropertyInquiry.objects.create(**validated_data)


class PropertyInquirySerializer(serializers.ModelSerializer):
    """Serializer for property inquiry (admin view)"""
    property_title = serializers.CharField(source='property.title_en', read_only=True)
    property_slug = serializers.CharField(source='property.slug', read_only=True)
    
    class Meta:
        model = PropertyInquiry
        fields = [
            'id',
            'property', 'property_title', 'property_slug',
            'full_name', 'email', 'phone',
            'message', 'budget_range',
            'preferred_contact_method',
            'is_contacted', 'contacted_at',
            'notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class InvestorListingSerializer(serializers.ModelSerializer):
    """Serializer for investor listings (admin only)"""
    
    class Meta:
        model = InvestorListing
        fields = [
            'id',
            'company_name',
            'contact_person',
            'email', 'phone',
            'address',
            'subscription_status',
            'subscription_start', 'subscription_end',
            'monthly_fee',
            'properties_count',
            'notes',
            'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'properties_count']
