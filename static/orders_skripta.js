function init() {

    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];
    
    fetch('http://127.0.0.1:8000/admin/orders', {
         headers: {
             'Authorization': `Bearer ${token}`
         }
    })
        .then( res => res.json() )
        .then( data => {
            const lst = document.getElementById('orderList');

            data.forEach( el => {
                lst.innerHTML += `<li class="id${el.id}">ID: ${el.id}, Car ID: ${el.CarId}, Seller ID: ${el.sellerID}, Buyer ID: ${el.buyerID}</li>`;
            });
        });

    
        document.getElementById('createButton').addEventListener('click', e => {
            e.preventDefault();
                
            const data = {
                CarId: document.getElementById('carID').value,
                SellerId: document.getElementById('sellerID').value,
                buyerID: document.getElementById('buyerID').value
        
            };
        
            document.getElementById('carID').value = '';
            document.getElementById('sellerID').value = '';
            document.getElementById('buyerID').value = '';
        
            fetch('http://127.0.0.1:8000/admin/orders', {
                method: 'POST',
                headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })
                .then( res => res.json() )
                .then( data => {
                    if(data.msg){
                        alert(data.msg)
                    }else{
                    document.getElementById('orderList').innerHTML += `<li class="id${data.id}">ID: ${data.id}, Car ID: ${data.CarId}, Seller ID: ${data.SellerId}, Buyer ID: ${data.buyerID}</li>`;
                    }
                });
        });
        document.getElementById('deleteButton').addEventListener('click', e=>{
            e.preventDefault
            var id = document.getElementById('idToDelete').value
            document.getElementById('idToDelete').value = '';
            fetch('http://127.0.0.1:8000/admin/orders/' + id, {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => res.json())
        });
         document.getElementById('putButton').addEventListener('click', e=>{
             e.preventDefault
             var id = document.getElementById('idToDelete').value
             const data = {
                CarId: document.getElementById('carID').value,
                sellerID: document.getElementById('sellerID').value,
                buyerID: document.getElementById('buyerID').value
            };
            var a = document.getElementsByClassName("idToDelete"+id)
            document.getElementById('idToDelete').value = '';
            document.getElementById('carID').value = '';
            document.getElementById('sellerID').value = '';
            document.getElementById('buyerID').value = '';
            //console.log(a[0].innerHTML)
             fetch('http://127.0.0.1:8000/admin/orders/' + id, {
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
             //.then(document.getElementsByClassName("id"+id)[0].innerHTML = `ID: ${data.id}, sellerID: ${data.sellerID}, Brand: ${data.brand}, Model: ${data.model}</li>, Year: ${data.year}, Price: ${data.price})`)
         });

}