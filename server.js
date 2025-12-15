const express = require('express');
const path = require('path');

// server.js (строка 4 или 5)

const app = express();
const port = 4000; // <--- ИЗМЕНИТЕ ЗДЕСЬ

// Middleware для обработки данных формы (КРИТИЧЕСКИ ВАЖНО для POST)
app.use(express.urlencoded({ extended: true }));

// Подключение статических файлов (CSS, HTML) из папки 'public'
app.use(express.static(path.join(__dirname, 'public')));

// 1. Маршрут GET /: Отображение формы
app.get('/', (req, res) => {
    // Отправляем файл index.html из папки public
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 2. Маршрут POST /calculate-bmi: Расчет и вывод результата
app.post('/calculate-bmi', (req, res) => {
    // Получение и преобразование данных в числа
    const weight = parseFloat(req.body.weight); // Вес в кг
    const height = parseFloat(req.body.height); // Рост в метрах

    // Проверка ввода: должны быть числа и быть положительными
    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        return res.status(400).send(`
            <link rel="stylesheet" href="/styles.css">
            <div class="container">
                <h1>Ошибка ввода</h1>
                <p>Пожалуйста, введите корректные положительные числа.</p>
                <a href="/">Назад</a>
            </div>
        `);
    }

    // Расчет BMI: BMI = weight (kg) / height² (m)
    const bmi = (weight / (height * height)).toFixed(2);

    let category = '';
    let className = '';

    // Определение категории и соответствующего CSS-класса
    if (bmi < 18.5) {
        category = 'Недостаточный вес (Underweight)';
        className = 'category-underweight';
    } else if (bmi < 24.9) {
        category = 'Нормальный вес (Normal weight)';
        className = 'category-normal';
    } else if (bmi < 29.9) {
        category = 'Избыточный вес (Overweight)';
        className = 'category-overweight';
    } else {
        category = 'Ожирение (Obese)';
        className = 'category-obese';
    }

    // Возвращаем результат в HTML
    res.send(`
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <title>BMI Результат</title>
            <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
            <div class="container">
                <h1>Ваш результат BMI</h1>
                <div class="result-box ${className}">
                    <p><strong>BMI:</strong> ${bmi}</p>
                    <p><strong>Категория:</strong> ${category}</p>
                </div>
                <br>
                <a href="/">Рассчитать снова</a>
            </div>
        </body>
        </html>
    `);
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен: http://localhost:${port}`);
});