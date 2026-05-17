import Navbar from "../components/Navbar";
import { useState } from "react";

import {
  submitDailyReturn,
  getEInvoiceData
} from "../services/dailyReturnService";

function DailyReturn() {

  const [invoice, setInvoice] = useState({
    invoiceNumber: "",
    amount: "",
    description: "",
    manualEntry: false,
    justification: "",
    attachmentName: ""
  });

  const handleChange = (e) => {

    setInvoice({
      ...invoice,
      [e.target.name]: e.target.value
    });
  };

  const loadInvoiceData = async () => {

    try {

      const res = await getEInvoiceData(
        invoice.invoiceNumber
      );

      setInvoice({
        ...invoice,
        amount: res.data.amount,
        description: res.data.description,
      });

    } catch (error) {

      alert("Invoice Not Found");
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await submitDailyReturn(invoice);

      alert(res.data);

      setInvoice({
        invoiceNumber: "",
        amount: "",
        description: "",
        manualEntry: false,
        justification: "",
        attachmentName: ""
      });

    } catch (error) {

      alert("Submission Failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-10 bg-gray-100 min-h-screen">

        <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl mx-auto">

          <h1 className="text-3xl font-bold mb-6">
            Register Daily Return
          </h1>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="invoiceNumber"
              value={invoice.invoiceNumber}
              placeholder="Invoice Number"
              className="w-full p-3 border rounded mb-4"
              onChange={handleChange}
            />

            <button
              type="button"
              onClick={loadInvoiceData}
              className="bg-green-600 text-white px-4 py-2 rounded mb-4"
            >
              Load E-Invoice Data
            </button>

            <input
              type="number"
              name="amount"
              value={invoice.amount}
              placeholder="Amount"
              className="w-full p-3 border rounded mb-4"
              onChange={handleChange}
            />

            <textarea
              name="description"
              value={invoice.description}
              placeholder="Description"
              className="w-full p-3 border rounded mb-4"
              onChange={handleChange}
            />

            <div className="mb-4">

              <label className="mr-2">
                Manual Entry
              </label>

              <input
                type="checkbox"
                checked={invoice.manualEntry}
                onChange={(e) =>
                  setInvoice({
                    ...invoice,
                    manualEntry: e.target.checked
                  })
                }
              />

            </div>

            <textarea
              name="justification"
              value={invoice.justification}
              placeholder="Justification"
              className="w-full p-3 border rounded mb-4"
              onChange={handleChange}
            />

            <input
              type="text"
              name="attachmentName"
              value={invoice.attachmentName}
              placeholder="Attachment Name"
              className="w-full p-3 border rounded mb-4"
              onChange={handleChange}
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
            >
              Submit Return
            </button>

          </form>

        </div>

      </div>
    </>
  );
}

export default DailyReturn;