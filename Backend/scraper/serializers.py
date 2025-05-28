from rest_framework import serializers
from .models import ScrapingLog, Book, Genre

class ScrapingLogSerializer(serializers.ModelSerializer):
    duration = serializers.SerializerMethodField()
    
    class Meta:
        model = ScrapingLog
        fields = [
            'id', 'started_at', 'finished_at', 'duration',
            'total_books_found', 'books_created', 'books_updated',
            'errors_count', 'status', 'error_message'
        ]
        read_only_fields = ['id', 'started_at']
    
    def get_duration(self, obj):
        if obj.finished_at and obj.started_at:
            duration = obj.finished_at - obj.started_at
            return str(duration)
        return None

class GenreSerializer(serializers.ModelSerializer):
    books_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Genre
        fields = ['id', 'name', 'description', 'books_count', 'created_at']
    
    def get_books_count(self, obj):
        return obj.book_set.count()

class BookSerializer(serializers.ModelSerializer):
    genre_name = serializers.CharField(source='genre.name', read_only=True)
    rating_display = serializers.CharField(read_only=True)
    
    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'isbn', 'genre', 'genre_name',
            'description', 'publication_year', 'price', 'rating', 
            'rating_display', 'in_stock', 'availability',
            'source_url', 'last_scraped', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'last_scraped']

class BookListSerializer(serializers.ModelSerializer):
    genre_name = serializers.CharField(source='genre.name', read_only=True)
    
    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'genre_name', 
            'publication_year', 'price', 'rating', 'in_stock'
        ]