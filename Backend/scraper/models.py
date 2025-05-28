from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.urls import reverse

class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
        verbose_name = 'Genre'
        verbose_name_plural = 'Genres'
    
    def __str__(self):
        return self.name

class Book(models.Model):
    RATING_CHOICES = [
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    ]
    
    title = models.CharField(max_length=255, verbose_name='title')
    author = models.CharField(max_length=255, verbose_name='author')
    isbn = models.CharField(max_length=20, blank=True, null=True, verbose_name='ISBN')
    genre = models.ForeignKey(
        Genre, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        verbose_name='Жанр'
    )
    description = models.TextField(blank=True, null=True, verbose_name='Description')
    publication_year = models.IntegerField(
        blank=True, 
        null=True,
        validators=[
            MinValueValidator(1000),
            MaxValueValidator(2030)
        ],
        verbose_name='Publication year'
    )
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0.00,
        verbose_name='Price'
    )
    rating = models.IntegerField(
        choices=RATING_CHOICES,
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        verbose_name='Rating'
    )
    in_stock = models.BooleanField(default=True, verbose_name='In stock')
    availability = models.CharField(max_length=100, blank=True, verbose_name='Available')
    
    source_url = models.URLField(blank=True, null=True, verbose_name='URL sources')
    last_scraped = models.DateTimeField(blank=True, null=True, verbose_name='Last update')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Book'
        verbose_name_plural = 'Books'
        unique_together = ['title', 'author']
        
        indexes = [
            models.Index(fields=['title']),
            models.Index(fields=['author']),
            models.Index(fields=['genre']),
            models.Index(fields=['publication_year']),
            models.Index(fields=['rating']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.author}"
    
    def get_absolute_url(self):
        return reverse('book-detail', kwargs={'pk': self.pk})
    
    @property
    def rating_display(self):
        return '★' * self.rating + '☆' * (5 - self.rating)

class ScrapingLog(models.Model):
    started_at = models.DateTimeField(auto_now_add=True)
    finished_at = models.DateTimeField(blank=True, null=True)
    total_books_found = models.IntegerField(default=0)
    books_created = models.IntegerField(default=0)
    books_updated = models.IntegerField(default=0)
    errors_count = models.IntegerField(default=0)
    status = models.CharField(
        max_length=20,
        choices=[
            ('running', 'Виконується'),
            ('completed', 'Завершено'),
            ('failed', 'Помилка'),
            ('interrupted', 'Перервано')
        ],
        default='running'
    )
    error_message = models.TextField(blank=True, null=True)
    
    class Meta:
        ordering = ['-started_at']
        verbose_name = 'Лог скрапінгу'
        verbose_name_plural = 'Логи скрапінгу'
    
    def __str__(self):
        return f"Scraping {self.started_at.strftime('%Y-%m-%d %H:%M')} - {self.status}"