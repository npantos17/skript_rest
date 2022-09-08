//const bcrypt = require('bcrypt');
function init(){
    
    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];

    fetch('http://127.0.0.1:8000/admin/users', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then( res => res.json() )
        .then( data => {
            if(data.msg){
                alert(data.msg);
            }else{
            const lst = document.getElementById('usrList');

            data.forEach( el => {
                lst.innerHTML += `<li class="id${el.id}">ID: ${el.id}, name: ${el.name}, Email: ${el.email}</li>`;
            });
        }
        });
    
        document.getElementById('createButton').addEventListener('click', e => {
            e.preventDefault();
                
            const data = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                password:document.getElementById('password').value,
                admin: document.getElementById('roleAdmin').checked
            };
        
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
        
            fetch('http://127.0.0.1:8000/admin/users', {
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
                        alert(data.msg);
                    }else{
                    document.getElementById('usrList').innerHTML += `<li class="id${data.id}">ID: ${data.id}, Name: ${data.name}, Email: ${data.email}</li>`;
                    }
                });
        });
        document.getElementById('deleteButton').addEventListener('click', e=>{
            e.preventDefault
            var id = document.getElementById('idToDelete').value
            document.getElementById('idToDelete').value = '';
            fetch('http://127.0.0.1:8000/admin/users/' + id, {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                if(data.msg){
                    alert(data.msg);
                }
            })
        });
         document.getElementById('putButton').addEventListener('click', e=>{
             e.preventDefault
             var id = document.getElementById('idToDelete').value
             const data = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password'),
                admin: document.getElementById('roleAdmin').checked
            };
            //var a = document.getElementsByClassName("id"+id)
            document.getElementById('idToDelete').value = '';
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
            //console.log(a[0].innerHTML)
             fetch('http://127.0.0.1:8000/admin/users/' + id, {
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
                    alert(data.msg);
                }
                
             })
             //.then(document.getElementsByClassName("id"+id)[0].innerHTML = `ID: ${data.id}, sellerID: ${data.sellerID}, Brand: ${data.brand}, Model: ${data.model}</li>, Year: ${data.year}, Price: ${data.price})`)
         });

}