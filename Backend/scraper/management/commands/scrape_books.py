from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone
from scraper.models import Book, Genre, ScrapingLog
import requests
from bs4 import BeautifulSoup
import time
import logging
from urllib.parse import urljoin
import re

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BookScraper:
    def __init__(self):
        self.base_url = "https://books.toscrape.com/"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
    def get_page(self, url, retries=3):
        for attempt in range(retries):
            try:
                response = self.session.get(url, timeout=10)
                response.raise_for_status()
                return response
            except requests.RequestException as e:
                logger.warning(f"Attempt {attempt + 1} wasn't successfull for {url}: {e}")
                if attempt < retries - 1:
                    time.sleep(2 ** attempt)  
                else:
                    logger.error(f"Couldn't get the page {url}")
                    return None
    
    def parse_price(self, price_text):
        if not price_text:
            return 0.0

        price_clean = re.sub(r'[£$€]', '', price_text.strip())
        try:
            return float(price_clean)
        except ValueError:
            return 0.0
    
    def parse_rating(self, rating_class):
        rating_map = {
            'One': 1, 'Two': 2, 'Three': 3, 'Four': 4, 'Five': 5
        }
        for word, rating in rating_map.items():
            if word in rating_class:
                return rating
        return 0
    
    def scrape_book_details(self, book_url):
        response = self.get_page(book_url)
        if not response:
            return None
            
        soup = BeautifulSoup(response.content, 'html.parser')
        
        try:
            title = soup.find('h1').text.strip()
            product_info = {}
            table = soup.find('table', class_='table table-striped')
            if table:
                for row in table.find_all('tr'):
                    cells = row.find_all('td')
                    if len(cells) == 2:
                        key = cells[0].text.strip()
                        value = cells[1].text.strip()
                        product_info[key] = value
            
            price_elem = soup.find('p', class_='price_color')
            price = self.parse_price(price_elem.text if price_elem else '0')
            rating_elem = soup.find('p', class_='star-rating')
            rating = 0

            if rating_elem:
                rating_class = ' '.join(rating_elem.get('class', []))
                rating = self.parse_rating(rating_class)
            
            description_elem = soup.find('div', id='product_description')
            description = ''
            if description_elem:
                desc_p = description_elem.find_next_sibling('p')
                if desc_p:
                    description = desc_p.text.strip()
            
            availability_elem = soup.find('p', class_='instock availability')
            in_stock = availability_elem is not None
            
            breadcrumb = soup.find('ul', class_='breadcrumb')
            genre = 'General'
            if breadcrumb:
                links = breadcrumb.find_all('a')
                if len(links) >= 3: 
                    genre = links[2].text.strip()
            
            return {
                'title': title,
                'author': product_info.get('Author', 'Unknown'),
                'isbn': product_info.get('ISBN', ''),
                'genre': genre,
                'price': price,
                'rating': rating,
                'description': description,
                'in_stock': in_stock,
                'availability': product_info.get('Availability', ''),
                'year': self.extract_year(product_info.get('Publication Date', '')),
                'url': book_url
            }
            
        except Exception as e:
            logger.error(f"Parsing book error {book_url}: {e}")
            return None
    
    def extract_year(self, date_string):
        if not date_string:
            return None

        year_match = re.search(r'\b(19|20)\d{2}\b', date_string)
        if year_match:
            return int(year_match.group())
        return None
    
    def scrape_books_from_page(self, page_url):
        response = self.get_page(page_url)
        if not response:
            return []
        
        soup = BeautifulSoup(response.content, 'html.parser')
        books = []
        
        book_elements = soup.find_all('article', class_='product_pod')
        
        for book_elem in book_elements:
            try:
                link_elem = book_elem.find('h3').find('a')
                if link_elem:
                    href = link_elem['href']
                    if not href.startswith('catalogue/'):
                        href = 'catalogue/' + href
                    book_url = urljoin(self.base_url, href)
                    
                    logger.info(f"Book processing: {book_url}")
                    
                    book_data = self.scrape_book_details(book_url)
                    if book_data:
                        books.append(book_data)
                        logger.info(f"Book's data gathered: {book_data['title']}")
                    
                    time.sleep(1)
                    
            except Exception as e:
                logger.error(f"Book processing error: {e}")
                continue
        
        return books


class Command(BaseCommand):
    help = 'Book scraping from books.toscrape.com'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--pages',
            type=int,
            default=None,
            help='Number of pages to scrape (by default - all)'
        )
        parser.add_argument(
            '--verbose',
            action='store_true',
            help='Detailed process'
        )
    
    def handle(self, *args, **options):
        scraping_log = ScrapingLog.objects.create(status='running')
        
        try:
            scraper = BookScraper()
            
            if options['verbose']:
                self.stdout.write('Starting scraping...')
            
            if options['pages']:
                books = []
                for page_num in range(1, options['pages'] + 1):
                    if options['verbose']:
                        self.stdout.write(f'Page processing {page_num}...')
                    
                    page_url = f"{scraper.base_url}catalogue/page-{page_num}.html"
                    books_on_page = scraper.scrape_books_from_page(page_url)
                    books.extend(books_on_page)
                    time.sleep(2)  
            else:
                books = []
                for page_num in range(1, 6):
                    if options['verbose']:
                        self.stdout.write(f'Page processing {page_num}...')
                    
                    page_url = f"{scraper.base_url}catalogue/page-{page_num}.html"
                    books_on_page = scraper.scrape_books_from_page(page_url)
                    books.extend(books_on_page)
                    time.sleep(2)
            
            created_count, updated_count = self.save_books_to_db(books, options['verbose'])
            
            scraping_log.status = 'completed'
            scraping_log.finished_at = timezone.now()
            scraping_log.total_books_found = len(books)
            scraping_log.books_created = created_count
            scraping_log.books_updated = updated_count
            scraping_log.save()
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'Scraping is finished Created: {created_count}, updated: {updated_count}'
                )
            )
            
        except KeyboardInterrupt:
            scraping_log.status = 'interrupted'
            scraping_log.finished_at = timezone.now()
            scraping_log.save()
            self.stdout.write(self.style.WARNING('Scraping was interupted by user'))
        except Exception as e:
            scraping_log.status = 'failed'
            scraping_log.error_message = str(e)
            scraping_log.finished_at = timezone.now()
            scraping_log.save()
            self.stdout.write(self.style.ERROR(f'Error: {e}'))
    
    def save_books_to_db(self, books_data, verbose=False):
        created_count = 0
        updated_count = 0
        
        with transaction.atomic():
            for book_data in books_data:
                try:
                    genre, _ = Genre.objects.get_or_create(
                        name=book_data['genre']
                    )
                    
                    book, created = Book.objects.update_or_create(
                        title=book_data['title'],
                        author=book_data['author'],
                        defaults={
                            'isbn': book_data['isbn'],
                            'genre': genre,
                            'price': book_data['price'],
                            'rating': book_data['rating'],
                            'description': book_data['description'],
                            'in_stock': book_data['in_stock'],
                            'publication_year': book_data['year'],
                            'source_url': book_data['url']
                        }
                    )
                    
                    if created:
                        created_count += 1
                        if verbose:
                            self.stdout.write(f"Created: {book.title}")
                    else:
                        updated_count += 1
                        if verbose:
                            self.stdout.write(f"Updated: {book.title}")
                            
                except Exception as e:
                    self.stdout.write(
                        self.style.ERROR(f"Saving error {book_data['title']}: {e}")
                    )
        
        return created_count, updated_count