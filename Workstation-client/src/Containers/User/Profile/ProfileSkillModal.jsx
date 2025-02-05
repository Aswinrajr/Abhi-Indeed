import React, { useState, useContext,useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { AuthContext } from '../../../Context/UserContext';
import axiosInstance from '../../../Services/Interceptor/candidateInterceptor.js';
import './ProfileSkillModal.css';

const ProfileSkillModal = ({ show, handleClose,skillToEdit }) => {
  const { user, setUser } = useContext(AuthContext);
  const [skill, setSkill] = useState('');

  useEffect(() => {
    if (skillToEdit) {
      setSkill(skillToEdit);
    }else{
      setSkill('')
    }
  }, [skillToEdit]);

  const handleChange = (e) => {
    setSkill(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response
      if(skillToEdit){
        response=await axiosInstance.put(`/employee-editSkill/${user.email}`,{
          oldSkill:skillToEdit,
          newSkill:skill
        })
      }else{
       response= await axiosInstance.post(`/employee-addQualification/skill/${user.email}`, {
          skill
        });
      }
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setSkill('')
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} className="profile-skill-modal">
      <Modal.Header closeButton>
        <Modal.Title>{skillToEdit ? 'Edit Skill' : 'Add Skill'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formSkill">
            <Form.Label>Skill</Form.Label>
            <Form.Control
              type="text"
              value={skill}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Save Skill
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProfileSkillModal;
