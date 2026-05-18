import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("inbox");
  const [showCompose, setShowCompose] = useState(false);
  const [newMessage, setNewMessage] = useState({
    receiverEmail: "",
    subject: "",
    content: ""
  });
  const [replyTo, setReplyTo] = useState(null);
  
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    fetchMessages();
    fetchSentMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/messages/inbox/${user.email}`);
      setMessages(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSentMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/messages/sent/${user.email}`);
      setSentMessages(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/messages/send", {
        ...newMessage,
        senderEmail: user.email
      });
      setShowCompose(false);
      setNewMessage({ receiverEmail: "", subject: "", content: "" });
      fetchMessages();
      fetchSentMessages();
      alert("Message sent successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to send message");
    }
  };

  const sendReply = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8080/api/messages/reply/${replyTo.id}`, {
        senderEmail: user.email,
        receiverEmail: replyTo.senderEmail,
        subject: replyTo.subject,
        content: newMessage.content
      });
      setReplyTo(null);
      setNewMessage({ receiverEmail: "", subject: "", content: "" });
      fetchMessages();
      fetchSentMessages();
      alert("Reply sent successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to send reply");
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/messages/read/${id}`);
      fetchMessages();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">💬 Messages</h1>
          <button
            onClick={() => setShowCompose(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            + Compose Message
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b mb-6">
          <button
            onClick={() => setActiveTab("inbox")}
            className={`pb-2 px-4 ${activeTab === "inbox" ? "border-b-2 border-blue-600 text-blue-600" : ""}`}
          >
            📥 Inbox ({messages.filter(m => !m.read).length})
          </button>
          <button
            onClick={() => setActiveTab("sent")}
            className={`pb-2 px-4 ${activeTab === "sent" ? "border-b-2 border-blue-600 text-blue-600" : ""}`}
          >
            📤 Sent
          </button>
        </div>

        {/* Compose Modal */}
        {showCompose && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-96 max-w-full">
              <h2 className="text-2xl font-bold mb-4">New Message</h2>
              <form onSubmit={sendMessage}>
                <input
                  type="email"
                  placeholder="To:"
                  className="w-full p-2 border rounded mb-3"
                  value={newMessage.receiverEmail}
                  onChange={(e) => setNewMessage({ ...newMessage, receiverEmail: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Subject:"
                  className="w-full p-2 border rounded mb-3"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Message:"
                  rows="5"
                  className="w-full p-2 border rounded mb-3"
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                  required
                />
                <div className="flex gap-2">
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Send
                  </button>
                  <button type="button" onClick={() => setShowCompose(false)} className="bg-gray-300 px-4 py-2 rounded">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reply Modal */}
        {replyTo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-96 max-w-full">
              <h2 className="text-2xl font-bold mb-4">Reply to: {replyTo.subject}</h2>
              <form onSubmit={sendReply}>
                <textarea
                  placeholder="Your reply:"
                  rows="5"
                  className="w-full p-2 border rounded mb-3"
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                  required
                />
                <div className="flex gap-2">
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Send Reply
                  </button>
                  <button type="button" onClick={() => setReplyTo(null)} className="bg-gray-300 px-4 py-2 rounded">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Messages List */}
        {activeTab === "inbox" && (
          <div className="space-y-3">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No messages in inbox</p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => markAsRead(msg.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition ${!msg.read ? "bg-blue-50 border-blue-300" : "bg-white"}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{msg.subject}</h3>
                      <p className="text-sm text-gray-600">From: {msg.senderEmail}</p>
                      <p className="mt-2">{msg.content}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setReplyTo(msg);
                      }}
                      className="text-blue-600 hover:text-blue-800 ml-4"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "sent" && (
          <div className="space-y-3">
            {sentMessages.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No sent messages</p>
            ) : (
              sentMessages.map((msg) => (
                <div key={msg.id} className="p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-bold text-lg">{msg.subject}</h3>
                  <p className="text-sm text-gray-600">To: {msg.receiverEmail}</p>
                  <p className="mt-2">{msg.content}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                  <p className="text-xs mt-1">
                    {msg.read ? "✅ Read" : "⏳ Not read yet"}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Messages;