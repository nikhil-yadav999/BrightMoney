/*import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
import { removeBill, setSelectedCategory } from "./store/billSlice";
import BillForm from "./components/BillForm";
import BillChart from "./components/BillChart";
import { Bill } from "./types/bill";
import { PlusCircle, Edit2, Trash2, Moon, Sun } from "lucide-react";

// Date formatting utility function
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};

function App() {
//
const [darkMode, setDarkMode] = useState(false);
<button onClick={() => setDarkMode(!darkMode)}>{darkMode ? <Sun /> : <Moon />}</button>;
//
  const dispatch = useDispatch();
  const { bills, selectedCategory, monthlyBudget } = useSelector(
    (state: RootState) => state.bills
  );
  const [showForm, setShowForm] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);

  const categories = Array.from(new Set(bills.map((bill) => bill.category)));

  const filteredBills = selectedCategory
    ? bills.filter((bill) => bill.category === selectedCategory)
    : bills;

  const totalAmount = filteredBills.reduce(
    (sum, bill) => sum + parseFloat(bill.amount),
    0
  );

  const handleEdit = (bill: Bill) => {
    setEditingBill(bill);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this bill?")) {
      dispatch(removeBill(id));
    }
  };

  const optimizeBills = () => {
    const sortedBills = [...bills].sort(
      (a, b) => parseFloat(a.amount) - parseFloat(b.amount)
    );

    let currentSum = 0;
    const selectedBills: number[] = [];

    for (const bill of sortedBills) {
      if (currentSum + parseFloat(bill.amount) <= monthlyBudget) {
        currentSum += parseFloat(bill.amount);
        selectedBills.push(bill.id);
      }
    }

    return selectedBills;
  };

  const optimizedBillIds = optimizeBills();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-8 transition-colors duration-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Bill Manager
            </h1>
            <div className="flex gap-4 w-full sm:w-auto">
              <button
                onClick={() => setShowForm(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <PlusCircle size={20} />
                Add Bill
              </button>
            </div>
          </div>

          <div className="mb-6">
            <select
              value={selectedCategory || ""}
              onChange={(e) =>
                dispatch(setSelectedCategory(e.target.value || null))
              }
              className="block w-full max-w-xs rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Monthly Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <p className="text-indigo-100 text-sm mb-1">Total Amount</p>
                <p className="text-white text-xl sm:text-2xl font-bold">
                  ₹{totalAmount.toFixed(2)}
                </p>
              </div>

              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <p className="text-emerald-100 text-sm mb-1">Monthly Budget</p>
                <p className="text-white text-xl sm:text-2xl font-bold">
                  ₹{monthlyBudget.toFixed(2)}
                </p>
              </div>
            </div>
            <BillChart bills={filteredBills} />
          </div>

          <div className="overflow-x-auto -mx-4 sm:-mx-6">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="py-3 pl-4 pr-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider sm:pl-6"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="relative py-3 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredBills.map((bill) => (
                      <tr
                        key={bill.id}
                        className={
                          optimizedBillIds.includes(bill.id)
                            ? "bg-green-50 dark:bg-green-900/20"
                            : ""
                        }
                      >
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                          {bill.description}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                          {bill.category}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                          ₹{parseFloat(bill.amount).toFixed(2)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                          {formatDate(bill.date)}
                        </td>
                        <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(bill)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(bill.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default App;*/

/*import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
import { removeBill, setSelectedCategory } from "./store/billSlice";
import BillForm from "./components/BillForm";
import BillChart from "./components/BillChart";
import { Bill } from "./types/bill";
import { PlusCircle, Edit2, Trash2, Moon, Sun } from "lucide-react";

// Date formatting utility function
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
  const [darkMode, setDarkMode] = useState(false);

  const categories = Array.from(new Set(bills.map((bill) => bill.category)));

  const filteredBills = selectedCategory
    ? bills.filter((bill) => bill.category === selectedCategory)
    : bills;

  const totalAmount = filteredBills.reduce(
    (sum, bill) => sum + parseFloat(bill.amount),
    0
  );

  const handleEdit = (bill: Bill) => {
    setEditingBill(bill);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this bill?")) {
      dispatch(removeBill(id));
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header *//*}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">💰 Bill Manager</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              <PlusCircle size={20} />
              Add Bill
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        {/* Category Filter *//*}
        <div className="mb-6">
          <select
            value={selectedCategory || ""}
            onChange={(e) =>
              dispatch(setSelectedCategory(e.target.value || null))
            }
            className="block w-full max-w-xs px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Monthly Overview *//*}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-lg shadow-lg bg-indigo-500 text-white">
            <p className="text-sm">Total Amount</p>
            <p className="text-2xl font-bold">₹{totalAmount.toFixed(2)}</p>
          </div>
          <div className="p-4 rounded-lg shadow-lg bg-green-500 text-white">
            <p className="text-sm">Monthly Budget</p>
            <p className="text-2xl font-bold">₹{monthlyBudget.toFixed(2)}</p>
          </div>
        </div>

        <BillChart bills={filteredBills} />

        {/* Table *//*}
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-700">
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
                <tr key={bill.id} className="border-b dark:border-gray-700">
                  <td className="px-4 py-3">{bill.description}</td>
                  <td className="px-4 py-3">{bill.category}</td>
                  <td className="px-4 py-3">₹{parseFloat(bill.amount).toFixed(2)}</td>
                  <td className="px-4 py-3">{formatDate(bill.date)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(bill)}
                        className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
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

      {/* Bill Form Modal *//*}
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
*/
/*import { useState } from "react";
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

  const categories = Array.from(new Set(bills.map((bill) => bill.category)));

  const filteredBills = selectedCategory
    ? bills.filter((bill) => bill.category === selectedCategory)
    : bills;

  const totalAmount = filteredBills.reduce(
    (sum, bill) => sum + parseFloat(bill.amount),
    0
  );

  const handleEdit = (bill: Bill) => {
    setEditingBill(bill);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this bill?")) {
      dispatch(removeBill(id));
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header *//*}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">💰 Bill Manager</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
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

        {/* Category Filter *//*}
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

        {/* Overview and Chart Layout *//*}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Budget Summary *//*}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="p-4 rounded-lg shadow-lg bg-indigo-600 text-white">
              <p className="text-sm">Total Amount</p>
              <p className="text-2xl font-bold">₹{totalAmount.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-lg shadow-lg bg-green-600 text-white">
              <p className="text-sm">Monthly Budget</p>
              <p className="text-2xl font-bold">₹{monthlyBudget.toFixed(2)}</p>
            </div>
          </div>

          {/* Graph Section *//*}
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Spending Overview</h2>
            <BillChart bills={filteredBills} />
          </div>
        </div>

        {/* Table *//*}
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
                <tr key={bill.id} className="border-b border-gray-700 text-white">
                  <td className="px-4 py-3">{bill.description}</td>
                  <td className="px-4 py-3">{bill.category}</td>
                  <td className="px-4 py-3">₹{parseFloat(bill.amount).toFixed(2)}</td>
                  <td className="px-4 py-3">{formatDate(bill.date)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(bill)}
                        className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
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

      {/* Bill Form Modal *//*}
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
*/
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