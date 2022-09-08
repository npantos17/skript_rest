function init() {

    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];
    
    fetch('http://127.0.0.1:8000/admin/sellers', {
         headers: {
             'Authorization': `Bearer ${token}`
         }
    })
        .then( res => res.json() )
        .then( data => {
            const lst = document.getElementById('sellerList');

            data.forEach( el => {
                lst.innerHTML += `<li class="id${el.id}">ID: ${el.id}, Name: ${el.name}, Email: ${el.email}, Address: ${el.address}, Rating: ${el.rating}</li>`;
            });
        });

    
        document.getElementById('createButton').addEventListener('click', e => {
            e.preventDefault();
                
            const data = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                address: document.getElementById('address').value,
                rating: document.getElementById('rating').value
                
            };
        
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('address').value = '';
            document.getElementById('rating').value = '';
        
            fetch('http://127.0.0.1:8000/admin/sellers', {
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
                    document.getElementById('sellerList').innerHTML +=  `<li class="id${data.id}">ID: ${data.id}, Name: ${data.name}, Email: ${data.email}, Address: ${data.address}, Rating: ${data.rating}</li>`;
                    }
                });
        });
        document.getElementById('deleteButton').addEventListener('click', e=>{
            e.preventDefault
            var id = document.getElementById('idToDelete').value
            document.getElementById('idToDelete').value = '';
            fetch('http://127.0.0.1:8000/admin/sellers/' + id, {
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
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                address: document.getElementById('address').value,
                rating: document.getElementById('rating').value
            };
            var a = document.getElementsByClassName("idToDelete"+id)
            document.getElementById('idToDelete').value = '';
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('address').value = '';
            document.getElementById('rating').value = '';
            //console.log(a[0].innerHTML)
             fetch('http://127.0.0.1:8000/admin/sellers/' + id, {
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