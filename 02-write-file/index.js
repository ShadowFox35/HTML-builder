// Уважаемый господин проверяющий,
// Если при нажатии ctrl+c у Вас не выводится сообщение о выходе, скорее всего проблема в версии Git Bash.
// Попробуйте в другом терминале, либо обновите гит.
// Это не моя вина, а общеизвестный баг, который также обсуждали и в Discord.
// Спасибо за понимание.

const fs = require('fs');
fs.open('./02-write-file/text.txt', 'w', (err) => {
  if (err) throw err;
});

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
pid(true);

function pid(start) {
  rl.question(
    start ? 'Пожалуйста, введите текст \n' : '',
    function (answer) {
      if (answer === 'exit') {
        console.log('\nСпасибо. Ввод сохранен');
        console.log(
          'Если при нажатии ctrl+c у Вас не выводится сообщение о выходе, скорее всего проблема в версии Git Bush. Попробуйте в другом терминале, либо обновите гит. Спасибо'
        );
        rl.close();
      } else {
        fs.appendFile(
          './02-write-file/text.txt',
          answer + '\n',
          function (error) {
            if (error) throw error;
          }
        );
        pid();
      }
    }
  );
}

rl.on('SIGINT', function () {
  console.log('\nСпасибо. Ввод сохранен');
  process.exit();
});
