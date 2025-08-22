const rawContent = `
# TMUX
## Shortcuts
C-b o       -> change panel focus
C-b <Space> -> change to next layout
C-b %       -> split screen horizontally
C-b "       -> split screen vertically
C-d         -> close panel
C-b C-o     -> rotate the panels
C-b $       -> rename actual session

## Commands
resize-panel -> set panel size

# NVIM

## Harpoon
<leader>a -> add file
C-e       -> toggle quick menu
C-h       -> open file 1
C-t       -> open file 2
C-n       -> open file 3
C-s       -> open file 4

## Other shortcuts
<leader>gs -> Git (fugitive)
<leader>u  -> toggle undotree
<leader>pf -> find files (telescope)
<leader>ps -> grep (telescope)
C-p        -> git files (telescope)

## Editor
<leader>pv -> open project view
<leader>f  -> lsp format

## LSP
C-p     -> select previous item
C-n     -> select next item
C-y     -> confirm
C-Space -> complete
`;

function toggleDarkMode(mode) {
  var html = document.getElementsByTagName('html')[0];

  if (mode !== null) {
    html.setAttribute('data-bs-theme', mode);
  }
  else {
    if (html.getAttribute('data-bs-theme') == 'dark')
      html.setAttribute('data-bs-theme', 'light');
    else
      html.setAttribute('data-bs-theme', 'dark');
  }
}

function showMyCheat(name) {
  var myCheats = ["TMUX", "NVIM"];

  myCheats.forEach(n => {
    document.getElementById(n).hidden = true;
  });

  document.getElementById(name).hidden = false;
}

function parseMyCheat() {
  var data = {};
  var categoryName = '';
  var cardName = ''; 

  rawContent.split('\n').forEach(line => {
    if (line.trim() == '') {
      // continue; 
    }
    else if (line.trim().startsWith('##')) {
      // new category
      categoryName = line.replace('##', '').trim();
      data[cardName][categoryName] = {};
    }
    else if (line.trim().startsWith('#')) {
      // new card
      cardName = line.replace('#', '').trim();
      data[cardName] = {};
    }
    else {
      // table entries
      var entry = line.split('->');
      data[cardName][categoryName][entry[0].trim()] = entry[1].trim();
    }
  });

  return data;
}

function createCard(name, entries) {
  var column = document.createElement('div');
  column.className = 'col-sm-3 m-2';

  var cardElem = document.createElement('div');
  cardElem.className = 'card card-sm';
  
  var cardHeader = document.createElement('div');
  cardHeader.className = 'card-header';
  cardHeader.innerText = name;

  column.appendChild(cardElem);
  cardElem.appendChild(cardHeader);

  var table = document.createElement('table');
  table.className = 'table table-sm table-borderless table-responsive table-hover text-center';

  var tbody = document.createElement('tbody');
  for (const key in entries) {
    var value = entries[key];
    var row = document.createElement('tr');
    row.innerHTML = '<th class="align-middle">' + key + '</th><td>' + value + '</td>';

    tbody.appendChild(row);
  }

  table.appendChild(tbody);

  var body = document.createElement('div');
  body.className = 'card-body p-0';
  body.appendChild(table);
  cardElem.appendChild(body);

  return column;
}

function createCategory(name, cards, hidden) {
  var div = document.createElement('div');
  div.className = 'row';
  div.id = name;
  div.hidden = hidden;

  if (cards === undefined || cards === null) return div;

  for (const cardName in cards) {
    var entries = cards[cardName];
    div.appendChild(createCard(cardName, entries));
  }

  return div;
}

function createCheatsheet(parsedCheat) {
  var container = document.getElementById('container');
  var hidden = false;
  var categories = [];

  var column = document.createElement('div');
  column.className = 'col-sm-3';

  var cardElem = document.createElement('div');
  cardElem.className = 'card card-sm';
  
  var cardHeader = document.createElement('div');
  cardHeader.className = 'card-header';
  cardHeader.innerText = name;

  var control = document.createElement('div');
  control.className = 'row fixed-bottom p-2 justify-content-md-center';

  var buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'col text-center';

  for (const categoryName in parsedCheat) {
    var cards = parsedCheat[categoryName];
    
    container.appendChild(createCategory(categoryName, cards, hidden));
    hidden = true;
    categories.push(categoryName);

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-primary btn-sm m-2';
    button.setAttribute('onclick', 'showMyCheat(\'' + categoryName + '\')');
    button.innerText = categoryName;

    buttonsContainer.appendChild(button);
  }

  var darkModeBtn = document.createElement('button');
  darkModeBtn.type = 'button';
  darkModeBtn.className = 'btn btn-primary btn-sm m-2';
  darkModeBtn.setAttribute('onclick', 'toggleDarkMode(null)');
  darkModeBtn.innerText = '🌑';

  buttonsContainer.appendChild(darkModeBtn);

  column.appendChild(cardElem);
  cardElem.appendChild(cardHeader);
  control.appendChild(buttonsContainer);
  container.appendChild(control);
}

