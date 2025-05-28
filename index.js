document.addEventListener("DOMContentLoaded", function(e) {
    fixDiscount({amountDiscount:100})
    appendInput().then(() => {
        inputNumber();
    });
    buttonSubmit();
});

function fixDiscount(
    {
        discountAmout,
        discountPercentage,
        point,
        arrItems
    }
){
    let itemsInCart = [
        {
            title: "T-Shirt",
            amount: 1,
            price: 350
        },
        {
            title: "Hat",
            amount: 1,
            price: 250
        },
    ]

    let sum = itemsInCart.reduce((a, b) => {
        let sumPrice = (a.amount * a.price) + (b.amount * b.price);
        return sumPrice;
    })
    let totalPrice = sum - parseFloat(discountAmout)
    console.log('1. fix discount '+ discountAmout + ' THB');
    console.log('total price: '+ totalPrice + " THB");
}

function appendInput(){
    return new Promise((resolve) => {
        let itemsInCart = [
            {
                title: "T-Shirt",
                price: 350,
                category: "Clothing"
            },
            {
                title: "Hat",
                price: 250,
                category: "Clothing"
            },
            {
                title: "Hoodie",
                price: 700,
                category: "Clothing"
            },
            {
                title: "Watch",
                price: 700,
                category: "Electronics"
            },
            {
                title: "Bag",
                price: 640,
                category: "Accessories"
            },
            {
                title: "Belt",
                price: 230,
                category: "Accessories"
            },
        ]
        var findInputWrapper = document.querySelector('.items_wrapper');
        var inputHTML = "";
        itemsInCart.forEach(items => {
            inputHTML += '<div class="list_items">'
                inputHTML += '<div class="border">'
                    inputHTML += '<div class="items_info_wrapper">'
                        inputHTML += '<span class="title_items">'+items.title+'</span>'
                        inputHTML += '<span class="price_items">price: '+items.price+' THB</span>'
                    inputHTML += '</div>'
                    inputHTML += '<span>amount: </span>'
                    inputHTML += '<input type="text" data-price="'+items.price+'" data-title="'+items.title+'" data-category="'+items.category+'">'
                inputHTML += '</div>'
            inputHTML += '</div>'
        })
        findInputWrapper.innerHTML = inputHTML;
        resolve("success")
    })
}

function inputNumber(){
    var findInput = document.querySelectorAll("input[data-category]");
    var arrIncludeNumber = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "Backspace"
    ]
    findInput.forEach(data => {
        data.addEventListener("keydown", (e) => {
            var key = e.key;
            if(!arrIncludeNumber.some(data => data == key)) e.preventDefault();
        })
    })
}

function buttonSubmit(){
    var findButtonSubmit = document.querySelector('.btn_submit');
    console.log(findButtonSubmit);
    findButtonSubmit.addEventListener('click', () => {
        var findAllInput = document.querySelectorAll('input[data-category]');
        var dataValue = Array.from(findAllInput).map(data => {
            var getTitle = data.attributes['data-title'].value
            var getCategory = data.attributes['data-category'].value
            var getPrice = data.attributes['data-price'].value
            var getAmout = data.value
            return {
                title: getTitle,
                category: getCategory,
                price: parseInt(getPrice),
                amount: getAmout == "" ? 0 : parseInt(getAmout),
                sumPrice: parseInt(getAmout !== "" ? getAmout : 0) * parseInt(getPrice)
            }
        })
        htmlCartDetail(dataValue).then(data => {
            var findTargetAppendDetail = document.querySelector('.items_in_cart')
            findTargetAppendDetail.innerHTML = data;
        })
    })
}

function htmlCartDetail(arr){
    var html = "";
    if(!arr) return;
    return new Promise((resolve) => {
        arr.forEach(data => {
            html += '<div class="list_items_in_cart">'
                html += '<div class="border">'
                    html += '<span class="txt">items name: '+data.title+'</span>'
                    html += '<span class="txt">items amount: '+data.amount+'</span>'
                    html += '<span class="txt">items price: '+data.price+'</span>'
                    html += '<span class="txt">items sum price: '+data.sumPrice+'</span>'
                html += '</div>'
            html += '</div>'
        })
        resolve(html)
    })
}