import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaTimesCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axiosInstance from '../../../Services/Interceptor/candidateInterceptor.js';
import './ReportJobModal.css';

function ReportJobModal({ show, handleClose, jobTitle,jobId, companyName }) {
  const [problem, setProblem] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!problem && !description) {
        Swal.fire('Error', 'Please provide both a problem and a description.', 'error');
        return;
    }
    try {
        const response=await axiosInstance.post('/employee-jobReport',{
            jobId:jobId,
            reason:problem,
            description:description
        })
        if (response.data.success) {
            Swal.fire({
                title: 'Success!',
                text: response.data.message,
                icon: 'success',
                timer: 5000, 
                position: 'top-center',
            }).then((result) => {
                if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
                    handleClose();
                }
            });
            setProblem('')
            setDescription('')
        }else{
            Swal.fire('Failed', 'Failed to submit the report. Please try again later.', 'error');
        }
    } catch (error) {
        Swal.fire('Error', 'An error occurred while submitting your report. Please try again later.', 'error');
    }
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="report-job-modal">
      <Modal.Header>
        <Modal.Title>Choose a Problem :</Modal.Title>
        <Button variant="link" onClick={handleClose} className="close-button">
          <FaTimesCircle />
        </Button>
      </Modal.Header>
      <Modal.Body>
        <h5>{jobTitle}</h5>
        <p>{companyName}</p>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Check
              type="radio"
              label="It's offensive or harassing"
              name="reportReason"
              value="offensive"
              onChange={(e) => setProblem(e.target.value)}
            />
            <Form.Check
              type="radio"
              label="Asking for money or seems like a fake job"
              name="reportReason"
              value="fake"
              onChange={(e) => setProblem(e.target.value)}
            />
            <Form.Check
              type="radio"
              label="Incorrect company, location or job details"
              name="reportReason"
              value="incorrect"
              onChange={(e) => setProblem(e.target.value)}
            />
            <Form.Check
              type="radio"
              label="I think it's NOT a Job, but selling something"
              name="reportReason"
              value="notJob"
              onChange={(e) => setProblem(e.target.value)}
            />
            <Form.Check
              type="radio"
              label="Other"
              name="reportReason"
              value="other"
              onChange={(e) => setProblem(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Describe your problem below:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Form.Text className="text-muted">
              {description.length}/300
            </Form.Text>
          </Form.Group>
          <div className="privacy-notice">
            <p>
              <strong>Protect your privacy</strong>
              <br />
              Avoid disclosing personal information like your name, phone
              number, or any details that may personally identify you.
            </p>
          </div>
          <Button variant="primary" style={{}} type="submit" block>
            Report
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ReportJobModal;