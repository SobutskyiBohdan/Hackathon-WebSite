from celery import shared_task
from django.utils import timezone
from .models import ScrapingLog, Book, Genre
from .management.commands.scrape_books import BookScraper
import logging

logger = logging.getLogger(__name__)

@shared_task(bind=True)
def scrape_books_task(self, pages_limit=None):
    """
    Celery завдання для скрапінгу книг
    """
    # Створення запису про початок скрапінгу
    scraping_log = ScrapingLog.objects.create(
        status='running'