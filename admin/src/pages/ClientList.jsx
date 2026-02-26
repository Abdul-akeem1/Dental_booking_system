import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./ClientList.css";

const API_BASE = "http://localhost:5000/api/users";

const ClientList = () => {
	//thes are states for list, search, loadin and edit mode
	const [clients, setClients] = useState([]);
	const [searchId, setSearchId] = useState("");
	const [loading, setLoading] = useState(false); //just so user doesnt think that screen is froxen
	const [editingId, setEditingId] = useState("");
	const [editData, setEditData] = useState({
		firstName: "",
		lastName: "",
		phone: "",
		email: "",
		street: "",
		town: "",
		county: "",
	});

	//get all clients from backend
	const getAllClients = async () => {
		
		const response = await axios.get(API_BASE); //call api and wait for data
		const usersFromApi = response.data.users; //backend gives users list here
		if (usersFromApi) {
			setClients(usersFromApi);
		} else {
			setClients([]); //if backend returns no users, set empty list
		}
		toast.success("loaded all clients"); //small popup to tell user it worked
		
	};

	//get one client by id
	const getClientById = async () => {
		if (searchId.trim() === "") {
			toast.error("please enter a client id");
			return;
		}

		
		const response = await axios.get(`${API_BASE}/${searchId.trim()}`); //get one client using id from input
		const oneClient = response.data; //this is one object
		const oneClientList = [oneClient]; //make it an array with one item so map can still run
		setClients(oneClientList);
		toast.success("client found"); //show popup
		
	};

	//open edit mode and fill inputs wit current values
	const startEdit = (client) => {
		setEditingId(client._id);
		setEditData({
			firstName: client.firstName || "",
			lastName: client.lastName || "",
			phone: client.phone || "",
			email: client.email || "",
			street: client.street || "",
			town: client.town || "",
			county: client.county || "",
		});
	};

	//leave eit mode
	const cancelEdit = () => {
		setEditingId("");
		setEditData({
			firstName: "",
			lastName: "",
			phone: "",
			email: "",
			street: "",
			town: "",
			county: "",
		});
	};

	//update edit state when typing in edit inpts
	const handleEditInput = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setEditData((oldData) => {
			const newData = { ...oldData }; //copy old values first
			newData[name] = value; //change only the field user typed in
			return newData;
		});

	};

	//save edited client to backend
	const saveClient = async (id) => {
		try {
			const response = await axios.put(`${API_BASE}/${id}`, editData); // send edited fields to backend

			setClients((oldList) => {
				const updatedClient = response.data.user;
				const newList = oldList.map((item) => {
					if (item._id === id) {
						return updatedClient; //replace only edited client
					}
					return item;

				});
				return newList;
			});

			toast.success("client updated successfully"); //tell user update worked
			cancelEdit();
		} catch (error) {
			toast.error(error.response?.data?.message || "failed to update client");
		}
	};

	//delete one client
	const deleteClient = async (id) => {


		try {
			await axios.delete(`${API_BASE}/${id}`); //ask backend to delete by id
			setClients((oldList) => {
				const newList = [];
				for (let i = 0; i < oldList.length; i++) {
					if (oldList[i]._id !== id) {
						newList.push(oldList[i]); //keep only items that are not deleted
					}
				}
				return newList;
			});
			toast.success("client deleted successfully");
		} catch (error) {
			toast.error(error.response?.data?.message || "failed to delete client");
		}
	};

	//make address text in simple steps
	const getAddressText = (client) => {

		const parts = [];
		if (client.street) parts.push(client.street);
		if (client.town) parts.push(client.town);
		if (client.county) parts.push(client.county);

		if (parts.length === 0) {
			return "-";
		}

		return parts.join(", ");
	};

	//simple flags so jsx below is easier to read
	const showEmptyText = !loading && clients.length === 0; //show text only when not loading and list is empty
	const showClientCards = !loading && clients.length > 0; // show cards only when not loading and list has atleast onr client


	//this renders edit inputs for one client card
	const renderEditBox = (client) => {
		return (
			<div className="edit-grid">
				{/* these inputs use editData so user can change values before save */}
				<input name="firstName" value={editData.firstName} onChange={handleEditInput} placeholder="first name" />
				<input name="lastName" value={editData.lastName} onChange={handleEditInput} placeholder="last name" />
				<input name="phone" value={editData.phone} onChange={handleEditInput} placeholder="phone" />
				<input name="email" value={editData.email} onChange={handleEditInput} placeholder="email" />
				<input name="street" value={editData.street} onChange={handleEditInput} placeholder="street" />
				<input name="town" value={editData.town} onChange={handleEditInput} placeholder="town" />
				<input name="county" value={editData.county} onChange={handleEditInput} placeholder="county" />

				<div className="row-actions">
					{/* save sends update to backend and cancel closes edit mode */}
					<button type="button" onClick={() => saveClient(client._id)}>save</button>
					<button type="button" onClick={cancelEdit}>cancel</button>
				</div>
			</div>
		);
	};

	// .this renders normal text view for one client card
	const renderViewBox = (client) => {
		return (
			<div>
				{/* show saved client data in normal mode */}
				<p><strong>name:</strong> {client.firstName} {client.lastName}</p>
				<p><strong>email:</strong> {client.email}</p>
				<p><strong>phone:</strong> {client.phone || "-"}</p>
				<p><strong>address:</strong> {getAddressText(client)}</p>

				<div className="row-actions">
					{/* update opens edit inputs, delete removes this client */}
					<button type="button" onClick={() => startEdit(client)}>update</button>
					<button type="button" onClick={() => deleteClient(client._id)}>delete</button>
				</div>
			</div>
		);
	};

	//this makes one full card
	const renderClientCard = (client) => {
		//check if this specific card is currently in edit mode
		const isEditingThisCard = editingId === client._id;

		return (
			//key helps  track each card in list correctly
			<div key={client._id} className="client-card">
				<p><strong>id:</strong> {client._id}</p>
				{/* if editing show edit box, else show normal view box */}
				{isEditingThisCard ? renderEditBox(client) : renderViewBox(client)}
			</div>
		);
	};

	return (
		<div className="client-list-page">
			<h2>client list</h2>

			<div className="toolbar">
				<button type="button" onClick={getAllClients}>find all clients</button>

				<input
					className="id-input"
					type="text"
					placeholder="enter client id"
					value={searchId}
					onChange={(e) => setSearchId(e.target.value)}
				/>

				<button type="button" onClick={getClientById}>find by id</button>
			</div>

			{loading && <p>loading</p>}

			{showEmptyText && <p>no clients to show</p>}

			{showClientCards && (
				<div className="cards-grid">
					{/* loop all clients and render one card for each */}
					{clients.map((client) => renderClientCard(client))}
				</div>
			)}
		</div>
	);
};

export default ClientList;
