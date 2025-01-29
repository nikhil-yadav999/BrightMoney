import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
import { removeBill, setSelectedCategory } from "./store/billSlice";
import BillForm from "./components/BillForm";
import BillChart from "./components/BillChart";
import { Bill } from "./types/bill";
import { PlusCircle, Edit2, Trash2, Moon, Sun } from "lucide-react";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};

function App() {
  const dispatch = useDispatch();
  const { bills, selectedCategory, monthlyBudget } = useSelector(
    (state: RootState) => state.bills
  );

  const [showForm, setShowForm] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode
  const [selectedBills, setSelectedBills] = useState<Bill[]>([]);

  const categories = Array.from(new Set(bills.map((bill) => bill.category)));

  const filteredBills = selectedCategory
    ? bills.filter((bill) => bill.category === selectedCategory)
    : bills;

  const totalAmount = filteredBills.reduce(
    (sum, bill) => sum + parseFloat(bill.amount),
    0
  );

  const calculateOptimalBills = (bills: Bill[], budget: number) => {
    const sortedBills = [...bills].sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
    let total = 0;
    const selected: Bill[] = [];

    for (const bill of sortedBills) {
      if (total + parseFloat(bill.amount) <= budget) {
        selected.push(bill);
        total += parseFloat(bill.amount);
      } else {
        break;
      }
    }

    return selected;
  };

  const handleCalculateOptimalBills = () => {
    const optimalBills = calculateOptimalBills(filteredBills, monthlyBudget);
    setSelectedBills(optimalBills);
  };

  const handleEdit = (bill: Bill) => {
    setEditingBill(bill);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this bill?")) {
      dispatch(removeBill(id));
    }
  };

  useEffect(() => {
    setSelectedBills([]); // Reset selected bills when bills or category changes
  }, [bills, selectedCategory]);

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">💰 Bill Management System</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition"
            >
              <PlusCircle size={20} />
              Add Bill
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <select
            value={selectedCategory || ""}
            onChange={(e) =>
              dispatch(setSelectedCategory(e.target.value || null))
            }
            className="block w-full max-w-xs px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Overview and Chart Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Budget Summary */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="p-4 rounded-lg shadow-lg bg-indigo-600 text-white">
              <p className="text-sm">Total Amount</p>
              <p className="text-2xl font-bold">₹{totalAmount.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-lg shadow-lg bg-green-600 text-white">
              <p className="text-sm">Monthly Budget</p>
              <p className="text-2xl font-bold">₹{monthlyBudget.toFixed(2)}</p>
            </div>
            <button
              onClick={handleCalculateOptimalBills}
              className="p-4 rounded-lg shadow-lg bg-purple-600 hover:bg-purple-700 text-white transition"
            >
              Calculate Optimal Bills
            </button>
          </div>

          {/* Graph Section */}
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Monthly Spending</h2>
            <BillChart bills={filteredBills} />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="w-full bg-gray-800 rounded-lg">
            <thead className="bg-gray-700 text-gray-300">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((bill) => (
                <tr
                  key={bill.id}
                  className={`border-b border-gray-700 ${
                    selectedBills.some((b) => b.id === bill.id)
                      ? "bg-green-800"
                      : "text-white"
                  }`}
                >
                  <td className="px-4 py-3">{bill.description}</td>
                  <td className="px-4 py-3">{bill.category}</td>
                  <td className="px-4 py-3">₹{parseFloat(bill.amount).toFixed(2)}</td>
                  <td className="px-4 py-3">{formatDate(bill.date)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(bill)}
                        className="p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(bill.id)}
                        className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bill Form Modal */}
      {showForm && (
        <BillForm
          onClose={() => {
            setShowForm(false);
            setEditingBill(null);
          }}
          initialData={editingBill || undefined}
        />
      )}
    </div>
  );
}

export default App;