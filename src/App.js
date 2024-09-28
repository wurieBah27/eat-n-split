import React, { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function FriensdList({ addFriend, handleSelectedFriend, selectedFriend }) {
  return (
    <ul>
      {addFriend.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          handleSelectedFriend={handleSelectedFriend}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, handleSelectedFriend, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 ? (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}
        </p>
      ) : friend.balance > 0 ? (
        <p className="green">
          {" "}
          {friend.name} owe you {Math.abs(friend.balance)}{" "}
        </p>
      ) : (
        <p> You and {friend.name} are even</p>
      )}
      <Button onClick={() => handleSelectedFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ onClick, children }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

/* FORM FOR ADDING A NEW FRIEND */
function AddfriendForm({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  const id = crypto.randomUUID();

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const newFriend = { name, balance: 0, image: `${image}?=${id}`, id };
    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👯 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>📷 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

/* FORM TO CALCULATE THE SPLIT BILL */
function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const [whoIspaying, setWhoIsPaing] = useState("you");

  const paidByFriend = bill ? bill - paidByUser : "";

  function handleSubmit(e) {
    e.preventDefault();

    const value = whoIspaying === "you" ? paidByFriend : -paidByUser;
    onSplitBill(value);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <div className="top-title-image">
        <h2 className="title">Split a bill with {selectedFriend.name}</h2>
        <img src={selectedFriend.image} alt={selectedFriend.name} />
      </div>

      <label>💴 Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(+e.target.value)}
      />

      <label>🧑‍🦱 Your Expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(+e.target.value > bill ? paidByUser : +e.target.value)
        }
      />

      <label>👯 {selectedFriend.name}'s Expense </label>
      <input type="text" disabled value={paidByFriend} />

      <label>💰 Who is paying the Bill ?</label>
      <select
        value={whoIspaying}
        onChange={(e) => setWhoIsPaing(e.target.value)}
      >
        <option value={"you"}>You</option>
        <option value={"friend"}> {selectedFriend.name} </option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}

/* APP COMPONENT */
const App = () => {
  const [showAddFriend, setshowAddFriend] = useState(false);
  const [addFriend, setAddFriend] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function onSplitBill(value) {
    setAddFriend((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: value + friend.balance }
          : friend
      )
    );
  }

  function handleSelectedFriend(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setshowAddFriend(false);
  }

  function addFriends(friend) {
    setAddFriend((addFriend) => [...addFriend, friend]);
    setshowAddFriend(false);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriensdList
          addFriend={addFriend}
          handleSelectedFriend={handleSelectedFriend}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && <AddfriendForm onAddFriend={addFriends} />}
        <Button onClick={() => setshowAddFriend((show) => !show)}>
          {!showAddFriend ? "Add a new friend" : "Close"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={onSplitBill}
        />
      )}
    </div>
  );
};
export default App;
