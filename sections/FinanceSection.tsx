
import React, { useState } from 'react';
import { fastFlashResponse } from '../services/geminiService';
import { BudgetEntry } from '../types';

const FinanceSection: React.FC = () => {
  const [entries, setEntries] = useState<BudgetEntry[]>([]);
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const totalIncome = entries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
  const totalExpense = entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
  const balance = totalIncome - totalExpense;

  const addEntry = () => {
    if (!label || !amount) return;
    setEntries([...entries, { id: Math.random().toString(), label, amount: parseFloat(amount), type }]);
    setLabel('');
    setAmount('');
  };

  const getQuickTip = async () => {
    setLoading(true);
    const summary = entries.map(e => `${e.label}: $${e.amount} (${e.type})`).join(', ');
    const prompt = `Based on these budget items: ${summary}. Current balance is $${balance}. Give me one short, helpful, empathetic financial tip for someone recently released from prison or in recovery.`;
    try {
      const tip = await fastFlashResponse(prompt);
      setAiTip(tip || null);
    } finally {
      setLoading(false);
    }
  };

  // Chart Logic
  const maxVal = Math.max(totalIncome, totalExpense, 1);
  const incomeHeight = (totalIncome / maxVal) * 100;
  const expenseHeight = (totalExpense / maxVal) * 100;

  const financialResources = [
    { title: "Credit Builder Basics", desc: "How to safely start building credit after time away.", icon: "fa-credit-card" },
    { title: "Emergency Savings", desc: "Starting your first $500 safety net.", icon: "fa-piggy-bank" },
    { title: "ID & Documentation", desc: "Finding help to pay for vital records.", icon: "fa-id-card" },
    { title: "Low-Cost Banking", desc: "Second-chance checking accounts.", icon: "fa-building-columns" }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Money Management</h2>
          <p className="text-slate-500 mt-2">Take control of your future, one dollar at a time.</p>
        </div>
        <div className="bg-slate-100 px-4 py-2 rounded-full text-xs font-bold text-slate-500 uppercase tracking-widest">
          Financial Freedom Path
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
          <p className="text-slate-400 text-sm font-semibold uppercase">Income</p>
          <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
          <p className="text-slate-400 text-sm font-semibold uppercase">Expenses</p>
          <p className="text-2xl font-bold text-red-600">${totalExpense.toFixed(2)}</p>
        </div>
        <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center ${balance < 0 ? 'bg-red-50' : 'bg-green-50'}`}>
          <p className="text-slate-400 text-sm font-semibold uppercase">Balance</p>
          <p className={`text-2xl font-bold ${balance < 0 ? 'text-red-700' : 'text-green-700'}`}>${balance.toFixed(2)}</p>
        </div>
      </div>

      {/* Visual Representation & Entry Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <i className="fa-solid fa-chart-simple text-blue-500"></i> Visual Summary
          </h3>
          
          <div className="h-64 flex items-end justify-around border-b border-slate-100 pb-2 relative mb-8 px-8">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
              <div className="border-t border-slate-400 w-full"></div>
              <div className="border-t border-slate-400 w-full"></div>
              <div className="border-t border-slate-400 w-full"></div>
            </div>

            {/* Income Bar */}
            <div className="group relative flex flex-col items-center w-24">
              <div 
                className="w-full bg-green-500 rounded-t-xl transition-all duration-700 ease-out shadow-lg shadow-green-200"
                style={{ height: `${incomeHeight}%`, minHeight: totalIncome > 0 ? '4px' : '0' }}
              ></div>
              <span className="text-xs font-bold text-slate-400 mt-3 uppercase tracking-wider">Income</span>
              <div className="absolute -top-8 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                ${totalIncome.toFixed(0)}
              </div>
            </div>

            {/* Expense Bar */}
            <div className="group relative flex flex-col items-center w-24">
              <div 
                className="w-full bg-red-500 rounded-t-xl transition-all duration-700 ease-out shadow-lg shadow-red-200"
                style={{ height: `${expenseHeight}%`, minHeight: totalExpense > 0 ? '4px' : '0' }}
              ></div>
              <span className="text-xs font-bold text-slate-400 mt-3 uppercase tracking-wider">Expenses</span>
              <div className="absolute -top-8 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                ${totalExpense.toFixed(0)}
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-4">Add Transaction</h3>
          <div className="space-y-4">
            <input 
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="What's it for? (e.g., Bus Pass, Salary)" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all"
            />
            <div className="flex gap-2">
              <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00" 
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all"
              />
              <select 
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all cursor-pointer font-bold text-slate-600"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <button 
              onClick={addEntry}
              className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl hover:bg-black transition-all shadow-lg active:scale-95"
            >
              Add Item
            </button>
          </div>

          <div className="mt-8">
            <h4 className="font-bold text-slate-400 text-[10px] uppercase mb-4 tracking-widest border-b border-slate-50 pb-2">Recent Items</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scroll pr-2">
              {entries.map(e => (
                <div key={e.id} className="flex justify-between items-center p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${e.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="font-semibold text-sm">{e.label}</span>
                  </div>
                  <span className={e.type === 'income' ? 'text-green-600 font-bold text-sm' : 'text-slate-600 text-sm'}>
                    {e.type === 'income' ? '+' : '-'}${e.amount.toFixed(2)}
                  </span>
                </div>
              ))}
              {entries.length === 0 && <p className="text-slate-400 italic text-sm text-center py-4">No transactions yet. Add your first item to see stats.</p>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* AI Tip Section */}
          <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
            <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <i className="fa-solid fa-wand-magic-sparkles"></i> Peer AI Feedback
            </h3>
            <p className="mb-6 text-blue-100 leading-relaxed">Need advice on your current spending? Our peer-support AI can give you a boost.</p>
            <button 
              onClick={getQuickTip}
              disabled={loading || entries.length === 0}
              className="bg-white text-blue-600 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-all disabled:opacity-50 active:scale-95 flex items-center gap-2"
            >
              {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-bolt"></i>}
              {loading ? 'Thinking...' : 'Get Peer Financial Tip'}
            </button>
            {aiTip && (
              <div className="mt-6 bg-white/10 p-5 rounded-2xl border border-white/20 backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
                <p className="text-sm leading-relaxed italic">"{aiTip}"</p>
              </div>
            )}
          </div>

          {/* Financial Resources List */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <i className="fa-solid fa-book-open text-orange-500"></i> Success Resources
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {financialResources.map((res, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl border border-slate-50 hover:border-blue-100 hover:bg-blue-50 transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                    <i className={`fa-solid ${res.icon} text-lg`}></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{res.title}</h4>
                    <p className="text-xs text-slate-500 leading-tight mt-1">{res.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 text-slate-400 text-xs font-bold uppercase rounded-xl hover:border-slate-400 hover:text-slate-600 transition-all">
              View All Financial Guides
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceSection;
