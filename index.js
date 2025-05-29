document.addEventListener("DOMContentLoaded", function(e) {
    appendInput().then(() => {
        inputNumber();
    });
    buttonSubmit();
});

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
                category: "Accessories"
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
                    inputHTML += '<input data-input="number" type="text" data-price="'+items.price+'" data-title="'+items.title+'" data-category="'+items.category+'">'
                inputHTML += '</div>'
            inputHTML += '</div>'
        })
        findInputWrapper.innerHTML = inputHTML;
        resolve("success")
    })
}

function inputNumber(){
    var findInput = document.querySelectorAll("input[data-input='number']");
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
        dataValue = dataValue.filter(data => data.amount !== 0);
        var findTargetAppendDetail = document.querySelector('.items_in_cart')
        if(dataValue.length > 0){
            htmlCartDetail(dataValue).then(data => {
                findTargetAppendDetail.innerHTML = data;
            });
        }else{
            findTargetAppendDetail.innerHTML = "No data.";
            return;
        }
        var arrSum = dataValue.map(data => data.sumPrice);
        var totalPrice = arrSum.reduce((a,b) => (a + b))
        var totalDiscount = 0;
        console.log(totalPrice);

        var main = document.querySelector('.main_cart')
        // percentage with items category
        var findAppendValuePercentageWithCategoryDiscount = main.querySelector('[data-campaigns="percentage_discount_category"]')
        var getDataCateClothing = dataValue.filter(data => data.category == "Clothing");
        var totalClothingPrice = getDataCateClothing.map(data => data.sumPrice);
        totalClothingPrice = totalClothingPrice.reduce((a,b) => (a+b));
        var discountPercentageWithCategory = parseInt(totalClothingPrice * 15) / 100;
        totalDiscount += discountPercentageWithCategory;
        findAppendValuePercentageWithCategoryDiscount.innerHTML = discountPercentageWithCategory;
        totalPrice = (totalPrice - discountPercentageWithCategory);

        // fixed disoucnt
        var findInputFixedDiscount = main.querySelector('.fixed_discount');
        var findAppendValueFixedDiscount = main.querySelector('[data-campaigns="fixed_discount"]')
        if(findInputFixedDiscount.value !== ""){
            findAppendValueFixedDiscount.innerHTML = findInputFixedDiscount.value;
            totalPrice = totalPrice - parseInt(findInputFixedDiscount.value)
            totalDiscount +=  parseFloat(findInputFixedDiscount.value)
            console.log(findInputFixedDiscount.value, 'from fixed');
        }else{
            findAppendValueFixedDiscount.innerHTML =0;
        }
    
        // percentage
        var findInputPercentageDiscount = main.querySelector('.percentage_discount');
        var findAppendValuePercentageDiscount = main.querySelector('[data-campaigns="percentage_discount"]');
        if(findInputPercentageDiscount.value !== ""){
            var findDiscountValueByPercentage = (totalPrice * parseInt(findInputPercentageDiscount.value)) / 100
            findAppendValuePercentageDiscount.innerHTML = findDiscountValueByPercentage;
            totalPrice = totalPrice - findDiscountValueByPercentage
            totalDiscount +=  parseFloat(findDiscountValueByPercentage)
            console.log(findDiscountValueByPercentage, 'from percen');
        }else{
            findAppendValuePercentageDiscount.innerHTML = 0
        }
        
        // discount with point
        var findInputPoint = main.querySelector('.poin_discount')
        var findAppendValueDiscountPoint = main.querySelector('[data-campaigns="discount_point"]');
        if(findInputPoint.value !== ""){
            var findMaxDiscount = parseInt(totalPrice * 0.2);
            var discountValue = parseInt(findInputPoint.value) <= findMaxDiscount ? parseInt(findInputPoint.value) : findMaxDiscount
            totalPrice = totalPrice - discountValue;
            findAppendValueDiscountPoint.innerHTML = discountValue
            totalDiscount +=  parseFloat(discountValue)
            console.log(discountValue, 'from point');
        }else{
            findAppendValueDiscountPoint.innerHTML = 0
        }

        // special
        var findSpecialDiscount = parseInt(totalPrice/300);
        var specialDiscountValue = findSpecialDiscount * 40;
        var findAppendValueDiscountSpecial = main.querySelector('[data-campaigns="special_campaigns"]');
        if(specialDiscountValue !== 0){
            findAppendValueDiscountSpecial.innerHTML = specialDiscountValue
            totalDiscount +=  parseFloat(specialDiscountValue)
            totalPrice = totalPrice - specialDiscountValue;
        }else{
            findAppendValueDiscountSpecial.innerHTML = 0
        }

        var findAppendTotalDiscount = main.querySelector("[data-total='discount']");
        findAppendTotalDiscount.innerHTML = totalDiscount;
        var findAppendTotalPrice = main.querySelector("[data-total='price']");
        findAppendTotalPrice.innerHTML = totalPrice;
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