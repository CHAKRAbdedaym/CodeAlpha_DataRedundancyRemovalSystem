import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileUp, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const CSVUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith('.csv')) {
      setFile(droppedFile);
      setError(null);
    } else {
      setError('Please upload a valid CSV file.');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/upload-csv', formData);
      setResult(response.data);
      if (onUploadSuccess) onUploadSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload CSV file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div 
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all ${
          file ? 'border-blue-400 bg-blue-50/30' : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
        }`}
      >
        <div className={`p-4 rounded-full mb-4 ${file ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
          {file ? <FileUp size={32} /> : <Upload size={32} />}
        </div>
        
        {file ? (
          <div className="text-center">
            <p className="text-gray-900 font-semibold mb-1">{file.name}</p>
            <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-900 font-semibold mb-1">Upload your CSV dataset</p>
            <p className="text-sm text-gray-500">Drag and drop or click to browse</p>
          </div>
        )}
        
        <input 
          type="file" 
          id="fileInput" 
          className="hidden" 
          accept=".csv" 
          onChange={handleFileChange}
        />
        <label 
          htmlFor="fileInput"
          className="mt-6 px-6 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          {file ? 'Change File' : 'Select File'}
        </label>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!file || loading}
        className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
          !file || loading 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Processing Records...
          </>
        ) : (
          'Process Dataset'
        )}
      </button>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {result && (
        <div className="p-6 bg-green-50 border border-green-100 rounded-2xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3 text-green-700">
            <CheckCircle size={24} />
            <p className="font-bold">File Processed Successfully</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded-xl border border-green-100">
              <p className="text-xs text-gray-500 mb-1 uppercase font-bold tracking-tighter">Total</p>
              <p className="text-lg font-bold text-gray-900">{result.summary.total_records}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-green-100">
              <p className="text-xs text-gray-500 mb-1 uppercase font-bold tracking-tighter text-blue-600">Unique</p>
              <p className="text-lg font-bold text-blue-600">{result.summary.unique_records}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-green-100">
              <p className="text-xs text-gray-500 mb-1 uppercase font-bold tracking-tighter text-red-600">Duplicate</p>
              <p className="text-lg font-bold text-red-600">{result.summary.duplicate_records}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CSVUpload;
