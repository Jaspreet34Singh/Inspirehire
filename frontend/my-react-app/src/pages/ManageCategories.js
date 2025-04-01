import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Alert,
} from "react-bootstrap";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:3000/jobs/categories");
      setCategories(res.data.categories);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddOrEdit = async () => {
    if (!newCategory.trim()) return setError("Category name cannot be empty");

    try {
      if (editMode) {
        await axios.put(
          `http://localhost:3000/jobs/categories/${editId}`,
          { name: newCategory },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
      } else {
        await axios.post(
          `http://localhost:3000/jobs/categories`,
          { name: newCategory },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
      }

      setNewCategory("");
      setEditMode(false);
      setEditId(null);
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      console.error("Error saving category:", err);
      setError("Failed to save category.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await axios.delete(`http://localhost:3000/jobs/categories/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      setError("Failed to delete category.");
    }
  };

  const handleEdit = (category) => {
    setEditMode(true);
    setEditId(category.Category_ID);
    setNewCategory(category.Category_Name);
    setShowModal(true);
  };

  return (
    <Container className="mt-4">
      <h2>Manage Job Categories</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Button variant="primary" className="mb-3" onClick={() => {
        setShowModal(true);
        setEditMode(false);
        setNewCategory("");
        setError("");
      }}>
        + Add Category
      </Button>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Category Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center">No categories found</td>
            </tr>
          ) : (
            categories.map((cat, idx) => (
              <tr key={cat.Category_ID}>
                <td>{idx + 1}</td>
                <td>{cat.Category_Name}</td>
                <td>
                  <Button size="sm" variant="warning" className="me-2" onClick={() => handleEdit(cat)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(cat.Category_ID)}>Delete</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit" : "Add"} Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddOrEdit}>
            {editMode ? "Update" : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageCategories;
