import os

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

class GenreDetailSerializer(serializers.ModelSerializer):
    books_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Genre
        fields = ['id', 'name', 'books_count', 'created_at']
    
    def get_books_count(self, obj):
        return obj.book_set.count()

class BookSerializer(serializers.ModelSerializer):
    genre = GenreDetailSerializer(read_only=True)
    image_url = serializers.SerializerMethodField()
    image_full_url = serializers.SerializerMethodField()
    image_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Book
        fields = [
            'id',
            'title',
            'author',
            'isbn',
            'genre',
            'price',
            'rating',
            'description',
            'in_stock',
            'publication_year',
            'source_url',
            'image',           # Оригінальне поле
            'image_url',       # Відносний URL
            'image_full_url',  # Повний URL
            'image_info',      # Детальна інформація про зображення
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_image_url(self, obj):
        """Повертає відносний URL зображення"""
        if obj.image and hasattr(obj.image, 'url'):
            return obj.image.url
        return None
    
    def get_image_full_url(self, obj):
        """Повертає повний URL зображення з доменом"""
        if obj.image and hasattr(obj.image, 'url'):
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    
    def get_image_info(self, obj):
        """Повертає детальну інформацію про зображення"""
        if not obj.image or not obj.image.name:
            return {
                'has_image': False,
                'filename': None,
                'size': None,
                'extension': None,
                'path': None
            }
        
        try:
            # Отримуємо розмір файлу
            file_size = obj.image.size if hasattr(obj.image, 'size') else None
            if not file_size and hasattr(obj.image, 'path') and os.path.exists(obj.image.path):
                file_size = os.path.getsize(obj.image.path)
            
            # Отримуємо розширення файлу
            filename = os.path.basename(obj.image.name)
            extension = os.path.splitext(filename)[1].lower()
            
            return {
                'has_image': True,
                'filename': filename,
                'size': file_size,
                'size_human': self._format_file_size(file_size) if file_size else None,
                'extension': extension,
                'path': obj.image.name
            }
        except Exception:
            return {
                'has_image': True,
                'filename': obj.image.name,
                'size': None,
                'extension': None,
                'path': obj.image.name
            }
    
    def _format_file_size(self, size_bytes):
        """Форматує розмір файлу в читабельний вигляд"""
        if size_bytes == 0:
            return "0 B"
        
        size_names = ["B", "KB", "MB", "GB"]
        import math
        i = int(math.floor(math.log(size_bytes, 1024)))
        p = math.pow(1024, i)
        s = round(size_bytes / p, 2)
        return f"{s} {size_names[i]}"
    
    def to_representation(self, instance):
        """Кастомізує серіалізацію для додавання додаткової інформації"""
        data = super().to_representation(instance)
        
        # Додаємо додаткові поля для зручності
        data['is_available'] = instance.in_stock
        data['price_formatted'] = f"${instance.price:.2f}"
        data['rating_stars'] = "★" * instance.rating + "☆" * (5 - instance.rating)
        
        # Додаємо інформацію про схожі книги (опціонально)
        if instance.genre:
            similar_books = Book.objects.filter(
                genre=instance.genre
            ).exclude(id=instance.id)[:3]
            
            data['similar_books'] = [
                {
                    'id': book.id,
                    'title': book.title,
                    'author': book.author,
                    'image_url': book.image.url if book.image else None
                }
                for book in similar_books
            ]
        
        return data


class BookListSerializer(serializers.ModelSerializer):
    genre = GenreSerializer(read_only=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Book
        fields = [
            'id', 
            'title', 
            'author', 
            'isbn', 
            'genre', 
            'price', 
            'rating', 
            'description', 
            'in_stock', 
            'publication_year', 
            'image',          # Оригінальне поле зображення
            'image_url',      # URL зображення для зручності
            'created_at', 
            'updated_at'
        ]
    
    def get_image_url(self, obj):
        """Повертає повний URL зображення або None"""
        if obj.image and hasattr(obj.image, 'url'):
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

# Альтернативний варіант з кастомним полем для зображення
class BookListSerializerAlternative(serializers.ModelSerializer):
    genre = GenreSerializer(read_only=True)
    image = serializers.ImageField(read_only=True)
    has_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Book
        fields = [
            'id', 
            'title', 
            'author', 
            'isbn', 
            'genre', 
            'price', 
            'rating', 
            'description', 
            'in_stock', 
            'publication_year', 
            'image',
            'has_image',
            'created_at', 
            'updated_at'
        ]
    
    def get_has_image(self, obj):
        return bool(obj.image and obj.image.name)
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        
        if instance.image and hasattr(instance.image, 'url'):
            request = self.context.get('request')
            if request:
                data['image_url'] = request.build_absolute_uri(instance.image.url)
            else:
                data['image_url'] = instance.image.url
        else:
            data['image_url'] = None