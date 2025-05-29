"""
<<<<<<< HEAD
ASGI config for boosh_backend project.
=======
ASGI config for book-shelf project.
>>>>>>> 9e995e8b415d1f03c7c200a5d070b51318fa6822

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'boosh.settings')

application = get_asgi_application()
