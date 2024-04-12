// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
const uri = '/api/TodoItems';
const uric = 'api/ItemCategories';
let todos = [];
let categories = [];

function getItems() {
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayItems(data))
        .catch(error => console.error('Unable to get items.', error));
}

function getCategories() {
    fetch(uric)
        .then(response => response.json())
        .then(data => _displayCategories(data))
        .catch(error => console.error('Unable to get categories.', error));
}

function addItem() {
    const addNameTextbox = document.getElementById('add-name');
    const combo = document.getElementById('mySelect');
    //console.log(combo.value.trim());
    const item = {
        categoryId: combo.value.trim(),
        isComplete: false,
        name: addNameTextbox.value.trim()
    };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            getItems();
            addNameTextbox.value = '';
        })
        .catch(error => console.error('Unable to add item.', error));
}

function addCategory()
{
    const addCategoryTextbox = document.getElementById('add-category');

    const item = {
        title: addCategoryTextbox.value.trim()
    };

    fetch(uric, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            FillComboBox();
            getItems();
            getCategories();
            addCategoryTextbox.value = '';
        })
        .catch(error => console.error('Unable to add category.', error));
}

function FillComboBox()
{
    const selectElement = document.getElementById("mySelect");

    fetch(uric)
        .then(response => response.json())
        .then(data => {
            // Очистка существующих опций
            selectElement.innerHTML = "";

            data.forEach(item => {
                const option = document.createElement("option");
                option.value = item.id; // Или другое поле для значения
                option.text = item.title; // Или другое поле для отображаемого текста
                selectElement.add(option);
            })
        })
        .catch (error => console.error('Unable to get categories.', error));
}

function deleteItem(id) {
    // ToDO
    fetch(uri + '/' + id, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
        .then(() => {
            getItems();
        })
        .catch(error => console.error('Unable to delete item.', error));
}

function deleteCategory(id) {
    // ToDO
    fetch(uric + '/' + id, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
        .then(() => {
            getCategories();
        })
        .catch(error => console.error('Unable to delete item.', error));
}

function populateCategoryOptions() {
    fetch('api/ItemCategories')
        .then(response => response.json())
        .then(categories => {
            const selectElement = document.getElementById('edit-select');

            // Очистка списка перед добавлением новых опций
            selectElement.innerHTML = ''; 

            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.text = category.title;
                //console.log(category.title);
                selectElement.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching categories:', error));
}

function displayEditForm(id) {
    const item = todos.find(item => item.id === id);

    //document.getElementById('edit-categoryId').value = item.categoryId;
    document.getElementById('edit-name').value = item.name;
    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-isComplete').checked = item.isComplete;
    document.getElementById('editForm').style.display = 'block';

    populateCategoryOptions();
    document.getElementById('edit-select').value = item.categoryId;
}

function updateItem() {
    const itemCategoryId = document.getElementById('edit-select').value;
    //console.log(itemCategoryId);
    const itemId = document.getElementById('edit-id').value;
    //console.log(itemId);

    const item = {
        categoryId: parseInt(itemCategoryId, 10),
        id: parseInt(itemId, 10),
        isComplete: document.getElementById('edit-isComplete').checked,
        name: document.getElementById('edit-name').value.trim()
    };

    fetch(uri + '/' + itemId, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => getItems(), getCategories())
        .catch(error => console.error('Unable to update item.', error));

    closeInput();

    return false;
}

function closeInput() {
    document.getElementById('editForm').style.display = 'none';
}
function closeInputC() {
    document.getElementById('editFormC').style.display = 'none';
}

function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'to-do' : 'to-dos';

    // DoTo
    document.getElementById('counter').textContent = itemCount + ' ' + name;
}

function _displayItems(data) {
    const tBody = document.getElementById('todos');
    tBody.innerHTML = '';

    _displayCount(data.length);

    const button = document.createElement('button');

    data.forEach(item => {
        let isCompleteCheckbox = document.createElement('input');
        isCompleteCheckbox.type = 'checkbox';
        isCompleteCheckbox.disabled = true;
        isCompleteCheckbox.checked = item.isComplete;

        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', 'displayEditForm(' + item.id + ')');

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', 'deleteItem(' + item.id + ')');

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        td1.appendChild(isCompleteCheckbox);

        let td2 = tr.insertCell(1);
        let textNode = document.createTextNode(item.name);
        td2.appendChild(textNode);

        let td3 = tr.insertCell(2);
        td3.appendChild(editButton);

        let td4 = tr.insertCell(3);
        td4.appendChild(deleteButton);

        let td5 = tr.insertCell(4);
        //let categoryTitle = categories.find(c => c.id === item.categoryId)?.title || "Unknown";
        let categoryTitle = categories.find(c => c.id === item.categoryId)?.title;
        let textNode2 = document.createTextNode(categoryTitle);
        td5.appendChild(textNode2);
    });

    todos = data;
}

function _displayCategories(data) {
    categories = data;
}
