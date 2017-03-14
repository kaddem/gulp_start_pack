# Стартовый набор для верстки (Gulp 4.0)

Клонируем в текущую папку (точка в конце через пробел):
```
$ git clone git@github.com:kaddem/gulp_start_pack.git .
```

Избавляемся от привязки к удаленному репозиторию:
```
git remote rm origin
```

Ставим зависимости:
```
npm install
```

Gulp 4 ставится локально. Для запуска проекта командой типа
```
gulp <task>
```
вводим:
```
export PATH=./node_modules/.bin:../node_modules/.bin:../../node_modules/.bin:$PATH
```

## Запуск

Пересобираем проект предварительно удалив build, запустив отслеживание изменений и пересборку с Browsersync (http://localhost:9000):
```
gulp
```

Просто на отслеживание изменений и пересборку:
```
gulp watch
```

## Пересборка

В случае удаления файлов из src, пересобрать проект:
```
gulp build
```

или перезапустить основную задачу:
```
gulp
```

## Особая благодарность

- Илье Кантору за скринкаст по Gulp 4: [Скринкаст на youtube](https://www.youtube.com/playlist?list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ)
- Константину Богданову за изначальную сборку на Gulp 3.9.1: [cotang](https://github.com/cotang)