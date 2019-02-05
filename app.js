var bookController = (function(){
    var Book = function(id,title, author, isbn){
        this.id = id;
        this.title = title;
        this.author = author;
        this.isbn   = isbn;
    };
    data = {
        allItems : [],
        books : 0
    };
    return {
        addItem : function(title,author,isbn){
            var ID, newItem;
            if(data.allItems.length > 0){
                ID = data.allItems[data.allItems.length-1].id + 1;
            }else {
                ID = 0;
            }
                newItem = new Book(ID, title, author, isbn);
                data.allItems.push(newItem);
                persistData();
            return  newItem;
        },
        removeItem : function(id){
            var ids, index;
            ids = data.allItems.map(function(el){
               return  el.id;
            })
            index = ids.indexOf(id);
            if(index !== -1){
                data.allItems.splice(index,1);
                persistData();
            }
        },
         calculateNr : function(){
             var num = data.allItems.length;
             data.books = num;
         },
         getNr : function(){
             return {
                 number : data.books
             }
         },
        testing : function(){
            console.log(data);
        }
    }
})();

var UIController = (function(){
    var DOMstrings = {
        btnStart : '.button',
        title    : '.book-title',
        author   : '.book-author',
        isbn     : '.book-isbn',
        textContainer : '#table',
        number   : '.header__number'
    };
    return {
        getDOM : function(){
            return DOMstrings;
        },
        input : function(){
            return {
                title : this.capitalizeFirstLetter(document.querySelector(DOMstrings.title).value),
                author :this.capitalizeFirstLetter(document.querySelector(DOMstrings.author).value),
                isbn : document.querySelector(DOMstrings.isbn).value,
            }
        },
        displayItem : function(obj){
            var html, newHtml;
            html = '<tr id="%id%"><td>%title%</td><td>%author%</td><td>ISBN %isbn%  <i class="fas fa-trash-alt" id=table__icon></i></td></tr>'

            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%title%', obj.title);
            newHtml = newHtml.replace('%author%', obj.author);
            newHtml = newHtml.replace('%isbn%', obj.isbn);
            document.querySelector(DOMstrings.textContainer).insertAdjacentHTML('beforeend', newHtml);
        },
        clearInput : function(){
            var field1, field2, field3;
            field1 = document.querySelector(DOMstrings.title);
            field2 = document.querySelector(DOMstrings.author);
            field3 = document.querySelector(DOMstrings.isbn);
            field1.value = '';
            field2.value = '';
            field3.value = '';
            field1.focus();
        },
        displayNumber : function(obj){
            document.querySelector(DOMstrings.number).textContent = obj.number;
        },
        deleteItem : function(selectorId){
            var el = document.getElementById(selectorId);
            el.parentNode.removeChild(el);
        },
         capitalizeFirstLetter : function(string){
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }
})();
var appController = (function(bookCtrl, UICtrl){
    var setEvents = function(){
        var DOM = UICtrl.getDOM();
        document.querySelector(DOM.btnStart).addEventListener("click", addItem);
        document.addEventListener("keydown", function(e){
            if(e.keyCode === 13){
           addItem();
       }
       document.querySelector(DOM.textContainer).addEventListener("click", deleteItem);
    })
    };
    var updateNr = function(){
        bookCtrl.calculateNr();
        var nr = bookCtrl.getNr();
        UICtrl.displayNumber(nr);
    }
    var addItem = function(){
        var input = UICtrl.input();
        if(isNaN(input.title) && isNaN(input.author) && !isNaN(input.isbn)
        && input.isbn > 0){
            //add to bookControlloer database
            var newItem = bookCtrl.addItem(input.title, input.author, input.isbn);
            //add to UI
            var displayItem = UICtrl.displayItem(newItem);
            //clear Imputs
            var clearData = UICtrl.clearInput();
            updateNr();
        }
    };
    var deleteItem = function(e){
        var item = e.target.parentNode.parentNode.id;
        if(item){
           item = parseInt(item);
           bookCtrl.removeItem(item);
           UICtrl.deleteItem(item);
           updateNr();    
        }
    }
    return {
        init: function(){
            setEvents();
            console.log("app started");  
        } 
    }
})(bookController, UIController)
appController.init();
