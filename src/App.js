import React, { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';

function App() {

  // https://localhost:7268/api/customer
  const baseUrl="https://localhost:7268/api/customer";
  const [data, setData]=useState([]);
  const [modalEditar, selModalEditar]=useState(false);
  const [modalInsertar, selModalInsertar]=useState(false);
  const [modalElimiar, selModalEliminar]=useState(false);
  const [customerSeleccionado, setCustomerSeleccionado]=useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  })

  const handleChange=e=>{
    const {name, value}=e.target;
    setCustomerSeleccionado({
      ...customerSeleccionado,
      [name]: value
    });
    console.log(customerSeleccionado);
  }


  const abrirCerrarModalInsertar=()=>{
    selModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar=()=>{
    selModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar=()=>{
    selModalEliminar(!modalElimiar);
  }

  const peticionGet=async()=>{
    await axios.get(baseUrl).then(response=>{
      setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }


  const peticionPost=async()=>{
    delete customerSeleccionado.id;
    await axios.post(baseUrl, customerSeleccionado).then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
    })
  }


  // problemas al quitar ese return
  const peticionPut=async()=>{
    await axios.put(baseUrl+"/"+customerSeleccionado.id, customerSeleccionado)
    .then(response=>{
      var respuesta=response.data;
      var dataAuxiliar=data;
      dataAuxiliar.map(customer=>{
        if(customer.id===customerSeleccionado.id){
          customer.firstName=respuesta.firstName;
          customer.lastName=respuesta.lastName;
          customer.email=respuesta.email;
          customer.phone=respuesta.phone;
          customer.address=respuesta.address;          
        }
        return customer;
      });      
    abrirCerrarModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }



  const peticionDelete=async()=>{
    await axios.delete(baseUrl+"/"+customerSeleccionado.id)
    .then(response=>{
    setData(data.filter(customer=>customer.id!==response.data));
    abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }



  const seleccionarCustomer=(customer, caso)=>{
    setCustomerSeleccionado(customer);
    (caso==="Editar")?
    abrirCerrarModalEditar(): abrirCerrarModalEliminar();
  }

  useEffect(()=>{
    peticionGet();
  },[])


  return (
    <div className="App">
    <br/><br/>
    <button onClick={()=>abrirCerrarModalInsertar()} className="btn btn-success">Insertar nuevo customer</button>
    <br/><br/>
      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>Id</th>
            <th>firstName</th>
            <th>lastName</th>
            <th>email</th>
            <th>phone</th>
            <th>address</th>
            <th>acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(customer=>(
            <tr key={customer.id}>
              <th>{customer.id}</th>
              <th>{customer.firstName}</th>
              <th>{customer.lastName}</th>
              <th>{customer.email}</th>
              <th>{customer.phone}</th>
              <th>{customer.address}</th>
              <td>
                <button className="btn btn-primary" onClick={()=>seleccionarCustomer(customer, "Editar")}>Editar</button>{"  "}
                <button className="btn btn-danger" onClick={()=>seleccionarCustomer(customer, "Eliminar")}>Eliminar</button>
              </td>
          </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalInsertar}>
        <ModalHeader>Insertar Gestor de BBDD</ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <label>FirstName</label>
            <br/>
            <input type="text" className="form-control" name="firstName" onChange={handleChange}/>
            <label>LastName</label>
            <br/>
            <input type="text" className="form-control" name="lastName" onChange={handleChange}/>
            <label>Email</label>
            <br/>
            <input type="text" className="form-control" name="email" onChange={handleChange}/>
            <label>Phone</label>
            <br/>
            <input type="text" className="form-control" name="phone" onChange={handleChange}/>
            <label>Address</label>
            <br/>
            <input type="text" className="form-control" name="address" onChange={handleChange}/>
            <br/>
          </div>
        </ModalBody>
        <ModalFooter>
        <button className="btn btn-primary" onClick={()=>peticionPost()}>Insertar</button>{"  "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      
      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Gestor de BBDD</ModalHeader>
        <ModalBody>
          <div className='form-group'>
          <label>ID: </label>
            <br/>
            <input type="text" className="form-control" readOnly value={customerSeleccionado && customerSeleccionado.id}/>
            <br/>
            <label>FirstName</label>
            <br/>
            <input type="text" className="form-control" name="firstName" onChange={handleChange} value={customerSeleccionado && customerSeleccionado.firstName}/>
            <label>LastName</label>
            <br/>
            <input type="text" className="form-control" name="lastName" onChange={handleChange} value={customerSeleccionado && customerSeleccionado.lastName}/>
            <label>Email</label>
            <br/>
            <input type="text" className="form-control" name="email" onChange={handleChange} value={customerSeleccionado && customerSeleccionado.email}/>
            <label>Phone</label>
            <br/>
            <input type="text" className="form-control" name="phone" onChange={handleChange} value={customerSeleccionado && customerSeleccionado.phone}/>
            <label>Address</label>
            <br/>
            <input type="text" className="form-control" name="address" onChange={handleChange} value={customerSeleccionado && customerSeleccionado.address}/>
            <br/>
          </div>
        </ModalBody>
        <ModalFooter>
        <button className="btn btn-primary" onClick={()=>peticionPut()}>Editar</button>{"  "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
        </ModalFooter>
      </Modal>



      <Modal isOpen={modalElimiar}>
        <ModalHeader>Editar Gestor de BBDD</ModalHeader>
        <ModalBody>
        ¿Estás seguro que deseas eliminar el gestor de BD {customerSeleccionado && customerSeleccionado.firstName}?
        </ModalBody>
        <ModalFooter>
        <button className="btn btn-danger" onClick={()=>peticionDelete()}>
            Si
        </button>
        <button className="btn btn-secondary" onClick={()=>abrirCerrarModalEliminar()}>
            No
        </button>
        </ModalFooter>
      </Modal>






    </div>
  );
}

export default App;
