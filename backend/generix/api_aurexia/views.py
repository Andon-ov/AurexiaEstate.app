from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import (
    Destination,
    PropertyFeature,
    Property,
    PropertyImage,
    PropertyInquiry,
    InvestorListing
)
from .serializers import (
    DestinationListSerializer,
    DestinationDetailSerializer,
    PropertyFeatureSerializer,
    PropertyListSerializer,
    PropertyDetailSerializer,
    PropertyInquiryCreateSerializer,
    PropertyInquirySerializer,
    InvestorListingSerializer
)


class DestinationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Destinations
    List: Returns all active destinations
    Retrieve: Returns destination details by slug
    """
    queryset = Destination.objects.filter(is_active=True).order_by('order', 'name_en')
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return DestinationDetailSerializer
        return DestinationListSerializer
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured destinations for homepage"""
        featured = self.queryset.filter(is_featured=True)
        serializer = self.get_serializer(featured, many=True)
        return Response(serializer.data)


class PropertyFeatureViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Property Features
    Returns all active features
    """
    queryset = PropertyFeature.objects.filter(is_active=True).order_by('order', 'name_en')
    serializer_class = PropertyFeatureSerializer
    permission_classes = [AllowAny]


class PropertyViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Properties
    List: Returns all active available properties
    Retrieve: Returns property details by slug
    """
    queryset = Property.objects.filter(
        is_active=True, 
        status='available'
    ).select_related('destination').prefetch_related('features', 'images').order_by(
        '-is_featured', 'order', '-created_at'
    )
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['destination__slug', 'property_type', 'status']
    search_fields = ['title_en', 'title_bg', 'description_en', 'city']
    ordering_fields = ['price', 'created_at', 'area_sqm', 'bedrooms']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PropertyDetailSerializer
        return PropertyListSerializer
    
    def retrieve(self, request, *args, **kwargs):
        """Increment views count when property is viewed"""
        instance = self.get_object()
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured properties for homepage"""
        featured = self.get_queryset().filter(is_featured=True)[:6]
        serializer = PropertyListSerializer(featured, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='destination/(?P<destination_slug>[^/.]+)')
    def by_destination(self, request, destination_slug=None):
        """Get properties filtered by destination slug"""
        properties = self.get_queryset().filter(destination__slug=destination_slug)
        
        # Apply filters from query params
        filtered = self.filter_queryset(properties)
        
        page = self.paginate_queryset(filtered)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(filtered, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """
        Advanced search for properties
        Query params: q (search term), min_price, max_price, min_beds, max_beds
        """
        queryset = self.get_queryset()
        
        # Text search
        q = request.query_params.get('q', '')
        if q:
            queryset = queryset.filter(
                Q(title_en__icontains=q) |
                Q(title_bg__icontains=q) |
                Q(description_en__icontains=q) |
                Q(city__icontains=q)
            )
        
        # Price range
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Bedrooms range
        min_beds = request.query_params.get('min_beds')
        max_beds = request.query_params.get('max_beds')
        if min_beds:
            queryset = queryset.filter(bedrooms__gte=min_beds)
        if max_beds:
            queryset = queryset.filter(bedrooms__lte=max_beds)
        
        # Area range
        min_area = request.query_params.get('min_area')
        max_area = request.query_params.get('max_area')
        if min_area:
            queryset = queryset.filter(area_sqm__gte=min_area)
        if max_area:
            queryset = queryset.filter(area_sqm__lte=max_area)
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class PropertyInquiryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Property Inquiries
    Create: Anyone can submit an inquiry (AllowAny)
    List/Retrieve/Update/Delete: Admin only
    """
    queryset = PropertyInquiry.objects.all().select_related('property').order_by('-created_at')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PropertyInquiryCreateSerializer
        return PropertyInquirySerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAdminUser()]
    
    def create(self, request, *args, **kwargs):
        """Create new property inquiry"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response(
            {
                'message': 'Your inquiry has been submitted successfully. We will contact you soon.',
                'inquiry_id': serializer.instance.id
            },
            status=status.HTTP_201_CREATED
        )


class InvestorListingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Investor Listings (Admin only)
    """
    queryset = InvestorListing.objects.all().order_by('-created_at')
    serializer_class = InvestorListingSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['subscription_status', 'is_active']
    search_fields = ['company_name', 'contact_person', 'email']
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get only active investors"""
        active_investors = self.queryset.filter(subscription_status='active', is_active=True)
        serializer = self.get_serializer(active_investors, many=True)
        return Response(serializer.data)
