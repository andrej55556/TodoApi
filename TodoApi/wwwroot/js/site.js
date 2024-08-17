// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
const uri = '/api/TodoItems';
const uric = 'api/ItemCategories';
let todos = [];
let categories = [];

async function getItems() {
    FillComboBox();
    await fetch(uri)
        .then(response => response.json())
        //.then(getCategories())
        //.then(data => await _displayItems(data))
        .then(async function (data) { await _displayItems(data) })
        .catch(error => console.error('Unable to get items.', error));
}

async function getCategories() {
    FillComboBox();
    await fetch(uric)
        .then(response => response.json())
        //.then(data => await _displayCategories(data))
        .then(async function (data) { await _displayCategories(data) })
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
            getItems();
            getCategories();
        })
        .catch(error => console.error('Unable to delete item.', error));
}

function deleteCategory() {
    //category => category.title == item.categoryId
    const id = categories.find(category => category.title == document.getElementById('edit-title').value).id;
    console.log(id);

    fetch(uric + '/' + id, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
        .then(() => {
            getItems();
            getCategories();
        })
        .catch(error => console.error('Unable to delete item.', error));
}

function populateCategoryOptions(index) {
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

            selectElement[index].selected = true;
        })
        .catch(error => console.error('Error fetching categories:', error));
}

function displayEditForm(id) {
    const item = todos.find(item => item.id === id);
    const category = categories.find(category => category.id == item.categoryId)

    document.getElementById('edit-name').value = item.name;
    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-isComplete').checked = item.isComplete;
    document.getElementById('editForm').style.display = 'block';

    populateCategoryOptions(categories.indexOf(category));

    document.getElementById('edit-categoryId').value = category.id;
    document.getElementById('edit-title').value = category.title;
    document.getElementById('editFormC').style.display = 'block';

    document.getElementById('Delete').style.display = 'block';
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

let selected_id = -1;

function updateCategory()
{
    //const itemCategoryId = document.getElementById('edit-categoryId').value;
    const itemCategoryId = selected_id;
    if(itemCategoryId != -1)
    { 
        const item = {
            id: parseInt(itemCategoryId, 10),
            title: document.getElementById('edit-title').value.trim()
        };

        fetch(uric + '/' + itemCategoryId, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        })
            .then(() => getItems(), getCategories())
            .catch(error => console.error('Unable to update category.', error));

        closeInput();
    }

    return false;
}

function editc()
{
    const itemCategoryId = document.getElementById('mySelect').options[document.getElementById('mySelect').selectedIndex].text;
    document.getElementById('edit-title').value = itemCategoryId;
    selected_id = document.getElementById('mySelect').value;
}

function closeInput() {
    document.getElementById('editForm').style.display = 'none';
}
function closeInputC() {
    document.getElementById('editFormC').style.display = 'none';
}
function closeDelete() {
    document.getElementById('Delete').style.display = 'none';
}

function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'to-do' : 'to-dos';

    // DoTo
    document.getElementById('counter').textContent = itemCount + ' ' + name;
}

async function _displayItems(data) {
    await getCategories();
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
        //alert(JSON.stringify(categories/*.filter(c => { return c.id === item.categoryId })[0]*/, null, 2));
        let categoryTitle = categories.find(c => c.id === item.categoryId)?.title;
        let textNode2 = document.createTextNode(categoryTitle);
        td5.appendChild(textNode2);

        let editButtonC = button.cloneNode(false);
        editButtonC.innerText = 'Edit';
        //editButtonC.setAttribute('onclick', 'displayEditFormC(' + categoryId + ')');
        editButtonC.setAttribute('onclick', 'displayEditForm(' + item.id + ')');

        let deleteButtonC = button.cloneNode(false);
        deleteButtonC.innerText = 'Delete';
        deleteButtonC.setAttribute('onclick', 'deleteCategory(' + item.categoryId + ')');

        let td6 = tr.insertCell(5);
        td6.appendChild(editButtonC);
        let td7 = tr.insertCell(6);
        td7.appendChild(deleteButtonC);
    });

    todos = data;
}

async function _displayCategories(data) {
    if (data.length == 0)
        return;
    categories = data;
    //alert(JSON.stringify(categories, null, 2));
}
