let items = []; //create an array for list item names

//add button function
function addItem() {
    let newItem = document.querySelector("#item").value; //fetching value with id
    items.push(newItem); //adding new item to the array
    document.querySelector("#item").value = ''; //clear the input box after clicking add button
    displayList(items); //call the function to refresh and show updated array
}

//clear all function
function clearAll() {
    items = []; //empty the array
    displayList(items); //call the function to refresh and show updated array

    /* another way of refreshing the display instead of calling displayList function
    const list = document.querySelector("#list"); //fetch element by id
    while (list.firstChild) { //till there is a child
        list.removeChild(list.firstChild); //remove that child
    }*/
}

//remove button function
function remove(id) {
    const deletedId = id; //assign the passed argument
    items.splice(deletedId, 1); //delete the item from array with index
    displayList(items); //call the function to refresh and show updated array
}

//function to display the list
function displayList(listItems) {

    //Clear previously displayed list to avoid showing overlapped contents when call the function again for refreshing
    const list = document.querySelector("#list"); //fetch list container in html by id
    while (list.firstChild) { //till there is a child
        list.removeChild(list.firstChild); //remove that child
    }

    //add a row in the parent node for each array item
    listItems.map(item => {
        let i = items.indexOf(item); //assign current index

        //create container row
        const row = document.createElement('div');
        row.id = "listItem";

        //create checkbox, label and button for cells
        const box = document.createElement('input');
        box.type = 'checkbox';
        box.id = i;
        box.value = item;
        box.className = "listContent";

        const listItem = document.createElement('label');
        listItem.textContent = item;
        listItem.className = "listContent";

        const bt = document.createElement('button');
        bt.id = i;
        bt.textContent = "Remove";
        bt.classList.add('listContent');
        bt.classList.add('removeBtn');
        bt.onclick = () => remove(bt.id); //pass the current index

        //add elements in the container row
        row.appendChild(box);
        row.appendChild(listItem);
        row.appendChild(bt);

        //add the row in the whole list container fetched above
        list.appendChild(row);
    })
}

//can call the function as follows to display if there is already items in the array
//displayList(items);
