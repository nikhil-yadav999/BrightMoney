import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addBill, editBill } from '../store/billSlice';
import { Bill } from '../types/bill';
import { X } from 'lucide-react';
import { format } from 'date-fns';

interface BillFormProps {
  onClose: () => void;
  initialData?: Bill;
}

const BillForm: React.FC<BillFormProps> = ({ onClose, initialData }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<Omit<Bill, 'id'>>(
    initialData || {
      description: '',
      category: '',
      amount: '',
      date: format(new Date(), 'MM-dd-yyyy')
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [month, day, year] = formData.date.split('-');
    const formattedDate = `${month}-${day}-${year}`;
    
    if (initialData) {
      dispatch(editBill({ ...formData, date: formattedDate, id: initialData.id }));
    } else {
      dispatch(addBill({ ...formData, date: formattedDate, id: Date.now() }));
    }
    onClose();
  };

  const getInputDate = (dateString: string) => {
    if (dateString.includes('-')) {
      const [year, month, day] = dateString.split('-');
      return `${year}-${month}-${day}`;
    }
    return dateString;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-4 sm:p-6 w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            {initialData ? 'Edit Bill' : 'Add New Bill'}
          </h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
            <input
              type="date"
              value={getInputDate(formData.date)}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {initialData ? 'Update' : 'Add'} Bill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BillForm;
