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

## Запуск

Gulp 4 ставится локально. Для запуска проекта:
```
npm run gulp
```

## Создаем новые БЭМ блоки

Находясь в корне проекта:
```
$ node newBlock.js blockName blockName2
```

Создаются папки по имени блоков с вложенными одноименными jade и less файлами
```
src/blocks/{blockName}/blockName.less
src/blocks/{blockName}/blockName.jade
```

В диспетчере подключений jade прописываются инклюды созданных БЭМ блоков
```
src/html/connect/_blocks.jade
```

В диспетчере подключений less прописываются импорты Less файлов созданных БЭМ блоков
```
src/less/style.less
```

### Важно!
При физическом удалении папки блока с диска, подключения этих блоков в style.less и _blocks.jade не удалаются. Удалить их вручную и перезапустить сборку.

## Структура папок и файлов
```
src
├───assets
│   ├───bemtoJade (используется)
│   └───bemtoPug (для перехода на Pug)
│
├───blocks
│   └───blockName
│       ├───blockName.jade
│       └───blockName.less
│ 
├───html
│   ├───connect
│   │   └───_blocks.jade
│   │
│   ├───layout
│   │   └───_layoutBase.jade
│   │
│   ├───pages
│   │   └───index.jade
│   │
│   └───template
│       └───_head.jade
│
├───less
│   ├───common
│   │   ├───_grid.less
│   │   ├───_png-sprite.less
│   │   └───_variables.less
│   │
│   ├───vendor
│   │   ├───normalize.css
│   │   └───bootstrap
│   │
│   └───style.less (диспетчер подключений .less файлов)
│
├───js
│   ├───vendor
│   │   ├───jQuery.js
│   │   └───etc.js
│   │
│   └───scripts
│       └───myscript.js
│
└───img
    ├───png-sprite
    │   ├───file1.png
    │   └───file2.png
    │
    ├───images1.jpg
    └───images2.png

```