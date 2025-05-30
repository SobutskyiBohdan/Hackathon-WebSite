# Hackathon Website

Веб-сайт для хакатону з Django backend та Next.js frontend.

---

## 🚀 Технології

- **Backend:** Django + Django REST Framework
- **Frontend:** Next.js + TypeScript
- **Database:** PostgreSQL
- **Email:** MailHog (для розробки)
- **Web Server:** Nginx
- **Containerization:** Docker + Docker Compose

---

## ⚡️ Швидкий старт

1. **Клонування репозиторію:**
    ```bash
    git clone https://github.com/SobutskyiBohdan/Hackathon-WebSite
    cd Hackathon-WebSite
    ```

2. **Запуск через Docker Compose:**
    ```bash
    docker-compose up --build
    ```

3. **Ручний запуск сервісів (опціонально):**
    - **Backend:**
      ```bash
      cd backend
      pip install -r requirements.txt
      python manage.py migrate
      python manage.py runserver
      ```
    - **Frontend:**
      ```bash
      cd frontend
      npm install
      npm run dev
      ```

---

## 🗂 Структура проекту

```
backend/        # Django backend
frontend/       # Next.js frontend
nginx/          # Nginx конфігурація
docker-compose.yml  # Docker Compose конфіг
```

---

## 🌐 Сервіси

| Сервіс     | URL/Порт                       |
|------------|-------------------------------|
| Web        | http://localhost              |
| Backend    | http://localhost:8000         |
| Frontend   | http://localhost:3000         |
| Database   | http://localhost:5432         |
| MailHog    | http://localhost:8025         |

---

## 🐳 Основні Docker-команди

```bash
# Запуск всіх сервісів
docker-compose up

# Запуск у фоновому режимі
docker-compose up -d

# Перебудова та запуск
docker-compose up --build

# Зупинка
docker-compose down

# Зупинка з видаленням volumes
docker-compose down -v
```

---

## ☁️ Інструкції по розгортанню на AWS

### 1. Підготовка AWS серверу

```bash
# Підключення до серверу
ssh -i your-key.pem ubuntu@your-aws-ip

# Оновлення системи
sudo apt update && sudo apt upgrade -y

# Встановлення Docker
sudo apt install apt-transport-https ca-certificates curl gnupg lsb-release -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin -y

# Додавання користувача до групи docker
sudo usermod -aG docker $USER
newgrp docker

# Перевірка встановлення
docker --version
docker run hello-world
```

---

### 2. Налаштування AWS Security Groups

- **80 (HTTP):** 0.0.0.0/0
- **443 (HTTPS):** 0.0.0.0/0
- **8025 (MailHog UI):** Your IP/32 (для безпеки)
- **3000 (Next.js dev):** Your IP/32 (опціонально)
- **8000 (Django dev):** Your IP/32 (опціонально)

---

### 3. Клонування та запуск проекту

```bash
git clone <your-repository-url>
cd Hackathon-WebSite

# Створення .env для backend (опціонально)
echo "DEBUG=True
DATABASE_URL=postgresql://hackathon_user:hackathon_pass@db:5432/hackathon_db
EMAIL_HOST=mailhog
EMAIL_PORT=1025
DEFAULT_FROM_EMAIL=noreply@hackathon.local" > backend/.env

# Запуск всіх сервісів
docker compose up --build -d

# Перевірка статусу
docker compose ps
```

---

### 4. Перевірка роботи MailHog

```bash
docker compose logs mailhog
sudo netstat -tulpn | grep :8025
sudo netstat -tulpn | grep :1025
telnet localhost 1025
```

- **MailHog UI:** http://your-aws-ip:8025

---

### 5. Доступ до сервісів

- **Головний сайт:** http://your-aws-ip
- **Django API:** http://your-aws-ip:8000/api/
- **Django Admin:** http://your-aws-ip/admin/

---

### 6. Тестування email

```bash
sudo apt install sendemail -y
sendemail -f test@hackathon.local \
-t user@example.com \
-s localhost:1025 \
-u "Test Subject" \
-m "Test message from hackathon project"
```

---

### 7. Налаштування автозапуску (systemd)

Створіть файл `/etc/systemd/system/hackathon-docker.service`:

```ini
[Unit]
Description=Hackathon Docker Compose
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/ubuntu/Hackathon-WebSite
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

---

### 8. Команди для управління

```bash
# Активація сервісу
sudo systemctl daemon-reload
sudo systemctl enable hackathon-docker.service
sudo systemctl start hackathon-docker.service

# Зупинка всіх сервісів
docker compose down

# Перезапуск
docker compose restart

# Перегляд логів
docker compose logs -f

# Перегляд логів конкретного сервісу
docker compose logs -f mailhog
docker compose logs -f backend

# Оновлення образів
docker compose pull
docker compose up -d

# Очищення (УВАГА: видалить дані!)
docker compose down -v