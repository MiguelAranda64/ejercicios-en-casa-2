import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import {
  Table,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  FormGroup,
  Input,
} from 'reactstrap';

function UserCRUD() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
  });
  const [insertarModal, setInsertarModal] = useState(false);
  const [actualizarModal, setActualizarModal] = useState(false);
  const [eliminarModal, setEliminarModal] = useState(false);
  const [detallesModal, setDetallesModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/users');
      setData(response.data);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:9000/api/users', form);
      fetchData();
      cerrarModalInsertar();
    } catch (error) {
      console.error('Error al insertar el usuario:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:9000/api/users/${form._id}`, form);
      fetchData();
      cerrarModalActualizar();
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:9000/api/users/${form._id}`);
      fetchData();
      cerrarModalEliminar();
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  const mostrarModalInsertar = () => {
    setInsertarModal(true);
    setForm({
      username: '',
      password: '',
      email: '',
    });
  };

  const mostrarModalActualizar = (user) => {
    setForm(user);
    setActualizarModal(true);
  };

  const mostrarModalEliminar = (user) => {
    setForm(user);
    setEliminarModal(true);
  };

  const mostrarModalDetalles = (user) => {
    setForm(user);
    setDetallesModal(true);
  };

  const cerrarModalInsertar = () => {
    setInsertarModal(false);
  };

  const cerrarModalActualizar = () => {
    setActualizarModal(false);
  };

  const cerrarModalEliminar = () => {
    setEliminarModal(false);
  };

  const cerrarModalDetalles = () => {
    setDetallesModal(false);
  };

  return (
    <div>
      <br />
      <Button color="outline-success" onClick={mostrarModalInsertar}>
        New User
      </Button>
      <br />
      <br />
      <Table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {data.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <Button color="primary" onClick={() => mostrarModalActualizar(user)}>
                  Update
                </Button>
                {' '}
                <Button color="success" onClick={() => mostrarModalDetalles(user)}>
                  Detail
                </Button>
                {' '}
                <Button color="danger" onClick={() => mostrarModalEliminar(user)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal isOpen={insertarModal}>
                  
        <ModalHeader>
          <div>
            <h3>Add new user</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <label>Username</label>
            <Input className="form-control" name="username" type="text" value={form.username} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <label>Password</label>
            <Input className="form-control" name="password" type="password" value={form.password} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <label>Email</label>
            <Input className="form-control" name="email" type="email" value={form.email} onChange={handleChange} />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={handleSubmit}>Add</Button>
          <Button color="danger" onClick={cerrarModalInsertar}>Cancel</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={actualizarModal}>
  <ModalHeader>
    <div>
      <h3>Update</h3>
    </div>
  </ModalHeader>
  <ModalBody>
    <FormGroup>
      <label>ID</label>
      <Input className="form-control" name="_id" type="text" value={form._id} readOnly />
    </FormGroup>
    <FormGroup>
      <label>Username</label>
      <Input className="form-control" name="username" type="text" value={form.username} onChange={handleChange} />
    </FormGroup>
    <FormGroup>
      <label>Password</label>
      <Input className="form-control" name="password" type="password" value={form.password} onChange={handleChange} />
    </FormGroup>
    <FormGroup>
      <label>Email</label>
      <Input className="form-control" name="email" type="email" value={form.email} onChange={handleChange} />
    </FormGroup>
  </ModalBody>
  <ModalFooter>
    <Button color="primary" onClick={handleUpdate}>Update</Button>
    <Button color="danger" onClick={cerrarModalActualizar}>Cancel</Button>
  </ModalFooter>
</Modal>


<Modal isOpen={eliminarModal}>
  <ModalHeader>
    <div>
      <h3>Delete</h3>
    </div>
  </ModalHeader>
  <ModalBody>
    <FormGroup>
      <label>ID</label>
      <Input className="form-control" name="_id" type="text" value={form._id} readOnly />
    </FormGroup>
    <FormGroup>
      <label>Username</label>
      <Input className="form-control" name="username" type="text" value={form.username} readOnly />
    </FormGroup>
    <FormGroup>
      <label>Email</label>
      <Input className="form-control" name="email" type="email" value={form.email} readOnly />
    </FormGroup>
  </ModalBody>
  <ModalFooter>
    <Button color="danger" onClick={handleDelete}>Delete</Button>
    <Button color="secondary" onClick={cerrarModalEliminar}>Cancel</Button>
  </ModalFooter>
</Modal>


<Modal isOpen={detallesModal}>
  <ModalHeader>
    <div>
      <h3>Detail</h3>
    </div>
  </ModalHeader>
  <ModalBody>
    <FormGroup>
      <label>ID</label>
      <section>{form._id}</section>
      <hr />
    </FormGroup>
    <FormGroup>
      <label>Username</label>
      <section>{form.username}</section>
      <hr />
    </FormGroup>
    <FormGroup>
      <label>Email</label>
      <section>{form.email}</section>
    </FormGroup>
  </ModalBody>
  <ModalFooter>
    <Button color="secondary" onClick={cerrarModalDetalles}>Close</Button>
  </ModalFooter>
</Modal>

    </div>
  );
}

export default UserCRUD;
