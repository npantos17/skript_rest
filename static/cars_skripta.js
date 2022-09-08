function init() {

    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];

    
    
    fetch('http://127.0.0.1:8000/admin/cars', {
         headers: {
             'Authorization': `Bearer ${token}`
         }
    })
        .then( res => res.json() )
        .then( data => {
            const lst = document.getElementById('carList');

            data.forEach( el => {
                lst.innerHTML += `<li class="id${data.id}">ID: ${el.id}, sellerID: ${data.sellerID}, Brand: ${el.brand}, Model: ${el.model}, Year: ${el.year}, Price: ${el.price}, Order ID: ${el.OrderId}</li>`;
            });
        });

    
        document.getElementById('createButton').addEventListener('click', e => {
            e.preventDefault();
            
            const data = {
                //SellerId: document.getElementById('sellerID'),
                brand: document.getElementById('brand').value,
                model: document.getElementById('model').value,
                year: document.getElementById('year').value,
                price: document.getElementById('price').value,
                OrderId: document.getElementById('OrderId').value
            };
            //document.getElementById('sellerID').value = '';
            document.getElementById('brand').value = '';
            document.getElementById('model').value = '';
            document.getElementById('year').value = '';
            document.getElementById('price').value = '';
            document.getElementById('OrderId').value = '';
        
            fetch('http://127.0.0.1:8000/admin/cars', {
                method: 'POST',
                headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })
                //.then(res => alert(res.msg))
                .then( res => res.json() )
                .then( data => {
                    if(data.msg){
                        alert(data.msg)
                    }else{
                    document.getElementById('carList').innerHTML += `<li id="id${data.id}">ID: ${data.id}, sellerID: ${data.sellerID}, Brand: ${data.brand}, Model: ${data.model}, Year: ${data.year}, Price: ${data.price}, Order ID: ${data.OrderId}</li>`;
                    }
                });
        });
        document.getElementById('deleteButton').addEventListener('click', e=>{
            e.preventDefault
            var id = document.getElementById('idToDelete').value
            var a = document.getElementById("id"+id)
            document.getElementById('idToDelete').value = '';
            fetch('http://127.0.0.1:8000/admin/cars/' + id, {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then(a.innerHTML = '')
        });
         document.getElementById('putButton').addEventListener('click', e=>{
             e.preventDefault
             var id = document.getElementById('idToDelete').value
             const data = {
                //SellerId: document.getElementById('sellerID'),
                brand: document.getElementById('brand').value,
                model: document.getElementById('model').value,
                year: document.getElementById('year').value,
                price: document.getElementById('price').value,
                OrderId: document.getElementById('OrderId').value
            };
            var a = document.getElementById("id"+id)
            document.getElementById('idToDelete').value = '';
            //document.getElementById('sellerID').value = '';
            document.getElementById('brand').value = '';
            document.getElementById('model').value = '';
            document.getElementById('year').value = '';
            document.getElementById('price').value = '';
            document.getElementById('OrderId').value = '';
            //console.log(a[0].innerHTML)
             fetch('http://127.0.0.1:8000/admin/cars/' + id, {
                 method: 'PUT',
                 headers: { 
                     'Content-Type': 'application/json' ,
                     'Authorization': `Bearer ${token}`
                },
                 body: JSON.stringify(data)
             })
             .then(res => res.json())
             .then(data => {
                 if(data.msg){
                     alert(data.msg)
                 }
             })
             .then(a.innerHTML = `ID: ${data.id}, sellerID: ${data.sellerID}, Brand: ${data.brand}, Model: ${data.model}</li>, Year: ${data.year}, Price: ${data.price})`)
         });

}