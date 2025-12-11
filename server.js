const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware для обработки данных формы (POST-запросы)
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware для обслуживания статических файлов (CSS)
app.use(express.static(path.join(__dirname, ''))); 

// Загрузка HTML-шаблона один раз
// Читаем файл index.html, чтобы потом вставлять в него результат
const htmlTemplate = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');

// Функция для расчета и определения категории BMI
function calculateBMI(weight, height) {
    // Формула: BMI = weight (kg) / height² (m) [cite: 14]
    const bmi = weight / (height * height); 
    let category = '';
    let categoryClass = '';

    // Определяем категорию согласно требованиям задания [cite: 16, 17, 18, 19]
    if (bmi < 18.5) {
        category = 'Недостаточный вес'; // Underweight [cite: 16]
        categoryClass = 'category-underweight';
    } else if (bmi >= 18.5 && bmi < 24.9) {
        category = 'Нормальный вес'; // Normal weight [cite: 17]
        categoryClass = 'category-normal';
    } else if (bmi >= 25 && bmi < 29.9) {
        category = 'Избыточный вес'; // Overweight [cite: 18]
        categoryClass = 'category-overweight';
    } else { // BMI >= 30
        category = 'Ожирение'; // Obese [cite: 19]
        categoryClass = 'category-obese';
    }

    return {
        bmi: bmi.toFixed(2), // Округляем до двух знаков после запятой
        category: category,
        categoryClass: categoryClass
    };
}

// 1. Маршрут GET /: Отображает форму [cite: 11]
app.get('/', (req, res) => {
    // При первой загрузке или GET-запросе, не показываем результат
    const renderedHtml = htmlTemplate.replace('${resultPlaceholder}', ''); 
    res.send(renderedHtml);
});

// 2. Маршрут POST /calculate-bmi: Обрабатывает расчет BMI [cite: 12]
app.post('/calculate-bmi', (req, res) => {
    const weight = parseFloat(req.body.weight);
    const height = parseFloat(req.body.height);

    let resultHtml = '';

    // Валидация: Проверяем, являются ли ввод положительными числами [cite: 24]
    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        resultHtml = `
            <div class="result-box category-obese">
                Неверный ввод! Пожалуйста, введите положительные числа для веса и роста.
            </div>
        `;
    } else {
        const bmiResult = calculateBMI(weight, height);

        // Формируем HTML для отображения результата [cite: 22]
        resultHtml = `
            <div class="result-box ${bmiResult.categoryClass}">
                <p>Ваш BMI: ${bmiResult.bmi}</p>
                <p>Категория: ${bmiResult.category}</p>
            </div>
        `;
    }

    // Вставляем результат обратно в HTML-шаблон
    const renderedHtml = htmlTemplate.replace('${resultPlaceholder}', resultHtml);
    res.send(renderedHtml);
});

// Запуск сервера [cite: 9]
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});