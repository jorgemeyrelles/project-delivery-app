import React from 'react';
import FormAdmin from '../../components/FormLogin';
import ListUsers from '../../components/ListUsers';
import Navbar from '../../components/Navbar';

function AdminForm() {
  return (
    <div>
      <Navbar />
      <FormAdmin />
      <ListUsers />
    </div>
  );
}

export default AdminForm;
