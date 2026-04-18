 document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById('accessForm');
        const usernameInput = document.getElementById('username');
        const ageInput = document.getElementById('age');
        const message = document.getElementById('message');

        form.addEventListener('submit', function (event) {
            event.preventDefault();/*без обновления страницы*/

            const username = usernameInput.value.trim();
            const age = Number(ageInput.value.trim());
            
            if (username.length === 0 ) {
                message.textContent = 'Ошибка: имя не должно быть пустым.';
                message.style.color = 'red';
                return;
            }

            if (age === 0 || age <= 0) {
                message.textContent = 'Ошибка: возраст должен быть числом больше 0.';
                message.style.color = 'red';
                return;
            }

            if (age < 18) {
                message.textContent = `Здравствуйте, ${username}. Доступ ограничен.`;
                message.style.color = 'red';
            } else if (age <= 65) {
                message.textContent = `Здравствуйте, ${username}. Доступ разрешен.`;
                message.style.color = 'green';
            } else {
                message.textContent = `Здравствуйте, ${username}. Рекомендуется упрощенный режим.`;
                message.style.color = 'orange';
            }
        });
});
 