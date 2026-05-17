import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { getAllReturns } from "../services/dailyReturnService";

function ReturnHistory() {

  const [returns, setReturns] = useState([]);

  useEffect(() => {

    fetchReturns();

  }, []);

  const fetchReturns = async () => {

    try {

      const res = await getAllReturns();

      setReturns(res.data);

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-10 bg-gray-100 min-h-screen">

        <h1 className="text-3xl font-bold mb-6">
          Daily Return History
        </h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-blue-600 text-white">

              <tr>
                <th className="p-4">Invoice</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Description</th>
                <th className="p-4">Date</th>
              </tr>

            </thead>

            <tbody>

              {returns.map((item) => (

                <tr
                  key={item.id}
                  className="border-b"
                >

                  <td className="p-4">
                    {item.invoiceNumber}
                  </td>

                  <td className="p-4">
                    {item.amount}
                  </td>

                  <td className="p-4">
                    {item.description}
                  </td>

                  <td className="p-4">
                    {item.submissionDate}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>
    </>
  );
}

export default ReturnHistory;